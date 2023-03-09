import { FreeTextQuestion } from "~/models/entry";

export interface FreeTextQuestionComponentProps {
    question: FreeTextQuestion;
    answer?: any;
    editable: boolean;
    index: number;
}


export default function FreeTextQuestionComponent({ answer, editable, index } : FreeTextQuestionComponentProps) {
    return <input class="question-input" type="text" name={`question-${index}`} value={answer ? answer : ''} disabled={!editable}></input>
}
