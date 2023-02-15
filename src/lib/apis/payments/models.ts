export enum SigninStatus {
    Ok = 1,
    Error = 2,
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
            group: {
                id: number,
                name: string
            },
            academicRecordNumber: number
        }
    ],
    selectedCourseId: number,
}