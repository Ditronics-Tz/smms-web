import axios from 'axios';
import { API_BASE } from '../constant';

const onSuccess = (response) => {
    console.debug('Request Successful!', response);
    return response;
};

const onError = (error) => {
    console.log('Request Failed:', error.config);
    console.debug(error);
    if (error.response) {
        console.log('Status:', error.response.status);
        console.log('Data:', error.response.data);
        console.log('Headers:', error.response.headers);

        return error.response

    } else {
        console.log('Error Message:', error.message);

        return error.message
    }
};

export const guestRequest = (url, data) => {
    return axios({
        url: API_BASE + url,
        method: "POST",
        timeout: 30000,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        data: data
    })
        .then(onSuccess).catch(onError);
}

export const resourceRequest = (token, url, data) => {
    return axios({
        url: API_BASE + url,
        method: "POST",
        timeout: 30000,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
        data
    })
        .then(onSuccess).catch(onError);
}

export const listRequest = (token, url, data, page) => {
    return axios({
        url: API_BASE + url + `/?page=${page}`,
        method: "POST",
        timeout: 30000,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
        data
    })
        .then(onSuccess).catch(onError);
}
export function multipartRequest(token, url, formData) {
    return axios.post(API_BASE + url, formData, {
        timeout: 30000,
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer ' + token,

        }
    })
        .then(onSuccess).catch(onError);
}