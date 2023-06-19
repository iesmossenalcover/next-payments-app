export { filterPeopleQuery, signinOAuth, getEventPayments, setPayment, getAdminInfo, setAppConfig, getEventSummary, getEventPeople, updatePerson, getOrderInfo, getIdentity, signin, getPeopleView, getCoursesSelector, batchUpload, getPersonById, getPersonActiveEvents, createOrder, getEventsView } from "./client"
export type { ApiResult, SyncPersonResponse, AdminInfo, AppConfig, PaymentSummary, EventSummaryVm, EventSummary, EventPayments, EventPayment, EventPerson, EventPeopleGroup, EventPeople, GetOrderInfoEvent, GetOrderInfo, SigninResponse, Identity, PersonRow, BatchUploadSummary, PersonActiveEventsVm, PersonActiveEvent, EventRow as EventsRow } from "./models"
export { SigninStatus } from "./models"

import { useState, useEffect } from 'react';
import { ApiResult, SyncPersonResponse } from "./models";
import { syncPepleToGoogleWorkspace } from "./client";

export const useSyncPeopleToGoogleWorkspace = () => {
    const [data, setData] = useState<ApiResult<SyncPersonResponse> | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const syncData = async () => {
        setIsLoading(true);

        try {
            const response = await syncPepleToGoogleWorkspace();
            if (response.errors) {
                const errorMessages = Array.from(response.errors.values()).join(' ');
                setError(errorMessages);
            } else {
                setData(response);
            }
        } catch (error) {
            setError("An error occurred while fetching data.");
        }

        setIsLoading(false);
    };

    return { data, error, isLoading, syncData };
};