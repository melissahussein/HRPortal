import axios from 'axios';
const BASE_URL = 'http://localhost:8080';
const API_URL = 'http://localhost:8080/api/auth/';

class AuthService {

    login(user) {
        return axios
            .post(API_URL + 'signin', {
                username: user.username,
                password: user.password
            })
            .then(response => {
                if (response.data.accessToken) {
                    localStorage.setItem('user', JSON.stringify(response.data));
                }

                return response.data;
            });
    }

    logout() {
        localStorage.removeItem('user');
    }

    register(user) {
        return axios.post(API_URL + 'signup', {
            firstname: data.firstname,
            lastname: data.lastname,
            username: user.username,
            email: user.email,
            password: user.password,
            role: user.role,
            mycompany: user.mycompany
        });
    }
}

export default new AuthService();

export function adduser(data) {
    return axios.post(`${BASE_URL}/api/adduser`,
        {
            firstname: data.firstname,
            lastname: data.lastname,
            username: data.username,
            email: data.email,
            password: data.password,
            role: data.role,
            mycompany: data.mycompany
        }
    ).then(response => {
        return response.data
    })
        .catch(err => Promise.reject(err.message));
}
