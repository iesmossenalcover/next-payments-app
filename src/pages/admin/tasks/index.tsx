import { Container } from "@/components/layout/SideBar"
import { syncPeopleGoogleWorkspace } from "@/lib/apis/payments"
import { useApiRequest } from "@/lib/hooks/useApiRequest";
import { plainErrors } from "@/lib/utils";
import React, { useState, useEffect } from 'react';



const SyncPeopleToWorkspace = () => {

    const finalTime = null;
    const [initialTime] = useState(new Date().toLocaleTimeString());
    const [currentTime, setCurrentTime] = useState(new Date());
  
    useEffect(() => {
      const timer = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);
  
      return () => {
        clearInterval(timer);
      };
    }, []);

    const { data, errors, isLoading, executeRequest: syncUsersRequest } = useApiRequest(syncPeopleGoogleWorkspace);

    const updatePassword = () => {
        const ok = confirm("Executar aquesta acció tardarà temps?");
        if (!ok) return;

        syncUsersRequest();
    }

    if (errors) return <div className=" mt-4 ml-4 text-red-500 italic">{plainErrors(errors)}</div>;

    if (isLoading) return (<>
        <div className="mt-4 ml-4">
            <p>Hora Inici: {initialTime}</p>
            <p>Hora Actual: {currentTime.toLocaleTimeString()}</p>
            <p>Hora Fi: {finalTime === null ? "--:--:--" : finalTime}</p>
        </div>
    </>);

    return (<>
        <div className="mt-4 ml-4">
            <button className='
                        inline-block
                        text-white 
                        bg-blue-700 
                        hover:bg-blue-800 
                        focus:ring-4 
                        focus:ring-blue-300
                        font-medium
                        py-3
                        px-3
                        rounded-lg
                        text-sm
                        mr-5' onClick={updatePassword}>Sync users with google G</button>
            {data ? <p>{data.email}</p> : null}
        </div>
    </>)
}

export default function SyncPeopleToWorkspacePage() {
    return (
        <Container>
            <SyncPeopleToWorkspace />
        </Container>
    )
};