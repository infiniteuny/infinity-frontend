import axios, { AxiosInstance } from 'axios';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface InfinityApiDataSource extends AxiosInstance {}

export const infinityApiDataSourceImpl: InfinityApiDataSource = axios.create({
  baseURL: process.env.INFINITY_API_URL,
});
