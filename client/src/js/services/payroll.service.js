import http from "../http-common";


export function createPayroll(data) {
    return http.post("/payrolls", data);
}

export function findAllPayrolls() {
    return http.get("/payrolls");
}

export function findPayrollByCompany(name) {
    return http.get(`/payrolls/${name}`)
}

export function findByCompanyAndPosition(position, company) {
    return http.get(`/payrolls/${position}/${company}`)
}

export function updatePosition(position, name, data) {
    return http.put(`/payrolls/${position}/${name}`, data
    );
}
