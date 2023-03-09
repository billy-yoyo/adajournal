import { Show } from "solid-js";
import { RouteAction } from "solid-start/data/createRouteAction";
import { FreeTextQuestion, isFreeTextQuestion, isMultipleChoiceQuestion, isScaleQuestion, Question, QuestionType } from "~/models/entry";
import { useTranslate } from "~/utils/translate";
import FreeTextQuestionComponent from "./freeTextQuestion";
import MultipleChoiceQuestionComponent from "./multipleChoiceQuestion";
import ScaleQuestionComponent from "./scaleQuestion";

export interface QuestionComponentProps {
    id: number;
    creating: { error?: any };
}

function QuestionTypeEditorComponent({ questionType, ...props }: { questionType: QuestionType } & QuestionComponentProps) {
    if (questionType === 'free-text') {
        return <FreeTextQuestionComponent {...props} />
    } else if (questionType === 'multiple-choice') {
        return <MultipleChoiceQuestionComponent {...props} />
    } else if (questionType === 'scale') {
        return <ScaleQuestionComponent {...props} />
    } else {
        // should never be reached
        return <div>Unknown question</div>
    }
}

export default function QuestionEditorComponent({ creating, id, deleteQuestion }: QuestionComponentProps & { deleteQuestion: (id: number) => void }) {
    const { t } = useTranslate();

    const questionType = creating?.error?.fields[`question-${id}--type`] || 'free-text';

    return (
        <div class="create-question">
            <div class="input-container">
                <label for={`question-${id}--title`}>{t('create-prompt--question-title')}</label>
                <input name={`question-${id}--title`} value={creating.error?.fields[`question-${id}--title`] || ''} />
            </div>
            <Show when={creating.error?.fieldErrors[`question-${id}--title`]}>
                <p role="alert">{creating.error.fieldErrors[`question-${id}--title`]}</p>
            </Show>
            
            <div class="input-container">
                <label for={`question-${id}--type`}>{t('create-prompt--question-type')}</label>
                <select name={`question-${id}--type`} value={questionType}>
                    <option value="free-text">{t('create-prompt--question-type--free-text')}</option>
                    <option value="multiple-choice">{t('create-prompt--question-type--multiple-choice')}</option>
                    <option value="scale">{t('create-prompt--question-type--scale')}</option>
                </select>
            </div>
            <Show when={creating.error?.fieldErrors[`question-${id}--type`]}>
                <p role="alert">{creating.error.fieldErrors[`question-${id}--type`]}</p>
            </Show>

            <QuestionTypeEditorComponent questionType={questionType} creating={creating} id={id}/>

            <button onClick={() => deleteQuestion(id)}>{t('create-prompt--delete-question')}</button>
        </div>
    )
}
