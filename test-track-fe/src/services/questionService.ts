import appAxios from './axiosService'
import type { Question } from '@/types/types'

const questionService = {

    async update(id: number, data: Partial<Question>): Promise<Question> {
        const response = await appAxios.patch<{ data: Question }>(`/api/questions/${id}`, data)
        return response.data.data
    },
}

export default questionService;
