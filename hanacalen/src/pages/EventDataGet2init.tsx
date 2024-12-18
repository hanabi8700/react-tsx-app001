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

// const delay = () => new Promise((res) => setTimeout(() => res(), 800));
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
  // 第一引数にキャッシュキー、第二引数にfetcherを渡す。fetcherは事前に用意する必要がある
  // 第三引数にはoptionを渡せるが省略も可能
  // await delay();
  const { data, error, isLoading } = useSWR(
    { method, url: endpointUrl, start: startTime, end: endTime },
    fetcher,
    { shouldRetryOnError: false, dedupingInterval: 60 * 1000 },
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
