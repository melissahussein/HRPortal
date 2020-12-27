import http from "../http-common";


export function create(data) {
    return http.post("/employees", data);
}

export function getAll() {
    return http.get("/employees");
}

export function findById(id) {
    return http.get(`/employees/${id}`)
}

export function findPlanning(id) {
    return http.get(`/employees/planning/${id}`)
}

export function findAbsence(id) {
    return http.get(`/employees/absence/${id}`)
}

export function findAllFiles(id) {
    return http.get(`/employees/files/find/${id}`)
}

export function findByCompany(name) {
    return http.get(`/companies/${name}`)
}

export function findByFullname(firstname,lastname) {
    return http.get(`/employees/${firstname}/${lastname}`)
}

export function getRegister(name) {
    return http.get(`/register/${name}`)
}

export function updateFiles(id, data) {
    return http.put(`/employees/files/${id}`, data
    );
}

export function deleteAll() {
    return http.delete(`/employees`
    );
}

export function update(id,data) {
    return http.put(`/employees/${id}`, data
    );
}

export function Delete(id) {
        return http.delete(`/employees/${id}`
        );
}

export function DeleteFile(id) {
    return http.delete(`/employees/files/${id}`
    );
}
