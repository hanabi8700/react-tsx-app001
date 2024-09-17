//axiosをimport
import useSWR from 'swr';
import fetchers from './Fetchers';

// proxy '/cgi-bin/webcalhana/hanafullcal.py?start=2024-07-01&end=2024-08-05',
//hanamaru8700.com/cgi-bin/hanaflask/index.cgi/hanacalen/holiday?start=2022-03-27T00%3A00%3A00%2B09%3A00&end=2022-05-08T00%3A00%3A00%2B09%3A00

// データの事前読み込み（当然キャッシュに保存される）
// plelaod('https://jsonplaceholder.typicode.com/users/1', fetcher);
// 'https://jsonplaceholder.typicode.com/users/1',
const debug9 = false;

export const EventDataGet = (
  // method: string,
  endpointUrl: string,
  option: { [x: string]: any },
  // startTime: string,
  // endTime: string,
) => {
  // 第一引数にキャッシュキー、第二引数にfetcherを渡す。fetcherは事前に用意する必要がある
  // 第三引数にはoptionを渡せるが省略も可能
  // await delay();
  debug9 && console.log('dataGet', endpointUrl);
  // const url = `${endpointUrl}?start=2022-03-27T00%3A00%3A00%2B09%3A00&end=2022-05-08T00%3A00%3A00%2B09%3A00`;
  // const url = `${endpointUrl}?start=${startTime}&end=${endTime}`;
  const { data, error, isLoading } = useSWR(
    [endpointUrl, option],
    ([url, option]) => fetchers(url, option),
    {
      //shouldRetryOnError: false を指定する事により再試行を無効にすることが可能です。
      // shouldRetryOnError: true,
      dedupingInterval: 60 * 1000, //重複したリクエストを排除する
      // onErrorRetry: (error, revalidate, { retryCount }) => {
      //   //onErrorRetry: (error, revalidate, retryCount:number ) => {
      //   // 404では再試行しない。
      //   debug9 && console.log(error, retryCount); //
      //   if (error.response.status === 404) return;

      //   // 特定のキーでは再試行しない。
      //   // if (key === '/api/user') return;

      //   // 再試行は10回までしかできません。
      //   if (retryCount >= 10) return;

      //   // 5秒後に再試行します。
      //   setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 5000);
      // },
    },
  );
  //null:使いません。2：明示的に何個インデントが指定されている
  // console.log('data', JSON.stringify(data, null, 2));
  return {
    data: data,
    iserror: error,
    isLoading,
  };
};
