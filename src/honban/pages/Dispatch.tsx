//useReducerとuseReducerをReactからimport
import { useEffect, useState } from 'react';
// import './App.css';
//axiosをimport
import axios from 'axios';
// axios.defaults.headers.common = {
//   'X-Requested-With': 'XMLHttpRequest',
//   'X-CSRF-TOKEN': document
//     .querySelector('meta[name="csrf-token"]')
//     .getAttribute('content'),
// };
//Promissとして返ってくるレスポンスデータ
// response.data       // レスポンスデータ(response.dataにデータが返る)
// response.status     // ステータスコード(今回のエラーの場合404 4xxのステータスコードはクライアント側でエラーが発生していることを表しています)
// response.statusText // ステータステキスト
// response.headers    // レスポンスヘッダ
// response.config     // コンフィグ
// if (error.response) { // 2XXの範囲外
// } else if (error.request) { // 要求がなされたが、応答が受信されなかった
// } else {    }       // トリガーしたリクエストの設定に何かしらのエラーがある
// const baseURL1 = 'https://jsonplaceholder.typicode.com/posts';
// const baseURL = 'https://jsonplaceholder.typicode.com/posts/1';
//-----------------------------------------------------------------------------------
// ReactとAxiosライブラリをimportした上、useStateでデータを保持し、
// useEffectでAPIリクエストを実行するというReactコンポーネントを定義する必要があります。
//-----------------------------------------------------------------------------------

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

interface Post extends Todo {
  body: string;
}

interface Item {
  id: number;
  title: string;
}
type ResourceType = 'todos' | 'posts';

const Dispatch = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [resource, setResource] = useState<ResourceType>('todos');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get(
          `https://jsonplaceholder.typicode.com/${resource}`,
        );
        console.log(response);
        const itemData: Item[] = response.data.map(
          (responseData: Todo | Post) => {
            return { id: responseData.id, title: responseData.title };
          },
        );
        setItems(itemData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchItems();
  }, [resource]);
  const onTodoButtonClick = () => {
    setResource('todos');
  };
  const onPostButtonClick = () => {
    setResource('posts');
  };
  return (
    <div>
      <button
        onClick={() => onTodoButtonClick()}
        className="btn btn-primary mx-2"
      >
        Todos
      </button>
      <button
        onClick={() => onPostButtonClick()}
        className="btn btn-secondary mx-2"
      >
        Posts
      </button>
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.id + ' ' + item.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default Dispatch;
