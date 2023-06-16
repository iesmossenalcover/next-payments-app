import { useState } from "react";

export type ApiResult<T> = {
  data?: T;
  errors?: Map<string, string>;
};

type ApiCallType<T, U extends any[]> = (...args: U) => Promise<ApiResult<T>>;

export const useApiRequest = <T, U extends any[]>(apiCall: ApiCallType<T, U>) => {
  
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const executeRequest = async (...args: U) => {
    setIsLoading(true);

    try {
      const response = await apiCall(...args);

      if (response.errors) {
        const errorMessages = Array.from(response.errors.values()).join(" ");
        setError(errorMessages);
      } else if (response.data) {
        setData(response.data);
      }
    } catch (error) {
      setError("An error occurred while fetching data.");
    } finally {
      setIsLoading(false);
    }
  };

  return { data, error, isLoading, executeRequest };
};
