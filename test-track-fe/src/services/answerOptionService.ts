import appAxios from './axiosService'
import type { AnswerOption } from '@/types/types'

const answerOptionService = {

    async update(id: number, data: Partial<AnswerOption>): Promise<AnswerOption> {
        const response = await appAxios.patch<{ data: AnswerOption }>(`/api/answer-options/${id}`, data)
        return response.data.data
    },
}

export default answerOptionService;
