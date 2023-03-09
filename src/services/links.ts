import { db } from "~/db";
import { Link } from "~/models/link";
import { unique } from "~/utils/array";
import { formatDate } from "~/utils/dateformat";
import { Translator } from "~/utils/translate";

export const getAdminPrompts = async (t: Translator): Promise<Link[]> => {
    const prompts = await db.prompt.findAll({ where: {} });

    const promptLinks: Link[] = prompts.map(prompt => {
        const link: Link = {
            title: prompt.text,
            subtitle: t('admin--prompt-link--subtitle', { questions: prompt.questions.length }),
            href: `/admin/prompt/${prompt.id}`
        };
        
        return link;
    });

    return promptLinks;
};

export const getNotifications = async (userId: string): Promise<Link[]> => {
    const userPrompts = await db.userPrompt.findAll({ where: { userId, completed: false } });
    const prompts = await db.prompt.findAll({ where: { id: { $in: unique(userPrompts.map(up => up.promptId)) } } });

    const promptNotifications: Link[] = userPrompts.map(up => {
        const prompt = prompts.find(p => p.id === up.promptId);
        if (!prompt) {
            return undefined;
        }

        const notification: Link = {
            title: prompt.text,
            subtitle: formatDate(up.date),
            href: `/journal/prompt/${up.id}`
        };

        return notification;
    }).filter(n => n !== undefined) as Link[];

    return promptNotifications;
};

export const getEntries = async (userId: string): Promise<Link[]> => {
    const entries = await db.entry.findAll({ where: { userId } });
    const prompts = await db.prompt.findAll({ where: { id: { $in: unique(entries.map(e => e.promptId)) } } });

    const entryLinks: Link[] = entries.map(entry => {
        const prompt = prompts.find(p => p.id === entry.promptId);
        if (!prompt) {
            return undefined;
        }

        const link: Link = {
            title: formatDate(entry.date),
            subtitle: prompt.text,
            href: `/journal/entry/${entry.id}`
        };
        
        return link;
    }).filter(n => n !== undefined) as Link[];

    return entryLinks;
};
