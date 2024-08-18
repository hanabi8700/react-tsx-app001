// import React from 'react';
import * as calc from '~/CalenderLib';
import Qreki from '~/Qreki';
// import hanalibC01 from '~/hanalibC01.js';
// const hanaFunc = new hanalibC01();
//
export interface holidayList {
  date: string;
  name: string;
  holiday: boolean;
  order: number; //(11)
  type: string;
  option: number;
  name1?: string;
  option1?: number;
  duration?: number;
  id?: number;
  backgroundColor: string;
}
// ホリデイ祝日、六曜２４節気、特別記念日など
//# ２４節気の定義28(3夏,9秋,15冬,21春)立〇、(0春,12秋)〇分
//十二支  0寅 1卯 2辰 3巳 4午 5未 6申 7酉 8戌 9亥 10子 11丑
function Rokuyo(betweenArray: Date[]) {
  const result = betweenArray.map((date) => {
    const dateQreki = Qreki(date); //date5.getJD()
    const date1 = calc.getDateWithString(date);
    const obj: holidayList = {
      date: date1,
      name: dateQreki.rokuyo + dateQreki.sekki24[0], //六曜２４節気取得,
      holiday: (dateQreki.sekki24[1] as number) % 12 === 0 ? true : false,
      order: 11,
      type: 'rokuObj',
      option: dateQreki.sekki24[1] as number,
      name1: dateQreki.si12[0] as string, //十二支取得,
      option1: dateQreki.si12[1] as number,
      backgroundColor:"None",
    };
    return obj;
  });

  return result; //一カ月分
}

//秋分の日以前で、一番近い新月の日を1日目（旧暦8月1日）とし、
//15日目を中秋とすると決められているからです。
export default Rokuyo;
