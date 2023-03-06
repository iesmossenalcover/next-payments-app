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

export interface PeopleActiveEventsVm {
    events: [
        {
            code: string,
            name: string,
            price: number,
            selectable: boolean,
        }
    ],
    person: {
        documentId: string,
        fullName: string,
    }
}

export interface Person {
    id: number,
    name: string,
    documentId: string,
    surname1: string,
    surname2?: string,
    groupId: number,
    academicRecordNumber?: number,
    amipa: boolean,
    preEnrollment: boolean,
}

export interface BatchUploadSummary {
    groupsCreated: number,
    peopleCreated: number,
    peopleUpdated: number,
}