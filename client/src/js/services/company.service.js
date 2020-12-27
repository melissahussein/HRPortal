import axios from 'axios';
const BASE_URL = 'http://localhost:8080';
import http from "../http-common";


export function findAllCompanies() {
    return http.get("/companies");
}

export function findCompany(id) {
    return http.get(`/companies/edit/${id}`
    );
}

export function DeleteCompany(id) {
    return http.delete(`/companies/${id}`
    );
}

export function updateCompany(id, data) {
    return http.put(`/companies/${id}`, data
    );
}

export function addcompany(data) {
    return axios.post(`${BASE_URL}/api/addcompany`,
        { name: data.name, LR: data.LR, HR: data.HR }
    ).then(response => {
        return response.data
    })
        .catch(err => Promise.reject(err.message));
}

