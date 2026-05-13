import appAxios from './axiosService'
import type { TestAttempt, UserAnswer } from '@/types/types'

const testAttemptService = {

    async create(
        testAttempt: Partial<TestAttempt>,
        userAnswers: Partial<UserAnswer>[]
    ): Promise<TestAttempt> {
        const data = {
            test_attempt: testAttempt,
            user_answers: userAnswers
        };
        const response = await appAxios.post<TestAttempt>('/api/test-attempts', data);
        return response.data;
    },
}

export default testAttemptService;
