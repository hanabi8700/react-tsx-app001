const AsyncRobotama = async () => {
  return "AsyncRobotama";
};

AsyncRobotama().then((result) => {
  console.log(result);
});

const PromiseCalc = (num) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(num * num);
    }, 2000);
  });
};

const AsyncAllFunc = async () => {
  // 3-1. まず最初に、実行予定のPromise処理をすべて起動させて変数に格納します。
  const promise1 = PromiseCalc(10);
  const promise2 = PromiseCalc(100);
  const promise3 = PromiseCalc(1000);

  // 3-2.「await」を付与することですべてのPromise処理を並列に動かして結果を取得できる。
  console.log([await promise1, await promise2, await promise3]);
};

AsyncAllFunc();

