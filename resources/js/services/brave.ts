import { guestApi } from '@/services/api/guest';
import type { BraveSearchRequest } from '@/types/brave';

export async function searchBrave(params: Partial<BraveSearchRequest> = {}) {
    try {
        const response = await guestApi.get('/brave/search', {
            params: { ...params },
        });
        return response.data;
    } catch (error) {
        console.error('Error searching Brave:', error);
        throw error;
    }
}