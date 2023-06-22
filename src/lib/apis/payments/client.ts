import { BatchUploadSummary, Identity, PersonActiveEventsVm, Person, PersonRow, Response, SigninResponse, CreateOrderResponse, EventRow, Event, GetOrderInfo, EventPeople, EventPayments, AdminInfo, AppConfig, EventSummaryVm, SyncPersonResponse, UpdatePasswordResponse, GroupRow, Group, SyncPepoleResponse } from "./models"
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

export const filterPeopleQuery = async (q: string): Promise<PersonRow[]> => {
    const response = await get(`${API_BASE_URL}/api/people/filter?query=${q}`)
    return await response.json() as PersonRow[];
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

export const getPersonById = async (id: number): Promise<ApiResult<Person>> => {
    const response = await get(`${API_BASE_URL}/api/people/${id}`);
    const data = await response.json() as Response<Person>;
    if (data.errors) {
        data.errors = new Map(Object.entries(data.errors));
    }
    return data;
}

export const createPerson = async (person: Person): Promise<ApiResult<number>> => {
    const response = await postJson(`${API_BASE_URL}/api/people`, person);
    const data = await response.json() as ApiResult<number>;

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

export const syncPersonGoogleWorkspace = async (id: number): Promise<Response<SyncPersonResponse>> => {
    const response = await postJson(`${API_BASE_URL}/api/googleworkspace/people/sync/${id}`, { });
    const data = await response.json() as Response<SyncPersonResponse>;

    if (data.errors) {
        data.errors = new Map(Object.entries(data.errors));
    }
    return data;
}

export const updatePasswordGoogleWorkspace = async (id: number): Promise<Response<UpdatePasswordResponse>> => {
    const response = await postJson(`${API_BASE_URL}/api/googleworkspace/people/${id}/password`);
    const data = await response.json() as Response<UpdatePasswordResponse>;

    if (data.errors) {
        data.errors = new Map(Object.entries(data.errors));
    }
    return data;
}

// todo
export const syncPeopleGoogleWorkspace = async (): Promise<Response<SyncPepoleResponse>> => {
    const response = await postJson(`${API_BASE_URL}/api/googleworkspace/people/sync`);
    const data = await response.json() as Response<SyncPepoleResponse>;

    if (data.errors) {
        data.errors = new Map(Object.entries(data.errors));
    }
    return data;
}

export const exportPeopleGoogleWorkspace = async () => {
    const response = await get(`${API_BASE_URL}/api/googleworkspace/people/export`);
    const blob = await response.blob();
    var file =  window.URL.createObjectURL(blob);
    window.location.assign(file);
}

export const movePeopleGoogleWorkspace = async (): Promise<Response<SyncPepoleResponse>> => {
    const response = await postJson(`${API_BASE_URL}/api/googleworkspace/people/move`);
    const data = await response.json() as Response<SyncPepoleResponse>;

    if (data.errors) {
        data.errors = new Map(Object.entries(data.errors));
    }
    return data;
}

export const addPeopleToGroupsGoogleWorkspace = async (): Promise<Response<SyncPepoleResponse>> => {
    const response = await postJson(`${API_BASE_URL}/api/googleworkspace/people/groups`);
    const data = await response.json() as Response<SyncPepoleResponse>;

    if (data.errors) {
        data.errors = new Map(Object.entries(data.errors));
    }
    return data;
}

export const exportSummaryRequest = async () => {
    const response = await get(`${API_BASE_URL}/api/events/export`);
    const blob = await response.blob();
    var file =  window.URL.createObjectURL(blob);
    window.location.assign(file);
}

export const suspendPeopleGoogleWorkspace = async (): Promise<Response<SyncPepoleResponse>> => {
    const response = await postJson(`${API_BASE_URL}/api/googleworkspace/people/suspend`);
    const data = await response.json() as Response<SyncPepoleResponse>;

    if (data.errors) {
        data.errors = new Map(Object.entries(data.errors));
    }
    return data;
}

export const exportWifiUsers = async () => {
    const response = await get(`${API_BASE_URL}/api/wifi/export`);
    const blob = await response.blob();
    var file =  window.URL.createObjectURL(blob);
    window.location.assign(file);
}

export const updatePerson = async (person: Person): Promise<Response<number>> => {
    const response = await putJson(`${API_BASE_URL}/api/people/${person.id}`, person);
    const data = await response.json() as Response<number>;

    if (data.errors) {
        data.errors = new Map(Object.entries(data.errors));
    }
    return data;
}

export const batchUpload = async (formData: FormData): Promise<ApiResult<BatchUploadSummary>> => {

    const request: RequestInit = {
        method: "POST",
        credentials: 'include',
        body: formData,
    };

    const response = await fetch(`${API_BASE_URL}/api/tasks/people`, request);
    const data = await response.json() as ApiResult<BatchUploadSummary>;

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

export const getGroupsView = async (): Promise<GroupRow[]> => {

    let query = `${API_BASE_URL}/api/groups`;
    const response = await get(query)
    if (response.ok) {
        return await response.json() as GroupRow[]
    }

    return [];
}

export const createGroup = async (group: Group): Promise<ApiResult<number>> => {
    const response = await postJson(`${API_BASE_URL}/api/groups`, group);
    const data = await response.json() as ApiResult<number>;

    if (data.errors) {
        data.errors = new Map(Object.entries(data.errors));
    }
    return data;
}

export const updateGroup = async (group: Group): Promise<Response<number>> => {
    const response = await putJson(`${API_BASE_URL}/api/groups/${group.id}`, group);
    const data = await response.json() as Response<number>;

    if (data.errors) {
        data.errors = new Map(Object.entries(data.errors));
    }
    return data;
}

export const getGroupById = async (id: number): Promise<ApiResult<Group>> => {
    const response = await get(`${API_BASE_URL}/api/groups/${id}`);
    const data = await response.json() as Response<Group>;
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