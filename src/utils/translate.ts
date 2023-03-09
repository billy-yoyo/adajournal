
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
        'journal--greeting': '你好, {{name}}',
        'journal--notification-list': '通知',
        'journal--entry-list': '入口',

        'login--title': '登录',
        'login--no-account': `你是新用户吗`,
        'login--register-here': '点击注册',
        'login--login-button': '登录',

        'register--title': '注册',
        'register--have-account': `已有帐户`,
        'register--login-here': '点击登录',
        'register--register-button': '注册',

        'profile--title': '账户',
        'profile--username': '账户名',
        'profile--password': '密码',
        'profile--confirm-password': '确认密码',
        'profile--name': '名字',
        'profile--arrived': '你什么时候到达英国',
        'profile--started': '你什么时候开始的课程',
        'profile--logout': '退出登录',

        'errors--not-found': 'Page not found',

        'home--button': '主页',

        'prompt--submit': '提交',
        'prompt--missing-answer': '有问题未填写',
        'prompt--missing-answers': `至少有一个问题未填写`
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
