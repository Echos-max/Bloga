// lib/axios.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

// 创建一个独立的 Axios 实例
const createAxiosInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // 请求拦截器
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // 从 localStorage / cookies / context 中获取 token（仅限客户端）
      if (typeof window !== 'undefined') {
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // 响应拦截器
  instance.interceptors.response.use(
    (response) => response.data, // 直接返回 data，避免每次都要 .data
    (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
  );

  return instance;
};

// 导出封装好的实例
export const apiClient = createAxiosInstance(process.env.NEXT_PUBLIC_API_BASE_URL!);