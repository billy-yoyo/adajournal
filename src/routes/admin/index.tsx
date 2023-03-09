import { Show } from "solid-js";
import { useRouteData } from "solid-start";
import {
    createServerAction$,
    createServerData$,
    redirect,
} from "solid-start/server";
import Header from "~/components/header";
import LinkList from "~/components/linkList";
import { getUser } from "~/db/session";
import { Link } from "~/models/link";
import { getAdminPrompts } from "~/services/links";
import { useTranslate } from "~/utils/translate";

export function routeData() {
    return createServerData$(async (_, { request }) => {
        const user = await getUser(request);
        const { t } = useTranslate();

        if (!user) {
            throw redirect("/login");
        }

        const prompts = await getAdminPrompts(t);

        return { user, prompts };
    });
}

export default function Home() {
    const data = useRouteData<typeof routeData>();
    const { t } = useTranslate();
    const [, { Form: CreatePromptForm }] = createServerAction$((f: FormData, { request }) => {
        throw redirect("/admin/createPrompt")
    });

    return (
        <main class="w-full p-4 space-y-2">
            <Header title={t('admin--title', { name: data()?.user.name })} home={true} admin={true}/>
            <CreatePromptForm>
                <button type="submit">{t('admin--create-new-prompt')}</button>
            </CreatePromptForm>
            <Show when={data()?.prompts !== undefined}>
                <LinkList title={t('admin--prompt-list')} links={data()?.prompts as Link[]}/>
            </Show>
        </main>
    );
}
