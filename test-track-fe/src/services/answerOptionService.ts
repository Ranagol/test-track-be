import appAxios from './axiosService'
import type { AnswerOption } from '@/types/types'

const answerOptionService = {

    /**
     * Updates the text of exactly ONE AnswerOption. This is used, when the tester edits the text of the
     * AnswerOption.
     *
     * @param id
     * @param data
     */
    async updateText(id: number, data: Partial<AnswerOption>): Promise<AnswerOption> {
        const response = await appAxios.patch<{ data: AnswerOption }>(`/api/answer-options/${id}`, data)
        return response.data.data
    },

    /**
     * Updates the is_correct field for ALL AnswerOptions of a question. This is used, when the
     * tester edits the is_correct field of an AnswerOption. Since only one AnswerOption can be correct,
     * this automatically means that all other AnswerOptions is_correct of the question must be
     * updated to false. To achieve this, we send only the questionId and the (correct) answerOptionId, and
     * the backend handles everything.
     *
     * @param questionId
     * @param answerOptionId
     */
    async updateIsCorrect(questionId: number, answerOptionId: number): Promise<void> {
        const response = await appAxios.post(`/api/questions/${questionId}/correct-answer`, {
            correct_answer_option_id: answerOptionId,
        });

        return response.data
    }
}

export default answerOptionService;
