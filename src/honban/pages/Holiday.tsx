// import React from 'react';
import * as calc from '~/CalenderLib';
import Qreki, { Date_getJD } from '~/Qreki';
// type Props = {}
//
type holidayList = {
  date: string;
  name: string;
  holiday: boolean;
  order: number;
}[];
// ホリデイ祝日、六曜、特別記念日など
const Holiday = (calendarDate:string, holidayList:holidayList=[]) => {
  const calendarDates = calc.CalenderLib(calendarDate);
  //--------------------------------
  const betweenAraay = calc.getDatesBetween(
    calendarDates.firstDate,
    //calendarDates.lastDate,
    calc.getSpecificDayDate(
      6, //土曜日
      3, //2週目
      calc.getDateWithString(calendarDates.lastDate),
    ),
  );
  const result = betweenAraay.map((date) => {
    const dateQreki = Qreki(Date_getJD(date)); //date5.getJD()
    const rokuObj = {
      date: calc.getDateWithString(date),
      name: dateQreki.rokuyo, //六曜取得,
      holiday: false,
      order: 11,
    };
    return rokuObj;
  });
  holidayList = holidayList.concat(result); //配列結合
  return holidayList;
};

export default Holiday;
