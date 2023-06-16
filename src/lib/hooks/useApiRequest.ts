import { useState } from "react";

export type ApiResult<T> = {
  data?: T;
  errors?: Map<string, string>;
};

type ApiCallType<T> = (...args: any[]) => Promise<ApiResult<T>>;

export const useApiRequest = <T>(apiCall: ApiCallType<T>) => {
  const [data, setData] = useState<T | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const executeRequest = async (...args: any[]) => {
    setIsLoading(true);

    try {
      const response = await apiCall(args);

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
