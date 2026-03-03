import axios from 'axios';


var baseURL = "http://localhost:3000/";
const request = (path="",method="GET" , data={}) =>{
    const isFormData = data instanceof FormData;

    return axios({
        method:method,
        url:baseURL+path,
        data :data,
        headers : isFormData
            ? {}
            : {
                'Content-Type' : 'application/json'
            }
    })
    .then((response) =>{
        return response.data;
    })
    .catch((error) =>{
        console.log(error);
        throw error;
    })
}

export default request;