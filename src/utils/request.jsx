import axios from 'axios';


// var baseURL = "http://localhost:3000/";
const baseURL = import.meta.env.VITE_BASE_URL ||"http://localhost:3000/";
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

// import axios from 'axios';
// const baseURL = import.meta.env.VITE_BASE_URL ||"http://localhost:3000/";

// const request = async (path = "", method = "GET", data = {}) => {
//     const safeMethod = (typeof method === 'string' ? method : 'GET').toUpperCase();
    
//     try {
//         const config = {
//             method: safeMethod,
//             url: baseURL + path,
//             headers: {
//                 'Content-Type': 'application/json',
//                 'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
//             }
//         };
//         if (safeMethod === 'GET') {
//             config.params = data;
//         } else {
//             config.data = data;
//         }
//         const response = await axios(config);
//         return response.data;
//     } catch (error) {
//         console.error("API Request Error:", error.response?.data || error.message);
//             throw error;
//     }
// };

// export default request;