// import React from 'react'

import axios from 'axios';
// import useSWR from 'swr';
// async function fetcher(key: string) {
//   // keyはuseSWR()の第１引数で渡されたURL
//   return fetch(key).then((res) => res.json() as Promise<User | null>);
// }
export const axiosInstance = axios.create({
  baseURL: '/cgi-bin/',
  timeout: 3000,
});
type Option = { [x: string]: string|number };
const fetchers = (url: string, option: Option) =>
  axiosInstance.get(url, option).then((res) => res.data);

// export const { data, error } = useSWR(shouldFetch ? 'hanafullcal.py?' : null, fetchers);
export default fetchers;
//
//fetcher に複数の引数を渡す,配列に格納した上でfetcherへ値を引き渡します。
//const { data: user } = useSWR(['/api/user', token], ([url, token]) => fetchWithToken(url, token))
//オブジェクトの受け渡し,同様にオブジェクトをfetcherへ引き渡すことも可能です。
//const { data: orders } = useSWR({ url: '/api/orders', args: user }, fetcher)
