import { useEffect, useState } from "react";
import { getIdentity, Identity } from "../apis/payments";

/*
    This hook tries to get identity info from the server.
    It returns user and loading. While loading user is null.
    If there is no authentication, the hook redirects to signin
    keeping current url as redirectTo.
*/
const useUser = () => {

    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<Identity | undefined>()

    useEffect(() => {
        getIdentity()
            .then((x) => {
                setUser(x)
                setLoading(false)
            })
    }, [])

    return { user, loading }
}

export default useUser