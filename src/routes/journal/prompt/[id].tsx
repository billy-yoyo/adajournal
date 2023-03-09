import { For, Show } from "solid-js";
import { FormError, RouteDataArgs, useParams, useRouteData } from "solid-start";
import {
    createServerAction$,
    createServerData$,
    redirect,
} from "solid-start/server";
import Header from "~/components/header";
import QuestionComponent from "~/components/questionTypes/question";
import { db } from "~/db";
import { getUser } from "~/db/session";
import { Entry } from "~/models/entry";
import { useTranslate } from "~/utils/translate";

export function routeData({ params }: RouteDataArgs) {
    return createServerData$(async (_, { request }) => {
        const user = await getUser(request);

        if (!user) {
            throw redirect("/login");
        }

        const userPrompt = await db.userPrompt.findOne({ where: { userId: user.id, promptId: params.id } });

        if (!userPrompt) {
            throw redirect("/journal");
        }

        const prompt = await db.prompt.findOne({ where: { id: params.id } });

        if (!prompt) {
            throw redirect("/journal");
        }

        return { user, prompt };
    });
}

export default function Entry() {
    const data = useRouteData<typeof routeData>();
    const { t } = useTranslate();
    const [submitting, { Form: SubmitForm }] = createServerAction$(async (form: FormData, { request }) => {
        const user = await getUser(request);

        if (!user) {
            return redirect(`/login`);
        }

        const promptId = form.get("promptId") as string;
        if (!promptId) {
            throw new FormError(t("errors--server-error"));
        }

        const userPrompt = await db.userPrompt.findOne({ where: { userId: user.id, promptId } });
        
        if (!userPrompt) {
            throw new FormError(t("errors--server-error"));
        }

        const answers = data()?.prompt?.questions.map((_, index) => form.get(`question-${index}`)) || [];

        const missingAnswers = answers.map((a, i) => [a, i]).filter(([a, i]) => !a).map(([a, i]) => [i, t('prompt--missing-answer')]);
        if (missingAnswers.length > 0) {
            const fieldErrors = Object.fromEntries(missingAnswers);
            throw new FormError(t("prompt--missing-answers"), { fieldErrors, fields: answers })
        }

        const entry: Entry = {
            id: '',
            userId: user?.id,
            date: new Date(),
            answers,
            promptId: promptId.toString()
        };

        const createdEntry = await db.entry.insert(entry);
        await db.userPrompt.delete({ where: { userId: user.id, promptId } });

        return redirect(`/journal/entry/${createdEntry.id}`);
    });

    const prompt = data()?.prompt;

    return (
        <main class="w-full p-4 space-y-2">
            <Header home={false} title={prompt?.text || ''}/>
            <SubmitForm>
                <input type="hidden" name="promptId" value={prompt?.id} />

                <Show when={prompt?.questions !== undefined}>
                    <div class="questions">
                        <For each={prompt?.questions}>{(question, index) =>
                            <QuestionComponent question={question}
                                answer={submitting?.error?.fields[index()]}
                                editable={true}
                                error={submitting?.error?.fieldErrors[index()]}
                                index={index()}/>
                        }</For>
                    </div>
                </Show>

                <Show when={submitting.error}>
                    <p role="alert" id="error-message">
                        {submitting.error.message}
                    </p>
                </Show>

                <button name="s" type="submit">
                    {t('prompt--submit')}
                </button>
            </SubmitForm>
        </main>
    );
}
