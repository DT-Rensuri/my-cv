import { http } from './axios';
import { setupInterceptors } from './interceptors';

setupInterceptors(http);

export { http };