//-----------------------------------------------------
//配列連番の生成（範囲指定）
// const List2 = calc.range2(10, 26).map(String);

import { readFile } from 'fs/promises';
import { resolve } from 'path';

//-----------------------------------------------------
export const range2 = (
  start: number,
  stop: number,
  step: number = 1,
): number[] =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);

//-----------------------------------------------------
// 文字列形式で取得するので改行文字で区切ってオブジェクト配列に変換
//-----------------------------------------------------
export const stringToObjectArray = (lineText: string) => {
  const kugiri = /\r?\n/;
  const lineList = lineText.split(kugiri,-1); //データを配列に
  const keyList = range2(10, 26);
  const resultObj = lineList
    // .filter((data, index) => data[index] !== 0) // 2行目以降がデータのため
    .map((line: string) => {
      const valueList = line.split(',');
      const tmpObj: { [x: string]: string } = {};
      keyList.map((key, index) => (tmpObj[key] = valueList[index]));
      return tmpObj;
    });
  return resultObj;
};

// import  text  from './yearly3';
// let data2 = '';
export async function loadFile(path): Promise<string> {
  let ref;
  try {
    // await readFile(path, 'utf8').then((res) => {
    //   console.log(res);
    // });
    ref = readFile(path, 'utf8');
  } catch (error) {
    console.error('ファイルの読み込みに失敗しました:', error);
  }
  return ref;
}
// let data2 = '';
const data2 = await loadFile('./public/yearly3.ts');
const data3 = data2.toString().split(/\r?\n/,-1);
console.log(data3);
//
const resultObj = stringToObjectArray(data2);
console.log(resultObj);
