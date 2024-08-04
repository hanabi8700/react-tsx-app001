// import React from 'react'

import axios from 'axios';
// import useSWR from 'swr';
// async function fetcher(key: string) {
//   // keyはuseSWR()の第１引数で渡されたURL
//   return fetch(key).then((res) => res.json() as Promise<User | null>);
// }
export const axiosInstance = axios.create({
  baseURL: '/cgi-bin/',
});
const fetchers = (url: string) =>
  axiosInstance.get(url).then((res) => res.data);

// export const { data, error } = useSWR(shouldFetch ? 'hanafullcal.py?' : null, fetchers);
export default fetchers;
