import { Show } from "solid-js";
import { createServerAction$, redirect } from "solid-start/server";
import HomeIcon from "./icons/home";
import JournalIcon from "./icons/journal";
import ProfileIcon from "./icons/profile";

export default function Header({ title, home, admin }: { title: string, home: boolean, admin?: boolean }) {
    const [, { Form: HomeForm }] = createServerAction$(async (f: FormData, { request }) => {
        throw redirect(admin ? "/admin" : "/journal")
    });

    const [, { Form: ProfileForm }] = createServerAction$(async (f: FormData, { request }) => {
        throw redirect(admin ? "/profile?admin=true" : "/profile")
    });

    return <div class="header">
        <h1 class="header-title">
            {title}
        </h1>
        <div class="empty-space" />
        <Show when={!home}>
            <HomeForm>
                <button class="icon-button" name="home" type="submit">
                    <HomeIcon width="2rem" height="2rem" fill="var(--fill)"/>  
                </button>
            </HomeForm>
        </Show>
        <Show when={home}>
            <ProfileForm>
                <button class="icon-button" name="home" type="submit">
                    <ProfileIcon width="2rem" height="2rem" fill="var(--fill)"/>  
                </button>
            </ProfileForm>
        </Show>
    </div>
}
