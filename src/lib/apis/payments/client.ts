import { BatchUploadSummary, EventSummary, Identity, PeopleActiveEventsVm, Person, PersonRow, Response, ResponseCode, SigninResponse } from "./models"
import { get, postJson } from "./baseclient"
import { Selector } from "@/components/Selector"

const API_BASE_URL = process.env.API_BASE_URL

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

export const getPeopleView = async (courseId?: number): Promise<PersonRow[]> => {

    let query = `${API_BASE_URL}/api/people`;
    if (courseId) {
        query += `?courseId=${courseId}`;
    }
    const response = await get(query)
    if (response.ok) {
        return await response.json() as PersonRow[]
    }

    return [];
}

export const getCoursesSelector = async (): Promise<Selector | undefined> => {

    const query = `${API_BASE_URL}/api/courses/selector`;
    const response = await get(query)
    if (response.ok) {
        return await response.json() as Selector
    }

    return undefined;
}

export const getGroupsSelector = async (): Promise<Selector> => {

    const query = `${API_BASE_URL}/api/groups/selector`;
    const response = await get(query)
    if (response.ok) {
        return await response.json() as Selector
    }

    throw new Error();
}

export const getPersonById = async (id: number): Promise<Response<Person>> => {
    const response = await get(`${API_BASE_URL}/api/people/${id}`);
    const data = await response.json() as Response<Person>;

    if (data.errors) {
        data.errors = new Map(Object.entries(data.errors));
    }
    return data;
}

export const createPerson = async (person: Person): Promise<Response<number>> => {
    const response = await postJson(`${API_BASE_URL}/api/people`, person);
    const data = await response.json() as Response<number>;

    if (data.errors) {
        data.errors = new Map(Object.entries(data.errors));
    }
    return data;
}

export const batchUpload = async (formData: FormData): Promise<Response<BatchUploadSummary>> => {

    const request: RequestInit = {
        method: "POST",
        credentials: 'include',
        body: formData,
    };

    const response = await fetch(`${API_BASE_URL}/api/tasks/people`, request);
    const data = await response.json() as Response<BatchUploadSummary>;

    if (data.errors) {
        data.errors = new Map(Object.entries(data.errors));
    }
    return data;
}

export const getPersonActiveEvents = async (documentId: string): Promise<Response<PeopleActiveEventsVm>> => {
    const response = await postJson(`${API_BASE_URL}/api/events/active`, { documentId });
    const data = await response.json() as Response<PeopleActiveEventsVm>;

    if (data.errors) {
        data.errors = new Map(Object.entries(data.errors));
    }
    return data;
}