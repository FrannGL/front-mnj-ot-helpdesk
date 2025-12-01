'use server';

import { CONFIG } from 'src/config/config-global';

interface FetchServerOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined | null>;
}

export async function fetchServer<T>(
  endpoint: string,
  options: FetchServerOptions = {}
): Promise<T> {
  const baseUrl = CONFIG.site.serverJST;
  const { params, ...fetchOptions } = options;

  let url = `${baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        searchParams.append(key, value.toString());
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
      cache: 'no-store',
      ...fetchOptions,
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`Error fetching ${endpoint} from server:`, error);
    throw error;
  }
}
