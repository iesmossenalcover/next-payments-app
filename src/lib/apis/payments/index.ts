import { useState } from "react";

export {
  batchUpload,
  createOrder,
  filterPeopleQuery,
  getAdminInfo,
  getCourses,
  getCoursesSelector,
  getEventPayments,
  getEventPeople,
  getEventSummary,
  getEventsView,
  getGroupsView,
  getIdentity,
  getOrderInfo,
  getPeopleView,
  getPersonActiveEvents,
  getPersonById,
  setAppConfig,
  setPayment,
  signin,
  signinOAuth,
  updatePerson,
  syncPeopleGoogleWorkspace,
  syncPersonGoogleWorkspace,
  updatePasswordGoogleWorkspace,
  exportPeopleGoogleWorkspace,
  movePeopleGoogleWorkspace,
  suspendPeopleGoogleWorkspace,
  addPeopleToGroupsGoogleWorkspace,
  exportWifiUsers,
  exportPeople,
  setActiveCourse,
  createCourse,
  getCourseById,
  updateCourse,
  downloadTemplate
} from "./client";

export type {
  Course,
  AdminInfo,
  AppConfig,
  BatchUploadSummary,
  EventPayment,
  EventPayments,
  EventPeople,
  EventPeopleGroup,
  EventPerson,
  EventRow as EventsRow,
  GroupRow, 
  EventSummary,
  EventSummaryVm,
  GetOrderInfo,
  GetOrderInfoEvent,
  Identity,
  PaymentSummary,
  PersonActiveEvent,
  PersonActiveEventsVm,
  PersonRow,
  Response,
  SigninResponse,
  SyncPersonResponse,
  UpdatePasswordResponse,
} from "./models";

export { SigninStatus } from "./models";