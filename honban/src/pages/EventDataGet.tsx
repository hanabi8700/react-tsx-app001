//axiosをimport
import useSWR from 'swr';
import fetchers from './Fetchers';

// proxy '/cgi-bin/webcalhana/hanafullcal.py?start=2024-07-01&end=2024-08-05',
//hanamaru8700.com/cgi-bin/hanaflask/index.cgi/hanacalen/holiday?start=2022-03-27T00%3A00%3A00%2B09%3A00&end=2022-05-08T00%3A00%3A00%2B09%3A00

// データの事前読み込み（当然キャッシュに保存される）
// plelaod('https://jsonplaceholder.typicode.com/users/1', fetcher);
// 'https://jsonplaceholder.typicode.com/users/1',

export const EventDataGet = (
  // method: string,
  endpointUrl: string,
  startTime: string,
  endTime: string,
) => {
  // 第一引数にキャッシュキー、第二引数にfetcherを渡す。fetcherは事前に用意する必要がある
  // 第三引数にはoptionを渡せるが省略も可能
  // await delay();
  console.log('dataGet' )
  // const url = `${endpointUrl}?start=2022-03-27T00%3A00%3A00%2B09%3A00&end=2022-05-08T00%3A00%3A00%2B09%3A00`;
  const url = `${endpointUrl}?start=${startTime}&end=${endTime}`;
  const { data, error, isLoading } = useSWR(url, fetchers, {
    shouldRetryOnError: false,
    dedupingInterval: 60 * 1000,
  });
  //null:使いません。2：明示的に何個インデントが指定されている
  // console.log('data', JSON.stringify(data, null, 2));
  return {
    data: data,
    iserror: error,
    isLoading,
  };
};
