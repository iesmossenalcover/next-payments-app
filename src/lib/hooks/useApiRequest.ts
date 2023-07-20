import { useEffect, useState } from "react";

export type ApiResult<T> = {
  data?: T;
  errors?: Map<string, string[]>;
};

type ApiCallType<T, U extends unknown[]> = (...args: U) => Promise<ApiResult<T> | T>;

export const useStartApiRequest = <T, U extends any[]>(
  apiCall: ApiCallType<T, U>,
  ...args: U
) => {
  const { data, errors, isLoading, executeRequest, setData } = useApiRequest(apiCall);

  useEffect(() => {
    executeRequest(...args);
  }, []);

  return { data, errors, isLoading, executeRequest, setData };
};

export const useApiRequest = <T, U extends any[]>(
  apiCall: ApiCallType<T, U>,
) => {
  const [data, setData] = useState<T | undefined>(undefined);
  const [errors, setErrors] = useState<Map<string, string[]> | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const executeRequest = async (...args: U) => {
    setIsLoading(true);
    setErrors(undefined);

    try {
      const response = await apiCall(...args);
      const result = response as ApiResult<T>;

      if (result && result.errors && result.errors.size > 0) {
        setErrors(result.errors);
        return false;
      } else if (result && result.data) {
        setData(result.data);
        return true;
      }
      else {
        setData(response as T);
        return true;
      }
    } catch (error) {
      const errors = new Map([["error", ["Unhandled error"]]]);
      setErrors(errors);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { data, errors, isLoading, executeRequest, setData };
};
