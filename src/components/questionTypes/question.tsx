import { Show } from "solid-js";
import { FreeTextQuestion, isFreeTextQuestion, isMultipleChoiceQuestion, isScaleQuestion, Question } from "~/models/entry";
import FreeTextQuestionComponent from "./freeTextQuestion";
import MultipleChoiceQuestionComponent from "./multipleChoiceQuestion";
import ScaleQuestionComponent from "./scaleQuestion";

export interface QuestionComponentProps {
    question: Question;
    answer?: any;
    editable: boolean;
    index: number;
}

function QuestionTypeComponent(props: QuestionComponentProps) {
    const question = props.question;
    if (isFreeTextQuestion(question)) {
        return <FreeTextQuestionComponent {...props} question={question}/>
    } else if (isMultipleChoiceQuestion(question)) {
        return <MultipleChoiceQuestionComponent {...props} question={question} />
    } else if (isScaleQuestion(question)) {
        return <ScaleQuestionComponent {...props} question={question} />
    } else {
        // should never be reached
        return <div>Unknown question</div>
    }
}

export default function QuestionComponent({ error, ...props }: QuestionComponentProps & { error?: string }) {
    return (
        <div class="question">
            <div class="question-title">{props.question.text}</div>
            <QuestionTypeComponent {...props} />
            <Show when={error}>
                <p role="alert">{error}</p>
            </Show>
        </div>
    )
}
