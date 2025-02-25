// #拡張形式１（日,始年月,加算月,拡張内容,休平日+300+振替コード,種別色,終年,除外年01,除外年02,除外年03,）
// 日、回数、年月で日付（）を返す
// 毎年6月末から1か月間隔ごとに 10回
// 31,1006,1,国民健康保険料(第%-N/10期),310,3
// 毎年5月末から2か月間隔ごとに 4回
// 31,405,2,固定資産税(第%-N/4期),310,3
// 毎年1月2日から2日間
// 202, 1, 0, 正月, 302, 1;
// 毎年6月13日 2015年から数えて
// 13,201506,,プリン誕生日(%N),300,120,200601,1,AEONリボ変更締日,300,4
// 24,201808,1,TS3ROOMYリボ変更締日,300,4
// 17,202004,1,LINECardリボ変更締日,300,4

import * as CallLib from './CalenderLib';
import { Result1 } from '@/pages/Holiday2';

// export type EventType = {
//   type: number;
//   date: Date[];
//   data010: number;
//   [lang: string]: number | Date[];
// };
// 日にち、回数月or始まり年月、数か月、で日付（）を返す
// CalledCalc300(data[10], data[11], Number(data[12]))
const debug9 = false;
export const CalledCalc300 = (
  cDayDate: number | string = 31, //日にち
  cCounts: number | string = 10, //始まり年月、回数月
  monthly: number = 1, //か月毎 Number(data[12])
  calendarDate: Date = new Date(), //カレンダー日付
  flag: boolean = false, //月末:True or Auto 31:True
  endOfDurationDate: string = '', //年末 and flag=true
) => {
  //
  const lastDate = structuredClone(calendarDate);
  const [num9, year9, month] = CallLib.getNamYearMonth(cCounts);
  // 1カ月ごと、始まり年以上、繰り返し１回以下の場合1月からに変更する
  const month99 =
    monthly === 1 && lastDate.getFullYear() > year9 && num9 <= 1 ? 1 : month;
  //
  cDayDate = Number(String(cDayDate).replace(/[^\d]/g, '')); //数字のみ
  let repeat = parseInt(String(cDayDate / 100)); //繰り返し回数
  cDayDate = cDayDate % 100; //日にち
  if (cDayDate == 31) {
    if (month == 2 || month == 4 || month == 6 || month == 9 || month == 11) {
      cDayDate = month == 2 ? 28 : 30;
    }
    flag = true; //月末(cDayDate=31を指定したとき)
  }
  lastDate.setMonth(month99 - 1, Number(cDayDate)); //任意
  const date31 = CallLib.stringToDate(lastDate.toString());
  year9 != 0 ? date31.setFullYear(year9) : '';
  const strDate31 = date31.toString();
  //-------------------
  //-------------------
  let result: Result1 = {
    type: 300,
    date: [],
    data010: 0,
  };

  //----------------------
  monthly = monthly ? monthly : 12; //monthly==0:->12
  repeat = repeat <= 0 ? 1 : repeat;

  debug9 && console.log('F300Start----------', lastDate.toLocaleDateString());
  debug9 && console.log('result_YNMm9', year9, num9, month, '月', month99);
  //31,1006,1,国民健康保険料(第%-N/10期),310,3 :result_YNM9_Mly 0 10 6 _ 1
  const num99 =
    year9 === 0 && num9 === 1 && monthly !== 12 ? 12 / monthly : num9;
  debug9 && console.log('monthly,num99', monthly, 'カ月', num99, '回数');

  //15,11,,七五三,300,1
  //5,1,2,NHK支払(%-M-%M月分),310,3
  //F304--------------202, 1, 0, 正月, 302, 1;
  if (repeat > 1) result = callCalc304(repeat, strDate31);
  else {
    if (year9 && monthly == 12) {
      //F303-------------------
      //始まり年あり,12ヶ月ごと
      const endOfMonth =
        endOfDurationDate === ''
          ? getEndOfYear(lastDate) //年末(default)
          : getAddMonthDate(new Date(endOfDurationDate)); //月末
      result = callCalc303(strDate31, endOfMonth, lastDate); //年齢
      debug9 &&
        console.log(
          '年齢',
          date31.toLocaleDateString(),
          endOfMonth.toLocaleDateString(),
          lastDate.toLocaleDateString(),
          result,
        );
    } else {
      //F302----num99回繰り返す:data010は年越え有回数
      //20,200601,1,AEONリボ変更締日,300,4
      // 5,1,2,NHK支払(%-M-%M月分),310,3 :num0->12,monthly2
      // 31,405,2,固定資産税(第%-N/4期),310,3 :num4,monthly2
      // 31,1006,1,国民健康保険料(第%-N/10期),310,3 :num10,monthly1
      result = callCalc302(
        num99,
        monthly,
        flag, //true:月末(cDayDate=31を指定したとき)
        getAddDayDate(lastDate, 0), //日付DeepCopy
      ); //年数計算[年越え]
    }
  }
  debug9 && console.log('F300_result', result);
  return result;
};

