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
  order: number;
  type: string;
  option: number;
  name1?: string;
  option1?: number;
}
// ホリデイ祝日、六曜２４節気、特別記念日など
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
    };
    return obj;
  });

  return result; //一カ月分
}

export default Rokuyo;
