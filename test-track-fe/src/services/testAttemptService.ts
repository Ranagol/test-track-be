import appAxios from './axiosService'
import type { TestAttempt, UserAnswer, TestAttemptQueryParams, PaginatedResponse } from '@/types/types'

const testAttemptService = {

    /**
     * In order to analyze the TestAttempts, first we need to list them.
     *
     * @param params
     */
    async getAll(params?: TestAttemptQueryParams): Promise<PaginatedResponse<TestAttempt>> {
        const response = await appAxios.get<PaginatedResponse<TestAttempt>>('/api/test-attempts', { params });
        return response.data;
    },

    /**
     * Creates a TestAttempt, with the belonging UserAnswers. This is for the part where we collect
     * the test taker's answers and submit them to the backend.
     *
     * @param testAttempt
     * @param userAnswers
     */
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
