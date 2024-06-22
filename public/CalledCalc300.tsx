// 日、回数、年月で日付（）を返す
// 毎年6月末から1か月間隔ごとに 10回
// 31,1006,1,国民健康保険料(第%-N/10期),310,3
// 毎年5月末から2か月間隔ごとに 4回
// 31,405,2,固定資産税(第%-N/4期),310,3
// 毎年1月2日から2日間
// 202, 1, 0, 正月, 302, 1;
// 毎年6月13日 2015年から数えて
// 13,201506,,プリン誕生日(%N),300,1

import * as CallLib from './CalenderLib';

// export type EventType = {
//   type: number;
//   date: Date[];
//   data010: number;
//   [lang: string]: number | Date[];
// };

// 日にち、回数月、始まり年月、数か月、で日付（）を返す
export const CalledCalc300 = (
  cDayDate: number | string = 31, //日にち
  cCounts: number | string = 10, //始まり年月、回数月
  monthly: number = 1, //か月毎
  flag: boolean = false, //月末:True or Auto 31:True
  endOfDurationDate: string = '', //年末 and flag=true
) => {
  let num9 = Number(String(cCounts).replace(/[^\d]/g, '')); //数字のみ
  let year9 = 0;
  const lastDate = new Date();
  //----------------------------
  let month = num9 % 100;
  month = month == 0 ? lastDate.getMonth() + 1 : month;
  num9 = parseInt(String(num9 / 100)); //回数or年数
  num9 >= 100
    ? ((year9 = num9), (num9 = 0))
    : (num9 = num9 % 100 == 0 ? 1 : num9 % 100);
  //[31, 1006]  or [22, 200910]
  //num9=10,year9=0,month=6  or  num9=0,year9=2009,month=10
  //---------------------
  cDayDate = Number(String(cDayDate).replace(/[^\d]/g, '')); //数字のみ
  let repeat = parseInt(String(cDayDate / 100));
  cDayDate = cDayDate % 100;
  if (cDayDate == 31) {
    if (month == 2 || month == 4 || month == 6 || month == 9 || month == 11) {
      cDayDate = month == 2 ? 28 : 30;
    }
    flag = true; //月末
  }
  lastDate.setMonth(month - 1, Number(cDayDate)); //任意
  year9 != 0 ? lastDate.setFullYear(year9) : '';
  const strDate31 = lastDate.toString();
  //-------------------
  //-------------------
  let result: CallLib.EventType = {
    type: 300,
    date: [],
    data010: 0, //年齢
  };

  //----------------------
  repeat = repeat <= 0 ? 1 : repeat;
  if (repeat > 1) result = callCalc304(repeat, strDate31);
  else {
    if (year9) {
      const endOfMonth =
        endOfDurationDate === ''
          ? getEndOfYear(new Date()) //年末
          : getAddMonthDate(new Date(endOfDurationDate)); //月末
      result = callCalc303(strDate31, endOfMonth, lastDate);
    } else {
      result = callCalc302(
        num9,
        monthly,
        flag,
        getAddDayDate(lastDate, 0),
        endOfDurationDate,
      );
    }
  }
  return result;
};
//
//回数、年月で日付[]を返す
const callCalc301 = (
  cCounts: string | number,
  strDate1: string,
  monthly: number = 1,
  flag: boolean = false, //月末指定?
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

//
// 31,1006,1,国民健康保険料(第%-N/10期),310,3
const callCalc302 = (
  num9: number,
  monthly: number,
  flag: boolean,
  lastDate: Date = new Date(),
  yearAdd: string = '0',
) => {
  const result: CallLib.EventType = {
    type: 302,
    date: [],
    data010: 0, //年齢
  };
  const yearDifference = lastDate.getFullYear() + Number(yearAdd);
  // Number(yearAdd == '' ? 0 : yearAdd);
  const dateDifference = new Date(lastDate.setFullYear(yearDifference));
  const strDate31 = dateDifference.toString();
  //strDate31:"Sun Jun 30 2024 17:17:18 GMT+0900 (日本標準時)"
  result.date = callCalc301(num9, strDate31, monthly, flag);
  //年数計算[年越え]
  result.data010 =
    result.date.slice(-1)[0].getFullYear() - result.date[0].getFullYear();
  return result;
};
//
//13,201506,,プリン誕生日(%N),300,1
const callCalc303 = (strDate31: string, endOfMonth: Date, lastDate: Date) => {
  const result: CallLib.EventType = {
    type: 300,
    date: [],
    data010: 0, //年齢
  }; //strDate31:"Thu Oct 22 2009 17:19:59 GMT+0900 (日本標準時)"
  result.data010 = CallLib.getDateDiff(strDate31, endOfMonth.toString(), 0);
  result.date.push(lastDate);
  result.date.push(endOfMonth);
  result.type = 303;
  return result;
};

//
// 年月日（回数）で日付[]を返す //202, 1, 0, 正月, 302, 1;
const callCalc304 = (cCounts: string | number, strDate1: string) => {
  const num9 = Number(String(cCounts).replace(/[^\d]/g, '')); //数字のみ
  const dateStart = new Date(strDate1);
  const result: CallLib.EventType = {
    type: 300,
    date: [],
    data010: 0, //年齢
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
