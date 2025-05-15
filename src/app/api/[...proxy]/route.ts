import type { NextRequest } from 'next/server';
import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';
import { NextResponse } from 'next/server';

const handleRequest = async (req: NextRequest) => {
  try {
    const path = req.nextUrl.pathname.substring(req.nextUrl.pathname.indexOf('/api') + 5);

    const EXTERNAL_API_URL = process.env.NEXT_PUBLIC_JST_SERVER || '';

    if (!EXTERNAL_API_URL) {
      throw new Error('No API base found');
    }

    const fetchOptions: AxiosRequestConfig = {
      method: req.method.toLowerCase(),
      url: `${EXTERNAL_API_URL}/${path}${req.nextUrl.search}`,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
      const contentType = req.headers.get('Content-Type');

      if (contentType) {
        if (contentType.includes('application/json')) {
          const jsonData = await req.json();
          fetchOptions.data = jsonData;
          console.log('Enviando JSON:', jsonData);
        } else if (contentType.includes('multipart/form-data')) {
          const formData = await req.formData();
          fetchOptions.data = formData;
        }
      }
    }

    const { data } = await axios(fetchOptions);
    return NextResponse.json(data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('----------Error de Axios----------', error.response?.data);
      return NextResponse.json(
        { error: error.response?.data?.message || 'Error desconocido' },
        { status: error.response?.status || 500 }
      );
    }
    console.error('----------Otro tipo de error----------', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
};

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const PATCH = handleRequest;
export const DELETE = handleRequest;
