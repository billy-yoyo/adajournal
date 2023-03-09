import { redirect } from "solid-start/server";
import { createCookieSessionStorage } from "solid-start/session";
import { LoginForm, RegisterForm } from "~/models/forms";
import { db } from ".";
import * as bcrypt from "bcrypt";
import { User } from "~/models/user";

const removeSensitiveFields = (user: User): User => {
    return {
        ...user,
        passwordHash: ''
    }
};

export async function register(form: RegisterForm) {
    const passwordHash = await bcrypt.hash(form.password, 10);

    const user = await db.user.insert({
        id: '', // will be auto-incremented
        username: form.username,
        passwordHash,
        name: form.name,
        arrived: form.arrived,
        started: form.started,
        created: new Date()
    });

    const prompt = await db.prompt.findOne({ where: {} });

    if (prompt) {
        await db.userPrompt.insert({
            id: '',
            userId: user.id,
            promptId: prompt.id,
            date: new Date(),
            completed: false
        });
        await db.entry.insert({
            id: '',
            userId: user.id,
            promptId: prompt.id,
            date: new Date(),
            answers: prompt.questions.map(() => "choice-1")
        });
    }

    return user;
}

export async function login({ username, password }: LoginForm) {
    const user = await db.user.findOne({ where: { username } });
    if (!user) {
        return null;
    }

    const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isCorrectPassword) {
        return null;
    }

    return removeSensitiveFields(user);
}

//const sessionSecret = import.meta.env.SESSION_SECRET;

const storage = createCookieSessionStorage({
    cookie: {
        name: "RJ_session",
        // secure doesn't work on localhost for Safari
        // https://web.dev/when-to-use-local-https/
        secure: true,
        secrets: ["hello"],
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: true,
    },
});

export function getUserSession(request: Request) {
    return storage.getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request) {
    const session = await getUserSession(request);
    console.log(session);
    const userId = session.get("userId");
    console.log(userId);
    if (!userId || typeof userId !== "string") return null;
    return userId;
}

export async function requireUserId(
    request: Request,
    redirectTo: string = new URL(request.url).pathname
) {
    const session = await getUserSession(request);
    const userId = session.get("userId");
    if (!userId || typeof userId !== "string") {
        const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
        throw redirect(`/login?${searchParams}`);
    }
    return userId;
}

export async function getUser(request: Request) {
    const userId = await getUserId(request);
    if (typeof userId !== "string") {
        return null;
    }

    try {
        const user = await db.user.findOne({ where: { id: userId } });
        return user ? removeSensitiveFields(user) : user;
    } catch {
        throw logout(request);
    }
}

export async function logout(request: Request) {
    const session = await storage.getSession(request.headers.get("Cookie"));
    return redirect("/login", {
        headers: {
            "Set-Cookie": await storage.destroySession(session),
        },
    });
}

export async function createUserSession(userId: string, redirectTo: string) {
    const session = await storage.getSession();
    session.set("userId", userId);
    return redirect(redirectTo, {
        headers: {
            "Set-Cookie": await storage.commitSession(session),
        },
    });
}
