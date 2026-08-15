import appAxios from './axiosService';
import type { User } from '@/types/types';

const userService = {

    async getTestTaker(testTakerId: number): Promise<User> {
    const response = await appAxios.get<{ data: User }>(
        `/api/analytics/test-taker?testTakerId=${testTakerId}`
    );

    return response.data.data;
}
}

export default userService;
