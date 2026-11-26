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

export const Roles = {
    SuperUser: "superuser",
    AdvancedAdmin: "advancedadmin",
    Admin: "admin",
    Reader: "reader",
} as const;

export type Role = typeof Roles[keyof typeof Roles];

// Mayor número = más privilegios
const RolePriority: Record<Role, number> = {
    [Roles.Reader]: 1,
    [Roles.Admin]: 2,
    [Roles.AdvancedAdmin]: 3,
    [Roles.SuperUser]: 4,
};

export const getRolePriority = (role?: string): number =>
    role ? RolePriority[role as Role] ?? 0 : 0;

// true si el rol del usuario tiene igual o más prioridad que el requerido
export const hasRole = (role: string | undefined, required: Role): boolean =>
    getRolePriority(role) >= RolePriority[required];

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
    },
}

export interface PersonActiveEvent {
    code: string,
    name: string,
    date: string,
    // Només ve informat si l'esdeveniment es pot pagar: sense autorització el servidor no envia el preu.
    price?: number,
    displayQuantitySelector: boolean,
    maxQuantity: number,
    currencySymbol: string,
    selectable: boolean,
    missingAuthorization?: string,
}

export interface SelectedEvent {
    code: string;
    quantity?: number;
}

export enum PaymentMethod {
    Card = 0,
    Bizum = 1,
}

export interface CreateOrderCommand {
    documentId: string,
    events: SelectedEvent[],
    paymentMethod: PaymentMethod,
}

// Dades del formulari que s'ha d'enviar per POST a la passarel·la de Redsys.
export interface RedsysForm {
    url: string,
    merchantParameters: string,
    signatureVersion: string,
    signature: string,
}

// Només un dels dos camps ve informat: payment si l'ordre s'ha de pagar per Redsys,
// o confirmation si era gratuïta (import 0) i el servidor ja l'ha confirmada.
export interface CreateOrderResponse {
    payment?: RedsysForm,
    confirmation?: GetOrderInfo,
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
    quantity: number,
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
    schoolAlert?: string,
    subjectsInfo?: string,
    walkingAuthorization: boolean,
    transportAuthorization: boolean,
}

export interface BatchUploadSummary {
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
    amipa: boolean,
    type: EventType,
    calendarEventId?: string,
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


export enum EventType {
    Other = 0,
    Walking = 1,
    Transport = 2,
    Trip = 3,
    Workshop = 4,
}

export interface Event {
    id: number,
    code: string,
    description: string,
    name: string,
    date: string,
    endDate?: string,
    price: number,
    amipaPrice: number,
    maxQuantity: number,
    publishDate: string,
    unpublishDate?: string,
    enrollment: boolean,
    amipa: boolean,
    type?: EventType,
    calendarEventId?: string,
    location?: string,
    maxCapacity?: number,
    notifyExtracurricular: boolean,
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
    description?: string,
    people: EventPerson[]
}

export interface EventPeople {
    id: number,
    code: string,
    name: string,
    date: string,
    peopleGroups: EventPeopleGroup[]
}


export interface PaymentsEvent {
    id: number,
    code: string,
    name: string,
    price: number,
    amipaPrice: number,
    date: string,
    publishDate: string,
    unpublishDate?: string,
    isActive: boolean,
    isEnrollment: boolean,
    isAmpia: boolean,
    type: EventType,
    quantitySelector: boolean,
    maxQuantity?: number,
    maxCapacity?: number
}

export interface EventPaymentsVm {
    event: PaymentsEvent,
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
    notAuthorizedCount: number
    notAuthorizedPaidCount: number
    // Places ocupades: suma de les quantitats pagades.
    paidPlaces: number
}

export interface SetEventPeoplePaidVm {
    // Marcats com a pagats.
    paid: number,
    // Deixats com estaven perquè els falta l'autorització del curs.
    skippedNotAuthorized: number,
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
    authorized: boolean,
}

export interface EventSummaryVm {
    id: number
    code: string
    name: string
    description?: string
    date: string,
    publishDate: string,
    unpublishDate?: string,
    type: EventType,
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
    schoolAlert?: string,
    authorized: boolean,
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
// Event requests (sol·licituds d'esdeveniments)
export enum EventRequestStatus {
    PendingReview = 0,
    PendingCorrection = 1,
    PendingCreation = 2,
    Created = 3,
    Deleted = 4,
    Rejected = 5,
}

export enum EventRequestAction {
    Submit = 0,
    Approve = 1,
    RequestCorrection = 2,
    Edit = 3,
    Resubmit = 4,
    CreateEvent = 5,
    EventDeleted = 6,
    Reject = 7,
    Delete = 8,
}

export enum EventRequestRecipientType {
    Person = 0,
    Group = 1,
}

export interface EventRequestRecipient {
    type: EventRequestRecipientType,
    referenceId: number,
    name?: string,
    // Només per als alumnes: el seu grup al curs de la sol·licitud.
    groupId?: number,
    groupName?: string,
}

// Resultat de crear l'esdeveniment d'una sol·licitud.
export interface CreateEventFromRequestResult {
    eventId: number,
    code: string,
    // null/undefined si la sol·licitud no s'havia de sincronitzar amb Google Calendar.
    calendarSynced?: boolean,
    calendarError?: string,
}

// Alumne d'un grup (per triar-ne només alguns a la sol·licitud).
export interface GroupPerson {
    id: number,
    name: string,
}

// Dades del formulari. De moment només els camps mínims.
export interface EventRequestData {
    title: string,
    description: string,
    startDate: string,
    endDate?: string,
    price: number,
    paymentDeadline?: string,
    recipients: EventRequestRecipient[],
}

export interface EventRequestSummary {
    id: number,
    title: string,
    status: EventRequestStatus,
    requesterUserId: number,
    requesterName: string,
    requesterEmail: string,
    startDate: string,
    createdAt: string,
    updatedAt: string,
    eventId?: number,
    // Fins quan el professor pot fer canvis a la sol·licitud aprovada.
    changesDeadline?: string,
}

export interface EventRequestTransition {
    from?: EventRequestStatus,
    to: EventRequestStatus,
    action: EventRequestAction,
    actorUserId?: number,
    actorName?: string,
    automatic: boolean,
    reason?: string,
    date: string,
}

export interface EventRequest extends EventRequestData {
    id: number,
    status: EventRequestStatus,
    requesterUserId: number,
    requesterName: string,
    requesterEmail: string,
    changesDeadline?: string,
    // El professor la pot editar ara (en correcció, o aprovada i dins del termini).
    canRequesterEdit: boolean,
    // Si en crear l'esdeveniment s'afegirà a Google Calendar (ho tria l'admin en aprovar).
    syncToCalendar: boolean,
    eventId?: number,
    eventCode?: string,
    createdAt: string,
    updatedAt: string,
    transitions: EventRequestTransition[],
}

// Calendari d'esdeveniments i sol·licituds en curs
export enum CalendarItemKind {
    Event = 0,
    Request = 1,
}

export interface CalendarItem {
    kind: CalendarItemKind,
    id: number,
    title: string,
    start: string,
    end?: string,
    status?: EventRequestStatus,
    eventCode?: string,
}
