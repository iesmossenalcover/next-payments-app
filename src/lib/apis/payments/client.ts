import { BatchUploadSummary, Identity, PersonActiveEventsVm, Person, PersonRow, Response, SigninResponse, CreateOrderResponse, EventRow, Event, GetOrderInfo, EventPeople, EventPayments, AdminInfo, AppConfig, EventSummaryVm, SyncPersonResponse } from "./models"
import { deleteJson, get, postJson, putJson } from "./baseclient"
import { Selector } from "@/components/Selector"
import { ApiResult } from "@/lib/hooks/useApiRequest"

const API_BASE_URL = process.env.API_BASE_URL

export const signin = async (username: string, password: string): Promise<SigninResponse> => {
    const body = { username, password }
    const response = await postJson(`${API_BASE_URL}/api/signin`, body)
    return (await response.json() as SigninResponse)
}

export const signinOAuth = async (token: string): Promise<SigninResponse> => {
    const response = await postJson(`${API_BASE_URL}/api/oauth`, { token })
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

export const filterPeopleQuery = async (q: string): Promise<ApiResult<PersonRow[]>> => {

    const response = await get(`${API_BASE_URL}/api/people/filter?query=${q}`)
    
    if (response.ok) {
        return {
            data: await response.json() as PersonRow[],
        }
    }

    return { errors: new Map([ ["error", await response.text()]]) };
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

export const deletePerson = async (id: number): Promise<Response<number>> => {
    const response = await deleteJson(`${API_BASE_URL}/api/people/${id}`);
    const data = await response.json() as Response<number>;

    if (data.errors) {
        data.errors = new Map(Object.entries(data.errors));
    }

    return data;
}

export const callGenerateEmail = async (id: number): Promise<Response<SyncPersonResponse>> => {
    const response = await postJson(`${API_BASE_URL}/api/tasks/sync/${id}`, { });
    const data = await response.json() as Response<SyncPersonResponse>;
    console.log(data);
    if (data.errors) {
        data.errors = new Map(Object.entries(data.errors));
    }
    return data;
}

export const updatePerson = async (person: Person): Promise<Response<number>> => {
    const response = await putJson(`${API_BASE_URL}/api/people/${person.id}`, person);
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

export const getPersonActiveEvents = async (documentId: string): Promise<Response<PersonActiveEventsVm>> => {
    const response = await postJson(`${API_BASE_URL}/api/events/active`, { documentId });
    const data = await response.json() as Response<PersonActiveEventsVm>;

    if (data.errors) {
        data.errors = new Map(Object.entries(data.errors));
    }
    return data;
}

export const createOrder = async (documentId: string, eventCodes: string[]): Promise<Response<CreateOrderResponse>> => {
    const response = await postJson(`${API_BASE_URL}/api/orders`, { documentId, eventCodes });
    const data = await response.json() as Response<CreateOrderResponse>;

    if (data.errors) {
        data.errors = new Map(Object.entries(data.errors));
    }

    return data;
}

export const getEventsView = async (): Promise<EventRow[]> => {

    let query = `${API_BASE_URL}/api/events`;
    const response = await get(query)
    if (response.ok) {
        return await response.json() as EventRow[]
    }

    return [];
}

export const getEventById = async (id: number): Promise<Response<Event>> => {
    const response = await get(`${API_BASE_URL}/api/events/${id}`);
    const data = await response.json() as Response<Event>;
    if (data.errors) {
        data.errors = new Map(Object.entries(data.errors));
    }
    return data;
}

export const updateEvent = async (event: Event): Promise<Response<number>> => {
    const response = await putJson(`${API_BASE_URL}/api/events/${event.id}`, event);
    const data = await response.json() as Response<number>;

    if (data.errors) {
        data.errors = new Map(Object.entries(data.errors));
    }
    return data;
}


export const createEvent = async (event: Event): Promise<Response<string>> => {
    const response = await postJson(`${API_BASE_URL}/api/events`, event);
    const data = await response.json() as Response<string>;

    if (data.errors) {
        data.errors = new Map(Object.entries(data.errors));
    }
    return data;
}

export const deleteEvent = async (id: number): Promise<Response<number>> => {
    const response = await deleteJson(`${API_BASE_URL}/api/events/${id}`);
    const data = await response.json() as Response<number>;

    if (data.errors) {
        data.errors = new Map(Object.entries(data.errors));
    }

    return data;
}

export const getOrderInfo = async (merchantParameters: string, singature: string, singatureVersion: string) => {
    const response = await get(`${API_BASE_URL}/api/order/info?merchantParameters=${merchantParameters}&signature=${singature}&signatureVersion=${singatureVersion}`);
    const data = await response.json() as Response<GetOrderInfo>;
    if (data.errors) {
        data.errors = new Map(Object.entries(data.errors));
    }
    return data;
}

export const getEventPeople = async (eventCode: string) => {
    const response = await get(`${API_BASE_URL}/api/events/${eventCode}/people`);
    const data = await response.json() as Response<EventPeople>;
    if (data.errors) {
        data.errors = new Map(Object.entries(data.errors));
    }
    return data;
}

export const setEventPeople = async (code: string, peopleIds: number[]) => {
    const response = await postJson(`${API_BASE_URL}/api/events/${code}/people`, { peopleIds });
    const data = await response.json() as Response<EventPeople>;
    if (data.errors) {
        data.errors = new Map(Object.entries(data.errors));
    }
    return data;
}

export const getEventPayments = async (code: string) => {
    const response = await get(`${API_BASE_URL}/api/events/${code}/payments`);
    const data = await response.json() as Response<EventPayments>;
    if (data.errors) {
        data.errors = new Map(Object.entries(data.errors));
    }
    return data;
}

export const getEventSummary = async (code: string) => {
    const response = await get(`${API_BASE_URL}/api/events/${code}/summary`);
    const data = await response.json() as Response<EventSummaryVm>;
    if (data.errors) {
        data.errors = new Map(Object.entries(data.errors));
    }
    return data;
}

export const getAdminInfo = async () => {
    const response = await get(`${API_BASE_URL}/api/admin`);
    const data = await response.json() as AdminInfo;

    return data;
}

export const setAppConfig = async (config: AppConfig) => {
    const response = await putJson(`${API_BASE_URL}/api/config`, config);
    const data = await response.json() as Response<number>;
    if (data.errors) {
        data.errors = new Map(Object.entries(data.errors));
    }
    return data;
}

export const setPayment = async (id: number, paid: boolean) => {
    const response = await putJson(`${API_BASE_URL}/api/events/${id}/payment`, { paid });
    const data = await response.json() as Response<number>;
    if (data.errors) {
        data.errors = new Map(Object.entries(data.errors));
    }
    return data;
}