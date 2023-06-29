import Router from "next/router"
import { FileResponse } from "./models"

const INTERNAL_ERROR_PAGE = "/500"
const UNAUTHORIZED_ERROR_PAGE = "/403"
const SIGNIN_PAGE = "/admin/signin"

export const putJson = (url: string, body: any, headers: any = {}): Promise<Response> => {
    headers = { "Content-Type": "application/json", ...headers }
    return apiFetch(url, "PUT", body, headers)
}

export const postJson = (url: string, body: any = {}, headers: any = {}): Promise<Response> => {
    headers = { "Content-Type": "application/json", ...headers }
    return apiFetch(url, "POST", body, headers)
}

export const deleteJson = (url: string, headers: any = {}): Promise<Response> => {
    headers = { "Content-Type": "application/json", ...headers }
    return apiFetch(url, "DELETE", headers)
}

export const get = (url: string, headers: any = {}): Promise<Response> => {
    return apiFetch(url, "GET", null, headers)
}

export const toFile = async (response: Response) => {

    const contentDisposition = response.headers.get('Content-Disposition');
    const filenameMatch = contentDisposition && contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    const filename = filenameMatch && filenameMatch[1];

    const contentType = response.headers.get('Content-Type');
    const fileType = contentType && contentType.split('/')[1];

    const blob: Blob = new Blob([await response.blob()], { type: fileType ?? "" });
    const objectUrl: string = URL.createObjectURL(blob);
    const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;

    a.href = objectUrl;
    a.download = filename ?? "export";
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(objectUrl);
}


export const apiFetch = (
    url: string,
    method: string,
    data: any = null,
    headers: any = {}
): Promise<Response> => {
    return new Promise((resolve) => {

        const request: RequestInit = {
            method,
            headers,
            credentials: 'include',
            body: data ? JSON.stringify(data) : null,
        };

        fetch(url, request)
            .then(response => {
                switch (response.status) {
                    case 401:
                        window.location.replace(`${location.protocol + '//' + location.host}${SIGNIN_PAGE}?redirectTo=${window.location.pathname}`)
                        break;
                    case 403:
                        window.location.replace(`${location.protocol + '//' + location.host}${UNAUTHORIZED_ERROR_PAGE}`)
                        break;
                    case 500:
                        Router.push(INTERNAL_ERROR_PAGE)
                        break;
                }
                resolve(response)
            })
            .catch(() => Router.push(INTERNAL_ERROR_PAGE))
    })
}