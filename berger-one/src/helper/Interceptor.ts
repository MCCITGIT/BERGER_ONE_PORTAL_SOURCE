import axios from 'axios';
import { ENDPOINTS } from './EndPoints';
// import { RefreshTokenV1 } from '../services/api/login/loginSevice';
import Cookies from 'js-cookie';
import { RefreshTokenV1 } from '../services/login/loginSevice';
import { GetProdDevRouteBuilder } from '../services/functions/getProdDevUrlBuilder';

// import { deleteCookie } from 'cookies-next';

const headerConfig = {
    'Content-Type': 'application/json-patch+json',
    // 'Content-Type': 'multipart/form-data',
};

const AXIOS_HTTP = axios.create({
    baseURL: `${ENDPOINTS.BASE_URL_DEV}`,
});

// api request interceptor
AXIOS_HTTP.interceptors.request.use(
    (request) => {
        request.headers.set('Content-Type', headerConfig['Content-Type']);
        request.headers.set('Authorization', 'Bearer ' + localStorage.getItem('_token'));
        request.headers.set('Refresh-Token', localStorage.getItem('_refresh_token'));
        // request.headers.set('_token', headerConfig['_token']);
        // request.headers.set('Userid', headerConfig["Userid"]);
        // request.headers.set('Uuid', headerConfig["Uuid"]);
        return request;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// api response interceptor
AXIOS_HTTP.interceptors.response.use(
    (response) => {
        return response.data;
    },
    async (error) => {
        // const router = useRouter();
        const CacheData: any = JSON.parse(localStorage.getItem('auth') || '');
        let userInfo = CacheData && CacheData.state && CacheData.state.userDetails ? CacheData.state.userDetails : null;
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            let _refreshToken: any = localStorage.getItem('_refresh_token') as string;
            if (_refreshToken && userInfo) {
                try {
                    let postObj: { user_id: string; RefreshToken: string } = { user_id: CacheData.state.userDetails.user_id, RefreshToken: _refreshToken };
                    const response: any = await RefreshTokenV1(postObj);
                    if (response && response.success && response.message && response.token) {
                        // const user = { userDetails: response };
                        localStorage.setItem('_token', response.token);
                        localStorage.setItem('_refresh_token', response.refresh_token);
                        AXIOS_HTTP.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
                        // originalRequest.headers.Authorization = `Bearer ${response.token}`;
                        return AXIOS_HTTP(originalRequest);
                    } else {
                        localStorage.clear();
                        // deleteCookie('authToken');
                        Cookies.remove('authToken');
                        // window.location.href = process.env.SUB_DOMAIN_PATH + '/login/cover-login';
                        // _router.push('/login/cover-login');
                        window.location.href = GetProdDevRouteBuilder('/login/cover-login');
                    }
                } catch (refreshError) {
                    localStorage.clear();
                    localStorage.removeItem('_token');
                    localStorage.removeItem('_refresh_token');
                    // deleteCookie('authToken');
                    Cookies.remove('authToken');
                    window.location.href = GetProdDevRouteBuilder('/login/cover-login');
                    return Promise.reject(0);
                }
            } else {
                localStorage.clear();
                // deleteCookie('authToken');
                Cookies.remove('authToken');
                window.location.href = GetProdDevRouteBuilder('/login/cover-login');
            }
        }
        return Promise.reject(error);
    }
);
export default AXIOS_HTTP;
