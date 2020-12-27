import http from "../http-common";

export function findAllUsers() {
    return http.get("/users");
}

export function findUser(id) {
    return http.get(`/users/edit/${id}`
    );
}

export function DeleteUser(id) {
    return http.delete(`/users/${id}`
    );
}

export function updateUser(id, data) {
    return http.put(`/users/${id}`, data
    );
}


export function updateRole(firstname,lastname, data) {
    return http.put(`/users/update/${firstname}/${lastname}`, data
    );
}


export function findAdmins() {
    return http.get(`/admins`
    );
}

export function findAdmin(id) {
    return http.get(`/admins/edit/${id}`
    );
}


export function getActivityCompany(company) {
    return http.get(`/users/activity/${company}`
    );
}

export function getActivityAll() {
    return http.get(`/users/activity`
    );
}

export function getActivityAdmins() {
    return http.get(`/users/activity/of/admins`
    );
}
