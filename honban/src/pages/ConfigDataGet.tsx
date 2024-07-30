//axiosをimport
import axios from 'axios';
import useSWR from 'swr';

// async function fetcher(key: string) {
//   // keyはuseSWR()の第１引数で渡されたURL
//   return fetch(key).then((res) => res.json() as Promise<User | null>);
// }
const fetcher = ({ url, start, end }) =>
  axios
    .get(url, {
      params: {
        start: start,
        end: end,
      },
    })
    .then((res) => res.data);
// データの事前読み込み（当然キャッシュに保存される）
// plelaod('https://jsonplaceholder.typicode.com/users/1', fetcher);
//
//https://hanamaru8700.com/api/hanafullcal.py?start=2024-07-01&end=2024-08-05 4
export const ConfigDataGet = (
  baseUrl: string,
  startTime: string,
  endTime: string,
) => {
  // { url: '/api/orders', args: user }
  // const url = '/cgi-bin/webcalhana/hanafullcal.py';
  // const args = '?start=2024-07-01&end=2024-08-05';
  // const start = '2024-07-01';
  // const end = '2024-08-05';
  const { data, error, isLoading } = useSWR(
    { url: baseUrl, start: startTime, end: endTime },

    fetcher,
  );
  return {
    data: data,
    iserror: error,
    isLoading,
  };
};
// '/cgi-bin/webcalhana/hanafullcal.py?start=2024-07-01&end=2024-08-05',
// '/cal/holiday?start=2024-07-01&end=2024-08-05',
// 'https://jsonplaceholder.typicode.com/users/1',
