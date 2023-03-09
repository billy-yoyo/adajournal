import { createSignal, For, Show } from "solid-js";
import { useRouteData } from "solid-start";
import {
    createServerAction$,
    createServerData$,
    redirect,
} from "solid-start/server";
import Header from "~/components/header";
import QuestionEditorComponent from "~/components/questionEditor/question";
import { getUser } from "~/db/session";
import { Question } from "~/models/entry";
import { useTranslate } from "~/utils/translate";

export function routeData() {
    return createServerData$(async (_, { request }) => {
        const user = await getUser(request);

        if (!user) {
            throw redirect("/login");
        }

        return { user };
    });
}

export default function Home() {
    const data = useRouteData<typeof routeData>();
    const { t } = useTranslate();
    const [creating, { Form: CreatePromptForm }] = createServerAction$((f: FormData, { request }) => {
        // TODO
        throw redirect("/admin/createPrompt")
    });

    const [questions, setQuestions] = createSignal<number[]>([]);

    const createQuestion = () => {
        if (questions().length === 0) {
            setQuestions([0]);
        } else {
            setQuestions(questions().concat([Math.max(...questions()) + 1]));
        }
    };

    const deleteQuestion = (id: number) => {
        setQuestions(questions().filter(qid => qid !== id));
    };

    return (
        <main class="w-full p-4 space-y-2">
            <Header title={t('create-prompt--title')} home={false} admin={true}/>
            <CreatePromptForm>
                <div class="input-container">
                    <label for="text-input">{t('create-prompt--text')}</label>
                    <input name="text" value={creating.error?.fields?.text || ''} />
                </div>
                <Show when={creating.error?.fieldErrors?.text}>
                    <p role="alert">{creating.error.fieldErrors.text}</p>
                </Show>

                <For each={questions()}>{(id) =>
                    <QuestionEditorComponent creating={creating} id={id} deleteQuestion={deleteQuestion} />
                }</For>
                <button onClick={createQuestion}>{t('create-prompt--add-question')}</button>

                <button type="submit">{t('create-prompt--submit')}</button>
            </CreatePromptForm>
        </main>
    );
}
