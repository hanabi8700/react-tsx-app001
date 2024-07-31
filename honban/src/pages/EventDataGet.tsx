//axiosをimport
import axios from 'axios';
import useSWR from 'swr';

type SearchFilterObj = {
  method: string;
  url: string;
  start: string;
  end: string;
  data?: string;
};
// async function fetcher(key: string) {
//   // keyはuseSWR()の第１引数で渡されたURL
//   return fetch(key).then((res) => res.json() as Promise<User | null>);
// }
const fetcher = ({ method, url, start, end }: SearchFilterObj) =>
  axios({
    method,
    url,
    params: {
      start,
      end,
    },

    paramsSerializer: { indexes: null },
  }).then((res) => res.data);
// データの事前読み込み（当然キャッシュに保存される）
// plelaod('https://jsonplaceholder.typicode.com/users/1', fetcher);
//
//https://hanamaru8700.com/api/hanafullcal.py?start=2024-07-01&end=2024-08-05 4
export const EventDataGet = (
  method: string,
  endpointUrl: string,
  startTime: string,
  endTime: string,
) => {
  const { data, error, isLoading } = useSWR(
    { method, url: endpointUrl, start: startTime, end: endTime },
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
