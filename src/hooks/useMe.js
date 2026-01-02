//useMe.js
import { fetchMe, getToken, ME_QUERY_KEY } from "../api/authApi"
import { useQuery } from "@tanstack/react-query"

export function useMe() {
    const token = getToken();

    return useQuery({
        queryKey: ME_QUERY_KEY,
        queryFn: fetchMe,
        enabled: !!token, // 토큰이 있을때만
        retry: false,
        staleTime: 1000 * 60

    });
}
//const { data, isLoading, isPending} = useMe();