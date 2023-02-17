export enum SigninStatus {
    Ok = 1,
    Error = 2,
}

export interface Result<T> {
    error: boolean,
    errors: Map<string, string[]>,
    data?: T,
}

export interface SigninResponse {
    status: SigninStatus,
    errorMessage: string | undefined
}

export interface Identity {
    id: number,
    username: string,
    givenName: string,
}

export interface GetPeopleView {
    people: [
        {
            id: number,
            documentId: string,
            firstName: string,
            lastName: string,
            groupId: number,
            groupName: string
            academicRecordNumber: number
        }
    ],
    selectedCourseId: number,
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