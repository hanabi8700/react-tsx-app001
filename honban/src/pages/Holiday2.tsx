// import React from 'react'

import { HolidayList } from './Rokuyo';
import * as calc from '~/CalenderLib';
import { CalledCalc300 } from '../../../public/CalledCalc300';
import { CalledCalc400 } from '../../../public/CalledCalc400';
export type Result1 = {
  type: number;
  date: Date[];
  data010: number;
};

const debug9 = true;
//-----------------------------------------------------
//  祝日計算
//-----------------------------------------------------
//
//
export const Holiday2 = (
  specialHolidayTxt: string,
  calendarDateStr: string,
): HolidayList[] => {
  const calendarDate = calc.initDate(calendarDateStr); //1日
  const resultYear = calendarDate.getFullYear();
  debug9 && console.log('カレンダー:', calendarDate.toLocaleDateString());

  const result2: HolidayList[] = [];
  // 文字列形式で取得するので改行文字で区切って配列に変換
  let resultObj = calc.stringToObjectArray(specialHolidayTxt);
  const dSA = getSpringAtumday(resultYear); //春分の日3月、秋分の日9月
  resultObj = resultObj.concat(dSA); //結合
  debug9 && console.log('Result:', resultObj);
  //   {//形式
  //   date: '2024/08/16', string ->日付
  //   name: '祝日4',   string
  //   holiday: true,   boolean--->祝日判断
  //   order: 1101,     number---->30xx,40xx,3400,3405
  //   type: 'holiday', string
  //   option: 0,       number
  //   duration: 4,     number
  //   backgroundColor: 'None', string-->バックグラウンド
  // },

  for (let i = 0; i < resultObj.length; i++) {
    const data = resultObj[i];
    //施工年チェック
    const status = checkStartEndYear(data, resultYear);
    if (status) {
      //終年or除外年
    } else if (
      data[10][0] !== undefined &&
      data[10][0] !== '#' &&
      data[10][0] !== '0'
    ) {
      if (data[14][0] === '3') {
        // #拡張形式１（日,始年月,加算月,拡張内容,休平日+300+振替コード,種別色,終年,除外年01,除外年02,除外年03,）
        // 15,194801,12,成人の日,301,0,1999
        const result = CalledCalc300(
          data[10], //日にち
          data[11], //始まり年月、回数月
          Number(data[12]), //か月毎
          calendarDate,
        );
        debug9 && console.log('data300', data, result);
        const holi = data[14][2] === '1' ? true : false;

        result.date.forEach((date) => {
          result2.push({
            date: calc.getDateWithString(date),
            name: data[13],
            option: result.data010,
            order: result.type * 10, //(3xx)
            type: 'Holiday',
            holiday: holi,
            backgroundColor: 'None',
          });
        });
      } else if (data[14][0] === '4') {
        // #拡張形式２（週,始年月,曜日,拡張内容,休平日+400+振替コード,種別色,終年,除外年01,除外年02,除外年03,）
        // 2,200001,1,成人の日,401,//1月の第2月曜日
        // 2,202010,1,スポーツのの日,401,,,2020,2021//10月の第2月曜日
        const result = CalledCalc400(
          data[10], //週間
          data[11], //始年月
          data[12], //曜日
          calendarDate,
        );
        debug9 && console.log('data400', data, result);
        const holi = data[14][2] === '1' ? true : false;

        result.date.forEach((date) => {
          result2.push({
            date: calc.getDateWithString(date),
            name: data[13],
            option: result.data010,
            order: result.type * 10, //(4xx)
            type: 'Holiday',
            holiday: holi,
            backgroundColor: 'None',
          });
        });
      }
    }
  }
  //振替休日,国民の休日チェック
  const result3 = frikaeHoliday(result2); //order:3400
  const result4 = kokuminHoliday(result2); //order:3405
  const holidayArray = result2.concat(result3, result4); //配列結合シャローコピー

  debug9 && console.log('解析結果2', result2); //order:3xxx,4xxx
  debug9 && console.log('解析結果3', result3);
  debug9 && console.log('解析結果4', result4);

  return holidayArray;
};
//---------------------------
//施工年終了年除外年チェック
//---------------------------
const checkStartEndYear = (
  data: { [x: string]: string }, //祝日リスト配列
  resultYear: number, //カレンダー日付年
) => {
  //始年月
  const [num9, year9, month] = calc.getNamYearMonth(data[11]);
  debug9 &&
    console.log('getNamYearMonth', data[11], data[13], num9, year9, month);
  const stat3 = Number(year9 ? year9 : 0) > resultYear;
  //終年
  const stat1 = Number(data[16] ? data[16] : 9999) < resultYear;
  let stat2 = false;
  for (let i = 0, j = 17; i < 4; i++, j++) {
    stat2 = Number(data[j] ? data[j] : 9999) === resultYear;
    if (stat2) break; //除外年;
  }
  debug9 && console.log('stat:', resultYear, data[16], stat1, stat2, stat3);
  const status = stat1 || stat2 || stat3;
  return status;
};

