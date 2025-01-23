// import * as calc from "CalenderLib";

//----------------------------------------------------------
// Dateオブジェクトを「YYYY-MM-DD」に整形する
// ISO: 2022-05-04T15:00:00.000Z <- 協定世界時で出力ので
// OFFSET -540分*60000 で予めずらす と00:00:00になる
// new Date('2024.7.21 13:00:04')Zを削除 return 13:00:04.000Z
// const value = calc.getFormatDateTime(new Date("2024/08/22"))-->"2024-08-22"
//----------------------------------------------------------
export const getFormatDateTime = (date: Date, time: number = 0) => {
  const result = new Date(date.getTime() )//- date.getTimezoneOffset() * 60000)
    .toISOString()
    .split('T')[time];
  return result
};

//---------------------------------------------------------------
// 2つの日付(new Date)の間にある全ての日付を配列として取得しています。
// 返値：[“2023-09-01”, ..."endDate"]
//---------------------------------------------------------------
export const getDatesBetween = (startDate: Date, endDate: Date): Date[] => {
  const dates: Date[] = [];
  // const currentDate = new Date(startDate);
  // const currentDate = stringToDate(getFormatDateTime(startDate));
  const currentDate = stringToDate(getDateWithString(startDate));
  while (currentDate <= endDate) {
    //console.log(currentDate)
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};
//--------------------------------------------
// 日付("2024-5-1")を("2024/05/01")に変換する
// Date() --> "yyyy/mm/dd"
//--------------------------------------------
export const getDateWithString = (dateString1: Date, dd: boolean = true) => {
  const dt = dateString1;
  let result = '';
  if (dd) {
    result = dt.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } else {
    const y = dt.getFullYear();
    const m = ('00' + (dt.getMonth() + 1)).slice(-2);
    const d = ('00' + dt.getDate()).slice(-2);
    result = y + '/' + m + '/' + d;
  }

  return result;
};

export const stringToDate = (dateString1, pulas = 0) => {
  const dt = '' !== dateString1 ? new Date(dateString1) : new Date();
  dt.setDate(dt.getDate() + pulas);
  // console.log('dt', dateString1, dt);
  return dt;
};
export const numberStringToArray = (num) => {
  //String型に変換
  const stringNum = String(num).replace(/[^\d]/g, ''); //数字のみ
  const result: number[] = [];
  for (let i = 0; i < stringNum.length; i++) {
    result.push(parseInt(stringNum[i]));
  }
  return result;
};
//getNthWeekday
export const getSpecificDayDate = (
  tDay: number, //曜日コード
  sWeek: number = 1, //週番号
  dateString1: string = '',
) => {
  const date1 = stringToDate(dateString1);
  date1.setDate(1); //1日
  const day1 = date1.getDay(); //1日の曜日
  //1月第2月曜日=(週番号)*7 + (7+曜日コード - 月初の曜日コード) % 7 - 6
  const dd = sWeek * 7 + ((7 + tDay - day1) % 7) - 6;
  console.log(dd)
  const sDate = new Date(date1.getFullYear(), date1.getMonth(), dd);
  return sDate;
};

const callCalc401 = (weekdays, weeks, strDate1) => {
  const date100: Date[] = [];
  numberStringToArray(weeks).forEach((week) => {
    numberStringToArray(weekdays).forEach((weekday) => {
      console.log('day401', weekday, '曜日', week, '週', strDate1);
      const date00 = getSpecificDayDate(weekday, week, strDate1);
      console.log('date00', date00.toLocaleDateString());
      date100.push(date00);
      // const jc = date00.toLocaleString(locale, options1);
    });
  });
  return date100;
};
const res = callCalc401(3, -2, '2024/04/16');
// 第一引数に5（金曜日）、第二引数に1（1週間後）を指定します
//const res1 = getSpecificDayDate(0, 3, '2024/6/16');
console.log(res[0].toLocaleDateString(), new Date().getDay());
// const da5 = getDatesBetween(new Date("2024/9/1"),res[0]);
// console.log(da5[0].toLocaleDateString());
// console.log(da5[da5.length - 1].toLocaleDateString(), da5.length);
// console.log(getFormatDateTime(new Date("2024/9/16 0:00")));
console.log('numberStringToArray:', numberStringToArray("-12-34"));
console.log('getSpecificDayDate', getSpecificDayDate(3,0,"2024/04/11").toLocaleDateString())