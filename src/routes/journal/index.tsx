import { For, Show } from "solid-js";
import { useRouteData } from "solid-start";
import {
    createServerAction$,
    createServerData$,
    redirect,
} from "solid-start/server";
import Header from "~/components/header";
import LinkList from "~/components/linkList";
import { getUser, logout } from "~/db/session";
import { Link } from "~/models/link";
import { getEntries, getNotifications } from "~/services/links";
import { useTranslate } from "~/utils/translate";

export function routeData() {
    return createServerData$(async (_, { request }) => {
        const user = await getUser(request);

        if (!user) {
            throw redirect("/login");
        }

        const notifications = await getNotifications(user.id);
        const entries = await getEntries(user.id);

        return { user, notifications, entries };
    });
}

export default function Home() {
    const data = useRouteData<typeof routeData>();
    const { t } = useTranslate();
    const [, { Form }] = createServerAction$((f: FormData, { request }) =>
        logout(request)
    );

    return (
        <main class="w-full p-4 space-y-2">
            <Header home={true} title={t('journal--greeting', { name: data()?.user.name })}/>
            <Show when={data()?.notifications !== undefined}>
                <LinkList title={t('journal--notification-list')} links={data()?.notifications as Link[]}/>
            </Show>
            <Show when={data()?.entries !== undefined}>
                <LinkList title={t('journal--entry-list')} links={data()?.entries as Link[]}/>
            </Show>
        </main>
    );
}
