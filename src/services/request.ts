import type { AxiosResponse, AxiosRequestConfig } from 'axios';

import axios from 'axios';

import { CONFIG } from 'src/config-global';

export const request = async (
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  body?: any,
  responseType?: 'json' | 'blob' | 'text' | 'formData'
): Promise<{
  data: any;
  status: number;
  error?: string;
}> => {
  try {
    // const token = getToken();

    // if (!token && method !== 'GET') {
    //   return {
    //     data: {},
    //     status: 401,
    //     error: 'Token is missing. Authorization required.',
    //   };
    // }
    const { apiBase } = CONFIG.site;

    const url = `${apiBase}/${endpoint}`;

    const isFormData = body instanceof FormData;

    const headers: Record<string, string | undefined> = {
      'Content-Type': isFormData ? undefined : 'application/json',
      //   Authorization: token ? `Bearer ${token}` : undefined,
    };

    const config: AxiosRequestConfig = {
      method,
      url,
      headers,
      data: body,
      responseType: responseType === 'formData' ? 'json' : responseType || 'json',
    };

    const response: AxiosResponse = await axios(config);

    return {
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return {
        data: error.response.data,
        status: error.response.status,
        error: error.response.data?.message || 'Unknown error',
      };
    }

    return {
      data: {},
      status: 500,
      error: 'Unexpected error occurred',
    };
  }
};
