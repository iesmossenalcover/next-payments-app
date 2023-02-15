import { GetPeopleView, Identity, SigninResponse } from "./models"
import { get, postJson } from "./baseclient"
import { Selector } from "@/components/Selector"

const API_BASE_URL = "http://localhost:5206"

export const signin = async (username: string, password: string): Promise<SigninResponse> => {
    const body = { username, password }
    const response = await postJson(`${API_BASE_URL}/api/signin`, body)
    return (await response.json() as SigninResponse)
}

export const getIdentity = async (): Promise<Identity | undefined> => {

    const response = await get(`${API_BASE_URL}/api/identity`)
    if (response.ok) {
        return await response.json() as Identity
    }
    
    return undefined;
}

export const getPeopleByCourse = async (courseId?: number): Promise<GetPeopleView | undefined> => {

    let query = `${API_BASE_URL}/api/people`;
    if (courseId) {
        query += `?courseId=${courseId}`;
    }
    const response = await get(query)
    if (response.ok) {
        return await response.json() as GetPeopleView
    }
    
    return undefined;
}

export const getCoursesSelector = async (courseId?: number): Promise<Selector | undefined> => {

    let query = `${API_BASE_URL}/api/courses/selector`;
    if (courseId) {
        query += `?courseId=${courseId}`;
    }
    const response = await get(query)
    if (response.ok) {
        return await response.json() as Selector
    }
    
    return undefined;
}