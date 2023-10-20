import Axios from 'axios';

const baseURL = `/api/`;

const axios = Axios.create({
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
    },
    baseURL: baseURL,
});

export default axios;
