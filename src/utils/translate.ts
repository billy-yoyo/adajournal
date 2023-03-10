
const TRANSLATIONS: {[lang: string]: {[key: string]: string}} = {
    'en-gb': {
        'journal--greeting': 'Hello, {{name}}',
        'journal--notification-list': 'Your notifications',
        'journal--entry-list': 'Your entries',

        'login--title': 'Login',
        'login--no-account': `Don't have an account?`,
        'login--register-here': 'Register here',
        'login--login-button': 'Login',

        'register--title': 'Register',
        'register--have-account': `Already have an account?`,
        'register--login-here': 'Login here',
        'register--register-button': 'Register',

        'profile--title': 'Profile',
        'profile--username': 'Username',
        'profile--password': 'Password',
        'profile--confirm-password': 'Confirm password',
        'profile--name': 'Name',
        'profile--arrived': 'Arrived in the UK',
        'profile--started': 'Started studies',
        'profile--logout': 'Logout',

        'errors--not-found': 'Page not found',
        'errors--server-error': 'Encountered unexpected server error',

        'home--button': 'Home',

        'prompt--submit': 'Submit',
        'prompt--missing-answer': 'Question is missing an answer',
        'prompt--missing-answers': `One or more questions haven't been answered!`,

        'admin--title': 'Admin, you are logged in as {{name}}',
        'admin--prompt-list': 'Prompts',
        'admin--prompt-link--subtitle': 'With {{questions}} questions',
        'admin--create-prompt': 'Create new prompt',

        'create-prompt--title': 'Create a new prompt',
        'create-prompt--submit': 'Create',
        'create-prompt--name': 'Prompt title',
        'create-prompt--question-title': 'Question title',
        'create-prompt--question-type': 'Question type',
        'create-prompt--question-type--free-text': 'Free text',
        'create-prompt--question-type--multiple-choice': 'Multiple choice',
        'create-prompt--question-type--scale': 'Scale',
        'create-prompt--add-question': 'Add question',
        'create-prompt--delete-question': 'Delete question'
    },
    'cn-tr': {
        'journal--greeting': '??????, {{name}}',
        'journal--notification-list': '??????',
        'journal--entry-list': '??????',

        'login--title': '??????',
        'login--no-account': `??????????????????`,
        'login--register-here': '????????????',
        'login--login-button': '??????',

        'register--title': '??????',
        'register--have-account': `????????????`,
        'register--login-here': '????????????',
        'register--register-button': '??????',

        'profile--title': '??????',
        'profile--username': '?????????',
        'profile--password': '??????',
        'profile--confirm-password': '????????????',
        'profile--name': '??????',
        'profile--arrived': '???????????????????????????',
        'profile--started': '??????????????????????????????',
        'profile--logout': '????????????',

        'errors--not-found': 'Page not found',

        'home--button': '??????',

        'prompt--submit': '??????',
        'prompt--missing-answer': '??????????????????',
        'prompt--missing-answers': `??????????????????????????????`
    }
};

interface TranslationProfile {
    lang: string;
}

export type Translator = (key: string, params?: {[key: string]: any}) => string;

const defaultProfile: TranslationProfile = { lang: 'en-gb' };

const replaceParams = (translation: string, params: {[key: string]: any}) => {
    let mutatedTranslation = translation;
    Object.entries(params).forEach(([key, value]) => {
        mutatedTranslation = mutatedTranslation.replaceAll(`{{${key}}}`, value);
    });
    return mutatedTranslation;
};

const createTranslator = (profile: TranslationProfile): Translator => {
    return (key: string, params?: {[key: string]: any}) => {
        const translations = TRANSLATIONS[profile.lang] ?? TRANSLATIONS[defaultProfile.lang];
        if (!translations) {
            return '???';
        }

        const translation = translations[key] ?? '???';
        if (params) {
            return replaceParams(translation, params);
        } else {
            return translation;
        }
    }
};

export const useTranslate = (profileOptions: Partial<TranslationProfile> = {}) => {
    const profile = { ...defaultProfile, ...profileOptions };
    const t = createTranslator(profile);
    return { t };
};
