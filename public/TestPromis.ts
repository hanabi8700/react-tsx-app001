// import React from 'react'
const func = async (index: number) => {
  console.log(`before: ${index}`);
  await func2(index);
  console.log(`after: ${index}`);//After 5sec
};
//分離
const func2 = (index: number) => {
  //newしたPromiseを一旦変数に代入しておきます
  const promise = new Promise<void>((resolve) => {
    setTimeout(() => resolve(), 5000);
  });
  console.log(`${index}の途中`);
  return promise;
};
//実行
func(1);
func(2);
func(3);