import { For, Show } from "solid-js";
import { RouteDataArgs, useParams, useRouteData } from "solid-start";
import {
    createServerData$,
    redirect,
} from "solid-start/server";
import Header from "~/components/header";
import QuestionComponent from "~/components/questionTypes/question";
import { db } from "~/db";
import { getUser } from "~/db/session";
import { formatDate } from "~/utils/dateformat";

export function routeData({ params }: RouteDataArgs) {
    return createServerData$(async (_, { request }) => {
        const user = await getUser(request);

        if (!user) {
            throw redirect("/login");
        }

        const entry = await db.entry.findOne({ where: { userId: user.id, id: params.id } });

        if (!entry) {
            throw redirect("/journal");
        }

        const prompt = await db.prompt.findOne({ where: { id: entry?.promptId } });
        
        if (!prompt) {
            throw redirect("/journal");
        }

        return { user, entry, prompt };
    });
}

export default function Entry() {
    const data = useRouteData<typeof routeData>();

    const entry = data()?.entry;
    const prompt = data()?.prompt;

    return (
        <main class="w-full p-4 space-y-2">
            <Header home={false} title={prompt?.text || ''}/>
            <h2>{entry ? formatDate(entry.date) : '??/??/??'}</h2>

            <Show when={prompt?.questions !== undefined && entry?.answers !== undefined}>
                <div class="questions">
                    <For each={prompt?.questions}>{(question, index) =>
                        <QuestionComponent question={question} answer={entry?.answers[index()]} editable={false} index={index()}/>
                    }</For>
                </div>
            </Show>
        </main>
    );
}