//-----------------------
//strDate1 からN回数、Mか月ごとで日付date[]を返す
//callCalc301(5,"2024/9/10",2)//9/10から2か月ごと５回の日付[]を返す
//callCalc301(5,"2024/9/10",2,true)//9/末日から2か月ごと５回の日付[]を返す
// array[2024/9/x,2024/11/x,2025/01/x,2025/03/x,2025/05/x]
//-----------------------
const callCalc301 = (
  cCounts: string | number,
  strDate1: string,
  monthly: number = 1,
  flag: boolean = false, //月末指定=flag(true)
) => {
  const date100: Date[] = [];
  const num9 = Number(String(cCounts).replace(/[^\d]/g, '')); //数字のみ
  const dateStart = new Date(strDate1);

  const copiedDate = new Date(dateStart.getTime());
  const copiedDate2 = new Date(copiedDate.getTime());
  let date34 = new Date();
  for (let i = 0; i < num9; i++) {
    //回数
    if (flag) {
      //月末
      date34 = getAddMonthDate(copiedDate2, 1 + monthly * i);
    } else {
      date34 = getAddDayDate(copiedDate2, 0, monthly * i);
    }
    date100.push(new Date(date34.getTime()));
  }
  return date100;
};

//------------------------------------------
// 31,405,2,固定資産税(第%-N/4期),310,3 :num4,monthly2
// 31,1006,1,国民健康保険料(第%-N/10期),310,3
// 20,200601,1,AEONリボ変更締日,300,4
//------------------------------------------
const callCalc302 = (
  num9: number, //1006=>10回
  monthly: number, //1カ月
  flag: boolean,
  lastDate: Date = new Date(),
) => {
  const result: Result1 = {
    type: 302,
    date: [],
    data010: 0,
  };
  //年超えCheck yy
  const checkOverYear =
    getAddDayDate(
      lastDate,
      0,
      monthly === 12 ? 0 : monthly * num9 - 1,
    ).getFullYear() - lastDate.getFullYear();
  //
  num9 = num9 < 1 ? 12 : num9; //num9<1:->12回
  debug9 &&
    console.log('F302_', monthly, 'kagrtu', num9, 'kai', checkOverYear, 'CKO');
  const yearDiffOrigin = lastDate.getFullYear();
  //-----------繰り返し（前年＋今年）-----------------------------
  for (let i = checkOverYear > 0 ? -1 : 0; i < 1; i++) {
    const yearDifference = yearDiffOrigin + i;
    const dateDifference = new Date(lastDate.setFullYear(yearDifference));
    const strDate31 = dateDifference.toString();
    //strDate31:"Sun Jun 30 2024 17:17:18 GMT+0900 (日本標準時)"
    //strDate31 からN回数、Mか月ごとで日付[]を返す
    // result.date = callCalc301(num9, strDate31, monthly, flag);
    result.date = result.date.concat(
      callCalc301(num9, strDate31, monthly, flag),
    );
  }
  //---------------------------------------------------------------
  //年数計算[年越えあるか]data010=Array[last]-Array[0]
  result.data010 =
    result.date.slice(-1)[0].getFullYear() - result.date[0].getFullYear();
  return result;
};
//------------------------------------------
// 13,201506,,プリン誕生日(%N),300,1
//------------------------------------------
const callCalc303 = (strDate31: string, endOfMonth: Date, lastDate: Date) => {
  const result: Result1 = {
    type: 300,
    date: [],
    data010: 0, //年齢
  }; //strDate31:"Thu Oct 22 2009 17:19:59 GMT+0900 (日本標準時)"
  result.data010 = CallLib.getDateDiff(strDate31, endOfMonth.toString(), false);
  result.date.push(lastDate);
  // result.date.push(endOfMonth);
  result.type = 303;
  return result;
};

//------------------------------------------
// 年月日（回数）で日付[]を返す
// 202, 1, 0, 正月, 302, 1;
//------------------------------------------
const callCalc304 = (cCounts: string | number, strDate1: string) => {
  const num9 = Number(String(cCounts).replace(/[^\d]/g, '')); //数字のみ
  const dateStart = new Date(strDate1);
  const result: Result1 = {
    type: 300,
    date: [],
    data010: 0,
  };
  for (let i = 0; i < num9; i++) {
    //回数
    const date34 = getAddDayDate(dateStart, i);
    result.date.push(new Date(date34.getTime()));
    result.type = 304;
    result.data010 = num9;
  }
  return result;
};
// 月末 毎回新しいインスタンスが生成されます
// const getLastDate = (date: Date) => {
//   return new Date(date.getFullYear(), date.getMonth() + 1, 0);
// };

// 月初め 毎回新しいインスタンスが生成されます
// const getFirstDate = (date: Date) => {
//   return new Date(date.getFullYear(), date.getMonth(), 1);
// };

// 加減算(default 1:今月末,2:翌月末,0:先月)
// 毎回新しいインスタンスが生成されます;
// const endOfMonth = getAddMonthDate(new Date());
const getAddMonthDate = (
  date: Date,
  monthTerm: number = 1,
  yearTerm: number = 0,
) => {
  return new Date(
    date.getFullYear() + yearTerm,
    date.getMonth() + monthTerm,
    0,
  );
};
const getEndOfYear = (date: Date, yearTerm: number = 1) => {
  return new Date(date.getFullYear() + yearTerm, 0, 0);
};
// 加減算日付 addNum:日にち monthTerm:月数
// 毎回新しいインスタンスが生成されます
const getAddDayDate = (
  date: Date,
  addNum: number = 0,
  monthTerm: number = 0,
) => {
  return new Date(
    date.getFullYear(),
    date.getMonth() + monthTerm,
    date.getDate() + addNum,
  );
};
