import { Show } from "solid-js";
import { useParams, useRouteData } from "solid-start";
import { FormError } from "solid-start/data";
import {
    createServerAction$,
    createServerData$,
    redirect,
} from "solid-start/server";
import { createUserSession, getUser, login } from "~/db/session";
import { useTranslate } from "~/utils/translate";

function validateUsername(username: unknown) {
    if (typeof username !== "string" || username.length < 3) {
        return `Usernames must be at least 3 characters long`;
    }
}

function validatePassword(password: unknown) {
    if (typeof password !== "string" || password.length < 6) {
        return `Passwords must be at least 6 characters long`;
    }
}

export function routeData() {
    return createServerData$(async (_, { request }) => {
        if (await getUser(request)) {
            throw redirect("/");
        }
        return {};
    });
}

export default function Login() {
    const data = useRouteData<typeof routeData>();
    const { t } = useTranslate();
    const params = useParams();

    const [loggingIn, { Form }] = createServerAction$(async (form: FormData) => {
        const username = form.get("username");
        const password = form.get("password");
        const redirectTo = form.get("redirectTo") || "/journal";
        if (
            typeof username !== "string" ||
            typeof password !== "string" ||
            typeof redirectTo !== "string"
        ) {
            throw new FormError(`Form not submitted correctly.`);
        }

        const fields = { username };
        const fieldErrors = {
            username: validateUsername(username),
            password: validatePassword(password),
        };
        if (Object.values(fieldErrors).some(Boolean)) {
            throw new FormError("Fields invalid", { fieldErrors, fields });
        }

        const user = await login({ username, password });
        if (!user) {
            throw new FormError(`Username/Password combination is incorrect`, {
                fields,
            });
        }

        return createUserSession(`${user.id}`, redirectTo);
    });

    return (
        <main>
            <h1>{t('login--title')}</h1>
            <h4>{t('login--no-account')} <a href="/register">{t('login--register-here')}</a></h4>
            <Form>
                <input
                    type="hidden"
                    name="redirectTo"
                    value={params.redirectTo ?? "/journal"}
                />
                <div class="input-container">
                    <label for="username-input">{t('profile--username')}</label>
                    <input name="username" value={loggingIn.error?.fields?.username || ''} />
                </div>
                <Show when={loggingIn.error?.fieldErrors?.username}>
                    <p role="alert">{loggingIn.error.fieldErrors.username}</p>
                </Show>
                <div class="input-container">
                    <label for="password-input">{t('profile--password')}</label>
                    <input name="password" type="password" placeholder="twixrox" />
                </div>
                <Show when={loggingIn.error?.fieldErrors?.password}>
                    <p role="alert">{loggingIn.error.fieldErrors.password}</p>
                </Show>
                <Show when={loggingIn.error}>
                    <p role="alert" id="error-message">
                        {loggingIn.error.message}
                    </p>
                </Show>
                <button type="submit">{data() ? t('login--login-button') : ""}</button>
            </Form>
        </main>
    );
}
