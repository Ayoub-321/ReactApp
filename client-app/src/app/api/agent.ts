import axios, {AxiosError, AxiosResponse} from 'axios';
import { toast } from 'react-toastify';
import { Activity } from '../models/activity';

axios.defaults.baseURL = 'https://localhost:5001/api';

axios.interceptors.response.use(async response => {
        await sleep(1000);
        return response;
    
}, (error: AxiosError) => {
    const {data, status} = error.response!;
    switch (status) {
        case 400:
            toast.error('bad request');
            break;
        case 401:
            toast.error('unauthorized');
            break;
        case 404:
            toast.error('Not Found');
            break;
        case 500:
            toast.error('server error');
            break;    
    }
    return Promise.reject(error);
});

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
};
const responseBody = <T> (response: AxiosResponse<T>) => response.data;

const requests = {  
    get: <T> (url: string) => axios.get<T>(url).then(responseBody),
    post: <T> (url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T> (url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    del: <T> (url: string) => axios.delete<T>(url).then(responseBody),

}

const Activities = {
    list: () => requests.get<Activity[]>('/activities'),
    details: (id: string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: Activity) => requests.post<void>('/activities', activity),
    update: (activity: Activity, id: string) => requests.put<void>(`/activities/${id}`, activity),
    delete: (id: string) => requests.del<void>(`/activities/${id}`)
}

const agent ={
    Activities
}

export default agent;