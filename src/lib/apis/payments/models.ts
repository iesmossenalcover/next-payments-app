export enum SigninStatus {
    Ok = 1,
    Error = 2,
}

export interface SigninResponse {
    status: SigninStatus,
    errorMessage: string | undefined
}

export enum ResponseCode {
    Success = 0,
    BadRequest = 1,
    NotFound = 2,
    InternalError = 3
}

export interface Response<T> {
    code: ResponseCode,
    errors?: Map<string, string[]>,
    data?: T,
}

export interface Identity {
    id: number,
    username: string,
    givenName: string,
}

export interface PersonRow {
    id: number,
    documentId: string,
    firstName: string,
    lastName: string,
    groupId: number,
    groupName: string
    academicRecordNumber: number
}

export interface PersonActiveEventsVm {
    events: PersonActiveEvent[],
    person: {
        documentId: string,
        fullName: string,
    }
}

export interface PersonActiveEvent {
    code: string,
    name: string,
    price: number,
    currencySymbol: string,
    selectable: boolean,
}

export interface CreateOrderResponse {
    url: string,
    merchantParameters: string,
    signatureVersion: string,
    signature: string
}
export interface GetOrderInfo {
    events: GetOrderInfoEvent[];
}

export interface GetOrderInfoEvent {
    code: string;
    name: string;
    price: number;
    currency: string;
}


export interface Person {
    id: number,
    name: string,
    documentId: string,
    surname1: string,
    surname2?: string,
    groupId?: number,
    academicRecordNumber?: number,
    amipa: boolean,
    enrolled: boolean,
    subjectsInfo?: string,
}

export interface BatchUploadSummary {
    groupsCreated: number,
    peopleCreated: number,
    peopleUpdated: number,
}

export interface EventRow {
    id: number,
    code: string,
    name: string,
    price: number,
    amipaPrice: number,
    courseId: number,
    publishDate: string,
    unpublishDate: string,
    isActive: boolean,
    enrollment: boolean,
    amipa: boolean
}

export interface Event {
    id: number,
    code: string,
    name: string,
    price: number,
    amipaPrice: number,
    publishDate: string,
    unpublishDate: string,
    enrollment: boolean,
    amipa: boolean
}


// Event people
export interface EventPerson {
    id: number,
    documentId: string,
    fullName: string,
    academicRecordNumber?: number,
    inEvent: boolean,
}

export interface EventPeopleGroup {
    id: number,
    name: string,
    people: EventPerson[]
}

export interface EventPeople {
    id: number,
    code: string,
    name: string,
    peopleGroups: EventPeopleGroup[]
}


export interface EventPayments {
    id: number
    code: string
    name: string
    totalPrice: number
    amipaTotalPrice: number
    count: number
    paidCount: number
    payments: EventPayment[]
}

export interface EventPayment {
    id: number
    fullName: string
    amipa: boolean
    price: number
    paid: boolean
}