//
//-----------------------------------------------------
//振替休日チェック(前日が日曜日かつ祝日)月曜日
//1973年4月以降に適用します。
//単純に日曜日に祝日があると、翌日以降の祝日でない日を振替休日とします。
//2006年以前の振替休日は厳密には、祝日が日曜なら翌日が休みとなりますが、
//2007年以降の計算方法でも問題ありません。
//-----------------------------------------------------
const frikaeHoliday = (holidayLists: HolidayList[]) => {
  const result3: HolidayList[] = [];
  holidayLists.forEach((el) => {
    const stat1 =
      el.holiday == false || calc.getDateDiff('1973/04/01', el.date) < 0;
    const stat2 = calc.stringToDate(el.date).getDay() != 0;
    if (stat1 || stat2) {
      //
    } else {
      //祝日&&日曜日
      //const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      let dtStr0 = el.date;
      for (let i = 0; i < 7; i++) {
        const dt1 = calc.stringToDate(el.date, i + 1);
        const dtStr1 = calc.getDateWithString(dt1);
        const index1 = holidayLists.findIndex((data) => data.date === dtStr1);
        dtStr0 = index1 > -1 ? dtStr0 : dtStr1;
        if (index1 === -1) break;
      }
      if (dtStr0) {
        result3.push({
          date: dtStr0,
          name: '振替休日',
          option: 0,
          order: 3400, //(34xx)
          type: 'Holiday',
          holiday: true,
          backgroundColor: 'None',
        });
      }
    }
  });
  return result3;
};

//
//-----------------------------------------------------
//国民の休日
//1986年以降に適用します。
//特定の日について、前日が祝日で、翌日が祝日で、
//当日が日曜日でも祝日でもない場合、その日は国民の休日です。
//-----------------------------------------------------
const kokuminHoliday = (holidayLists: HolidayList[]) => {
  const result4: HolidayList[] = [];
  holidayLists.forEach((el) => {
    if (el.holiday == false) {
      //
    } else {
      const dt1 = calc.stringToDate(el.date, 1); //真ん中の日にち日曜日
      const dtStr1 = calc.getDateWithString(dt1);
      const notSun1 = dt1.getDay() != 0; //日曜日
      const index1 = holidayLists.findIndex((data) => data.date === dtStr1);
      //
      const dt2 = calc.stringToDate(el.date, 2); //2日後が祝日か
      const dtStr2 = calc.getDateWithString(dt2);
      const index2 = holidayLists.findIndex(
        (data) => data.date === dtStr2, //&& data.date != dtStr1,
      );
      //console.log('Date->index', el.date, index2, index1);
      if (index2 > -1 && notSun1 && index1 === -1) {
        result4.push({
          date: calc.getDateWithString(dt1),
          name: '国民の休日',
          option: 0,
          order: 3405, //(34xx)
          type: 'Holiday',
          holiday: true,
          backgroundColor: 'None',
        });
      }
    }
  });
  return result4;
};
//-----------------------------------------------------
//春分の日3月、秋分の日9月について
// 10: 'n', 11: '3', 12: '12', 13: '春分の日', 14: '300'
// 10: 'm', 11: '9', 12: '12', 13: '秋分の日', 14: '300'
//-----------------------------------------------------
const getSpringAtumday = (resultYear: number) => {
  const dtNum = calc.sprinAutomDay(resultYear);
  let text1 = String(dtNum[0]) + ',3,12,春分の日,301\n';
  text1 = text1 + String(dtNum[1]) + ',9,12,秋分の日,301';
  const resultObj = calc.stringToObjectArray(text1);
  // console.log(dtNum, resultObj);
  return resultObj;
};
