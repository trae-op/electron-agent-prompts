import axios, {
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type AxiosRequestConfig,
} from "axios";
import {
  setElectronStorage,
  getElectronStorage,
  TCacheResponse,
} from "../../store.js";
import { restApi } from "../../../config.js";
import type { ApiResponse, DataError, RequestOptions } from "./types.js";
import { logout } from "../logout.js";

function getAuthorization(): AxiosRequestConfig["headers"] | undefined {
  const token = getElectronStorage("authToken");
  if (token !== undefined) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }
  return undefined;
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL: restApi.urls.base,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const authHeaders = getAuthorization();
    config.headers = axios.AxiosHeaders.from({
      ...(typeof config.headers === "object" && config.headers !== null
        ? config.headers
        : {}),
      ...(authHeaders ?? {}),
    });
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => Promise.reject(error)
);

function handleResponse<T>(response: AxiosResponse<T>): ApiResponse<T> {
  return {
    status: response.status,
    data: response.data,
    error: undefined,
  };
}

function handleError<D extends DataError>(
  error: AxiosError<D>
): ApiResponse<any> {
  if (error.response) {
    if (error.response.status === 401) {
      logout();
    }

    return {
      status: error.response.status,
      error: {
        message: `Status: ${error.response.status}, ${
          Array.isArray(error.response.data.message)
            ? error.response.data.message.join(",")
            : error.response.data.message
        }`,
        code: error.code,
        details: error.response.data,
      },
    };
  } else if (error.request) {
    return {
      status: 0,
      error: { message: "No response received from the server" },
      data: undefined,
    };
  } else {
    return {
      status: 0,
      error: { message: error.message || "Request setup error" },
      data: undefined,
    };
  }
}

export async function get<T>(
  endpoint: string,
  options?: RequestOptions
): Promise<ApiResponse<T>> {
  try {
    const response: AxiosResponse<T> = await axiosInstance.get(
      endpoint,
      options
    );

    if (options?.isCache) {
      setResponseElectronStorage(endpoint, response);
    }

    return handleResponse<T>(response);
  } catch (error: any) {
    return handleError(error as AxiosError<DataError>);
  }
}

export function merge(data: TCacheResponse): TCacheResponse | undefined {
  let cacheStore = getElectronStorage("response");
  if (!cacheStore) {
    cacheStore = {};
  }

  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const incomingValue = data[key];
      const existingValue = cacheStore[key];

      const isIncomingArrayOfCacheableItems =
        Array.isArray(incomingValue) &&
        incomingValue.every(
          (item) => typeof item === "object" && item !== null && "id" in item
        );

      if (isIncomingArrayOfCacheableItems) {
        const existingArray: any[] = Array.isArray(existingValue)
          ? [...existingValue]
          : [];
        const updatedArray: any[] = [];

        incomingValue.forEach((incomingItem: any) => {
          const existingItemIndex = existingArray.findIndex(
            (existingItem: any) => existingItem.id === incomingItem.id
          );

          if (existingItemIndex !== -1) {
            updatedArray.push({
              ...existingArray[existingItemIndex],
              ...incomingItem,
            });

            existingArray.splice(existingItemIndex, 1);
          } else {
            updatedArray.push(incomingItem);
          }
        });

        cacheStore[key] = updatedArray;
      } else if (
        typeof incomingValue === "object" &&
        incomingValue !== null &&
        !Array.isArray(incomingValue)
      ) {
        cacheStore[key] = {
          ...(typeof existingValue === "object" && existingValue !== null
            ? existingValue
            : {}),
          ...incomingValue,
        };
      } else {
        cacheStore[key] = incomingValue;
      }
    }
  }

  return cacheStore;
}

function hasIdProperty(value: unknown): value is { id: string | number } {
  if (typeof value === "object" && value !== null && "id" in value) {
    const candidateId = (value as { id: unknown }).id;

    return typeof candidateId === "string" || typeof candidateId === "number";
  }

  return false;
}

function deleteResponseEntityElectronStorage(entityId: string): void {
  const cacheResponse = getElectronStorage("response");

  if (cacheResponse === undefined) {
    return;
  }

  const updates: TCacheResponse = {};
  let hasUpdates = false;

  for (const [endpoint, cachedValue] of Object.entries(cacheResponse)) {
    if (Array.isArray(cachedValue)) {
      const filtered = cachedValue.filter((item) => {
        if (!hasIdProperty(item)) {
          return true;
        }

        return String(item.id) !== entityId;
      });

      if (filtered.length !== cachedValue.length) {
        updates[endpoint] = filtered;
        hasUpdates = true;
      }

      continue;
    }

    if (hasIdProperty(cachedValue) && String(cachedValue.id) === entityId) {
      updates[endpoint] = undefined;
      hasUpdates = true;
    }
  }

  if (!hasUpdates) {
    return;
  }

  const merged = merge(updates);

  if (merged !== undefined) {
    setElectronStorage("response", merged);
  }
}

function setResponseElectronStorage(
  endpoint: string,
  response: AxiosResponse<any, any>
) {
  if (response.status >= 200 && response.status < 300) {
    const merged = merge({
      [endpoint]: response.data,
    });
    if (merged !== undefined) {
      setElectronStorage("response", merged);
    }
  }
}

export async function post<T>(
  endpoint: string,
  data?: any,
  options?: RequestOptions
): Promise<ApiResponse<T>> {
  try {
    const response: AxiosResponse<T> = await axiosInstance.post(
      endpoint,
      data,
      options
    );
    return handleResponse<T>(response);
  } catch (error: any) {
    return handleError(error as AxiosError<DataError>);
  }
}

export async function put<T>(
  endpoint: string,
  data?: any,
  options?: RequestOptions
): Promise<ApiResponse<T>> {
  try {
    const response: AxiosResponse<T> = await axiosInstance.put(
      endpoint,
      data,
      options
    );
    return handleResponse<T>(response);
  } catch (error: any) {
    return handleError(error as AxiosError<DataError>);
  }
}

export async function del<T>(
  endpoint: string,
  entityId: string,
  options?: RequestOptions
): Promise<ApiResponse<T>> {
  try {
    const response: AxiosResponse<T> = await axiosInstance.delete(
      endpoint,
      options
    );
    if (response.status >= 200 && response.status < 300) {
      deleteResponseEntityElectronStorage(entityId);
    }
    return handleResponse<T>(response);
  } catch (error: any) {
    return handleError(error as AxiosError<DataError>);
  }
}
