import { Show } from "solid-js";
import { useParams, useRouteData } from "solid-start";
import { FormError } from "solid-start/data";
import {
    createServerAction$,
    createServerData$,
    redirect,
} from "solid-start/server";
import { db } from "~/db";
import { createUserSession, getUser, register } from "~/db/session";
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

function validateName(name: unknown) {
    if (typeof name !== "string" || name.length > 256) {
        return `Name cannot be longer than 256 characters`;
    }
}

function validDate(dateString: string) {
    const asDate = new Date(dateString);
    return !isNaN(asDate.getTime());
}

function validateArrived(arrived: unknown) {
    if (typeof arrived !== "string" || !validDate(arrived)) {
        return `Arrived must be a valid date`;
    }
}

function validateStarted(started: unknown) {
    if (typeof started !== "string" || !validDate(started)) {
        return `Started must be a valid date`;
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

export default function Register() {
    const data = useRouteData<typeof routeData>();
    const { t } = useTranslate();
    const params = useParams();

    const [loggingIn, { Form }] = createServerAction$(async (form: FormData) => {
        const username = form.get("username");
        const password = form.get("password");
        const confirmPassword = form.get("confirmPassword");
        const name = form.get("name");
        const arrived = form.get("arrived");
        const started = form.get("started");
        const redirectTo = form.get("redirectTo") || "/journal";
        if (
            typeof username !== "string" ||
            typeof password !== "string" ||
            typeof confirmPassword !== "string" ||
            typeof name !== "string" ||
            typeof arrived !== "string" ||
            typeof started !== "string" ||
            typeof redirectTo !== "string"
        ) {
            throw new FormError(`Form not submitted correctly.`);
        }

        const fields = { username, name, arrived, started };
        const fieldErrors = {
            username: validateUsername(username),
            password: validatePassword(password),
            confirmPassword: validatePassword(confirmPassword),
            name: validateName(name),
            arrived: validateArrived(arrived),
            started: validateStarted(started)
        };
        if (Object.values(fieldErrors).some(Boolean)) {
            throw new FormError("Fields invalid", { fieldErrors, fields });
        }

        if (password !== confirmPassword) {
            throw new FormError(`Passwords don't match`, {
                fieldErrors: {
                    confirmPassword: `Password doesn't match`
                },
                fields
            });
        }

        const userExists = await db.user.findOne({ where: { username } });
        if (userExists) {
            throw new FormError(`User with username ${username} already exists`, {
                fields,
            });
        }

        const user = await register({
            username,
            password,
            name,
            arrived: new Date(arrived),
            started: new Date(started)
        });

        if (!user) {
            throw new FormError(
                `Something went wrong trying to create a new user.`,
                {
                    fields,
                }
            );
        }

        return createUserSession(`${user.id}`, redirectTo);
    });

    return (
        <main>
            <h1>{t('register--title')}</h1>
            <h4>{t('register--have-account')} <a href="/login">{t('register--login-here')}</a></h4>
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
                    <input name="password" type="password" />
                </div>
                <Show when={loggingIn.error?.fieldErrors?.password}>
                    <p role="alert">{loggingIn.error.fieldErrors.password}</p>
                </Show>
                <div class="input-container">
                    <label for="confirmPassword-input">{t('profile--confirm-password')}</label>
                    <input name="confirmPassword" type="password" />
                </div>
                <Show when={loggingIn.error?.fieldErrors?.confirmPassword}>
                    <p role="alert">{loggingIn.error.fieldErrors.confirmPassword}</p>
                </Show>
                <div class="input-container">
                    <label for="name-input">{t('profile--name')}</label>
                    <input name="name" value={loggingIn.error?.fields?.name || ''}/>
                </div>
                <Show when={loggingIn.error?.fieldErrors?.name}>
                    <p role="alert">{loggingIn.error.fieldErrors.name}</p>
                </Show>
                <div class="input-container">
                    <label for="arrived-input">{t('profile--arrived')}</label>
                    <input name="arrived" type="date" value={loggingIn.error?.fields?.arrived || ''} />
                </div>
                <Show when={loggingIn.error?.fieldErrors?.arrived}>
                    <p role="alert">{loggingIn.error.fieldErrors.arrived}</p>
                </Show>
                <div class="input-container">
                    <label for="started-input">{t('profile--started')}</label>
                    <input name="started" type="date" value={loggingIn.error?.fields?.started || ''}/>
                </div>
                <Show when={loggingIn.error?.fieldErrors?.started}>
                    <p role="alert">{loggingIn.error.fieldErrors.started}</p>
                </Show>
                <Show when={loggingIn.error}>
                    <p role="alert" id="error-message">
                        {loggingIn.error.message}
                    </p>
                </Show>
                <button type="submit">{data() ? t('register--register-button') : ""}</button>
            </Form>
        </main>
    );
}
