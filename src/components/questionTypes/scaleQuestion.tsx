import { For } from "solid-js";
import { ScaleQuestion } from "~/models/entry";

export interface ScaleQuestionComponentProps {
    question: ScaleQuestion;
    answer?: any;
    editable: boolean;
    index: number;
}

export default function ScaleQuestionComponent({question, index, answer, editable} : ScaleQuestionComponentProps) {
    return <fieldset class="scale question-input" disabled={!editable}>
        <For each={question.choices}>{(choice, choiceIndex) => (
            <>
                <input type="radio"
                    name={`question-${index}`}
                    value={`choice-${choiceIndex()}`}
                    id={`question-${index}-choice-${choiceIndex()}`}
                    checked={answer === `choice-${choiceIndex()}`} />
                <label for={`question-${index}-choice-${choiceIndex()}`}>{choice}</label>
            </>
        )
        }</For>
    </fieldset>
}
