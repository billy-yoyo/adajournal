

interface BaseQuestion {
    text: string;
}

export interface FreeTextQuestion extends BaseQuestion {
    type: 'free-text';
}

export interface MultipleChoiceQuestion extends BaseQuestion  {
    type: 'multiple-choice';
    choices: string[];
}

export interface ScaleQuestion extends BaseQuestion {
    type: 'scale';
    choices: string[];
}

export type Question = FreeTextQuestion | MultipleChoiceQuestion | ScaleQuestion;
export type QuestionType = Question['type'];

export const isFreeTextQuestion = (question: Question): question is FreeTextQuestion => question.type === 'free-text';
export const isMultipleChoiceQuestion = (question: Question): question is MultipleChoiceQuestion => question.type === 'multiple-choice';
export const isScaleQuestion = (question: Question): question is ScaleQuestion => question.type === 'scale';

export interface Entry {
    userId: string;
    id: string;
    date: Date;
    answers: any[];
    promptId: string;
}

export interface Prompt {
    id: string;
    text: string;
    questions: Question[];
}

export interface UserPrompt {
    id: string;
    userId: string;
    promptId: string;
    date: Date;
    completed: boolean;
}
