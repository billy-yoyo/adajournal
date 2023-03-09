import { For } from "solid-js";
import { MultipleChoiceQuestion } from "~/models/entry";

export interface MultipleChoiceQuestionComponentProps {
    question: MultipleChoiceQuestion;
    answer?: any;
    editable: boolean;
    index: number;
}

export default function MultipleChoiceQuestionComponent({ question, index, answer, editable } : MultipleChoiceQuestionComponentProps) {
    return (
        <select class="question-input" name={`question-${index}`} value={answer ? answer : ''} disabled={!editable}>
            <For each={question.choices}>{(choice, choiceIndex) =>
                <option value={`choice-${choiceIndex()}`}>{choice}</option>
            }</For>
        </select>
    )
}
