import { Selector, SelectorOption } from "@/components/Selector";

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
    role?: string,
}

export interface Course {
    id: number,
    name: string,
    startDate?: string,
    endDate?: string,
    active: boolean,
}

export interface PersonRow {
    id: number,
    documentId: string,
    firstName: string,
    lastName: string,
    groupId?: number,
    groupName?: string,
    amipa?: boolean,
    academicRecordNumber?: number
}

export interface PersonActiveEventsVm {
    events: PersonActiveEvent[],
    person: {
        documentId: string,
        fullName: string,
        enrolled: boolean,
        enrollmentSubjectsInfo?: string,
        groupDescription?: string,
    }
}

export interface PersonActiveEvent {
    code: string,
    name: string,
    date: string,
    price: number,
    displayQuantitySelector: boolean,
    maxQuantity: number,
    currencySymbol: string,
    selectable: boolean,
}

export interface SelectedEvent {
    code: string;
    quantity?: number;
}

export interface CreateOrderCommand {
    documentId: string,
    events: SelectedEvent[]
}

export interface CreateOrderResponse {
    url: string,
    merchantParameters: string,
    signatureVersion: string,
    signature: string
}

export interface SyncPersonResponse {
    email: string,
    password?: string,
}

export interface StartJobResponse {
    ok: boolean
}


export interface FileResponse {
    fileType: string,
    fileName: string
}

export interface UpdatePasswordResponse {
    password: string,
}

export interface GetOrderInfo {
    personName: string,
    personDocumentId: string,
    events: GetOrderInfoEvent[],
    displayEnrollment: boolean,
    enrollmentSubjectsInfo?: string,
    groupDescription?: string,
}

export interface GetOrderInfoEvent {
    code: string;
    name: string;
    price: number;
    currency: string;
}



export interface Group {
    id: number,
    name: string,
    description?: string,
}

export interface Person {
    id: number,
    name: string,
    email?: string,
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
    date: string,
    publishDate: string,
    unpublishDate: string,
    isActive: boolean,
    enrollment: boolean,
    amipa: boolean
}

export interface GroupRow {
    id: number,
    name: string,
    description: string,
}

export interface AdminInfo {
    currentCurs: string,
    events: number,
    activeEvents: number,
    eventsEndToday: number,
    grups: number,
    people: number,
    todayPayments: number,
    appConfig: AppConfig

}

export interface AppConfig {
    displayEnrollment: boolean,
}


export interface Event {
    id: number,
    code: string,
    description: string,
    name: string,
    date: string,
    price: number,
    amipaPrice: number,
    maxQuantity: number,
    publishDate: string,
    unpublishDate?: string,
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
    date: string,
    peopleGroups: EventPeopleGroup[]
}


export interface EventPayments {
    id: number
    code: string
    name: string,
    date: string,
    quantitySelector: boolean,
    maxQuantity?: number,
    summary: PaymentSummary
    paidEvents: EventPayment[]
    unPaidEvents: EventPayment[]
}

export interface PaymentSummary {
    totalCount: number
    amipaCount: number
    noAmipaCount: number
    totalPaidCount: number
    amipaPaidCount: number
    paidCount: number
    totalPaid: number
    amipaPaid: number
    noAmipaPaid: number
}

export interface EventPayment {
    id: number
    documentId: string,
    fullName: string,
    amipa: boolean,
    price: number,
    group: string,
    paid: boolean,
    quantity: number,
    datePaid?: Date,

}

export interface EventSummaryVm {
    id: number
    code: string
    name: string
    date: string
    groups: SelectorOption[]
    events: EventSummary[]
}

export interface EventSummary {
    id: number
    documentId: string,
    fullName: string,
    groupName: string,
    groupId: number,
    paid: boolean,
    quantity?: number,
}

export enum JobType {
    MOVE_PEOPLE_GOOGLE_WORKSPACE = 1,
    SUSPEND_GOOGLE_WORKSPACE = 2,
    UPDATE_GROUP_MEMBERS_WORKSPACE = 3,
}

export enum JobStatus {
    PENDING = 0,
    RUNNING = 1,
    FINISHED = 2,
}

export interface GetJobsResponse {
    jobs: Job[]
}

export interface Job {
    id: number,
    type: JobType
    status: JobStatus,
    logId?: number,
    start: string,
    end?: string
}

export interface GetLogResponse {
    data: string
}

export interface OuGroupRelationRow {
    id: number
    groupName: string,
    groupMail: string
    oldOu: string
    activeOu: string
}

export interface OuGroupRelation {
    id: number
    groupId: number
    groupMail: string
    oldOu: string
    activeOu: string
    updatePassword: boolean
    changePasswordNextSignIn: boolean
}

export interface OuGroupRelationPage {
    ouGroupRelation: OuGroupRelation
    groups: Selector
}

export interface PersonPaymentsVm {
    personName: string,
    documentId: string,
    coursePayments: CoursePayment[]
}

export interface CoursePayment {
    courseId: number,
    courseName: string,
    payments: PersonPayment[],
}

export interface PersonPayment {
    eventPersonId: number,
    eventId: number
    eventName: string
    amount: number
    manualPayment: boolean
    paidDate?: string
}