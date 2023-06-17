import { useState } from "react";

export type ApiResult<T> = {
  data?: T;
  errors?: Map<string, string>;
};

type ApiCallType<T, U extends unknown[]> = (...args: U) => Promise<ApiResult<T> | T>;

export const useApiRequest = <T, U extends any[]>(
  apiCall: ApiCallType<T, U>,
) => {
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const executeRequest = async (...args: U) => {
    setIsLoading(true);

    try {
      const response = await apiCall(...args);
      const result = response as ApiResult<T>;
      if (result && result.errors && result.errors.size > 0) {
        const errorMessages = Array.from(result.errors.values()).join(" ");
        setError(errorMessages);
      } else if (result && result.data) {
        setData(result.data);
      }
      else {
        setData(response as T);
      }
    } catch (error) {
      setError("An error occurred while fetching data.");
    } finally {
      setIsLoading(false);
    }
  };

  return { data, error, isLoading, executeRequest };
};
