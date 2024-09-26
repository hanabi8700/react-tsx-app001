//axiosをimport
import useSWR from 'swr';
import fetchers from './Fetchers';

// proxy '/cgi-bin/webcalhana/hanafullcal.py?start=2024-07-01&end=2024-08-05',
//hanamaru8700.com/cgi-bin/hanaflask/index.cgi/hanacalen/holiday?start=2022-03-27T00%3A00%3A00%2B09%3A00&end=2022-05-08T00%3A00%3A00%2B09%3A00

// データの事前読み込み（当然キャッシュに保存される）
// plelaod('https://jsonplaceholder.typicode.com/users/1', fetcher);
// 'https://jsonplaceholder.typicode.com/users/1',
// const debug9 = true;

//-----------------------------------------------------
//通信関数
//一般的に
//const { data, error, isValidating, mutate } = useSWR(key, fetcher, options)
//// console.log(data, error, isLoading, isValidating)
//undefined undefined true true  // => フェッチの開始
//undefined Error false false    // => フェッチの完了、エラーを取得
//undefined Error false true     // => 再試行の開始
//Data undefined false false     // => 再試行の完了、データを取得
//-----------------------------------------------------
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

  // const url = `${endpointUrl}?start=2022-03-27T00%3A00%3A00%2B09%3A00&end=2022-05-08T00%3A00%3A00%2B09%3A00`;
  // const url = `${endpointUrl}?start=${startTime}&end=${endTime}`;
  const { data, error, isLoading, isValidating } = useSWR(
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
    isValidating,
  };
};

//mutate をキャッシュを更新するために利用できます。
//例えば、下記のようにすることで全てのキャッシュデータをクリアできます。
//const { mutate } = useSWRConfig()
// mutate(
//   key => true, // どのキャッシュキーを更新するか
//   undefined, // キャッシュデータを `undefined` に更新する
//   { revalidate: false } // 再検証しない
// )