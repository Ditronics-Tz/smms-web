import axios from 'axios';
import { API_BASE } from '../constant';

export const guestRequest = (url, data) => {
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
        //return Promise.reject(error.response || error.message);
    };

    // return axioss.post(API_BASE + url, data).then(onSuccess).catch(onError);

    return axios({
        url: API_BASE + url,
        method:"POST",
        // mode: "cors",
        timeout:30000,
        headers: {
            'Accept': 'application/json',  
            // 'Content-Type': 'application/json'
            'Content-Type': 'multipart/form-data',
        },
        data
    })
    .then(onSuccess).catch(onError);
}

export const resourceRequest = (token, url, data) => {
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
        //return Promise.reject(error.response || error.message);
    };


    // axios.defaults.headers.patch['']
    return axios({
        url: API_BASE + url,
        method:"POST",
        timeout:30000,
        headers: {
            'Accept': 'application/json',  
            'Content-Type': 'application/json',
            // 'content-type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + token,
        },
        data
    })
    .then(onSuccess).catch(onError);
}

export function multipartRequest(token, url, formData) {
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

    return axios.post(API_BASE + url, formData, {
        timeout:30000,
        headers: {
            'Accept': 'application/json',  
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer ' + token,
            
        }
    })
    .then(onSuccess).catch(onError);
}