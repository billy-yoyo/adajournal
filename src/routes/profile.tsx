import { For, Show } from "solid-js";
import { RouteDataArgs, useRouteData } from "solid-start";
import {
    createServerAction$,
    createServerData$,
    redirect,
} from "solid-start/server";
import Header from "~/components/header";
import { getUser, logout } from "~/db/session";
import { getEntries, getNotifications } from "~/services/links";
import { formatDate } from "~/utils/dateformat";
import { useTranslate } from "~/utils/translate";

export function routeData({ location }: RouteDataArgs) {
    return createServerData$(async (_, { request }) => {
        const user = await getUser(request);

        if (!user) {
            throw redirect("/login");
        }

        const notifications = await getNotifications(user.id);
        const entries = await getEntries(user.id);

        return { user, notifications, entries, admin: location.query.admin === 'true' };
    });
}

export default function Profile() {
    const data = useRouteData<typeof routeData>();
    const { t } = useTranslate();
    const [, { Form: LogoutForm }] = createServerAction$((f: FormData, { request }) =>
        logout(request)
    );

    const user = data()?.user;

    return (
        <main class="w-full p-4 space-y-2">
            <Header home={false} title={t('profile--title', { name: user?.name })} admin={data()?.admin}/>
            
            <div class="input-container">
                <label for="username-input">{t('profile--username')}</label>
                <input name="username" value={user?.username} disabled/>
            </div>

            <div class="input-container">
                <label for="name-input">{t('profile--name')}</label>
                <input name="name" value={user?.name} disabled/>
            </div>

            <div class="input-container">
                <label for="arrived-input">{t('profile--arrived')}</label>
                <input name="arrived" type="text" value={user ? formatDate(user.arrived) : ''} disabled/>
            </div>

            <div class="input-container">
                <label for="started-input">{t('profile--started')}</label>
                <input name="started" type="text" value={user ? formatDate(user.started) : ''} disabled/>
            </div>

            <LogoutForm>
                <button name="logout" type="submit">
                    {t('profile--logout')}
                </button>
            </LogoutForm>
        </main>
    );
}
