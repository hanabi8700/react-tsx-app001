//-----------------------------------
// 日付("2024-5-16")+plusをDate変換される
//-----------------------------------
export const stringToDate = (dateString1: string, pulas: number = 0): Date => {
  const dt = '' !== dateString1 ? new Date(dateString1) : new Date();
  dt.setDate(dt.getDate() + pulas);
  return dt;
};
//------------------------------------------------------------
// 年月の指定した曜日の日付を取得する関数
// 1月第2月曜日の日付を取得する場合は、
// 第一引数に1（月曜日）、第二引数に2（第2）を指定します[第2月曜日]
// const res1 = getSpecificDayDate(1, 2, '2024/01/01');
// console.log(res1.toLocaleDateString())  //2024/01/8
//------------------------------------------------------------
export const getSpecificDayDate = (
  tDay: number, //祝日の曜日コード
  sWeek: number = 1, //週番号
  dateString1: string = '',
) => {
  const date1 = stringToDate(dateString1);
  date1.setDate(1); //1日
  const day1 = date1.getDay(); //1日の曜日
  //1月第2月曜日=(祝日の週番号)*7 + (7+祝日の曜日コード - 月初の曜日コード) % 7 - 6
  const dd = sWeek * 7 + ((7 + tDay - day1) % 7) - 6;
  const sDate = new Date(date1.getFullYear(), date1.getMonth(), dd);
  return sDate;
};

//------------------------------
// "1234"->[1,2,3,4]に変換する
//------------------------------
export const numberStringToArray = (num: string | number): number[] => {
  //String型に変換
  const stringNum = String(num).replace(/[^\d]/g, ''); //数字のみ
  const result: number[] = [];
  for (let i = 0; i < stringNum.length; i++) {
    result.push(parseInt(stringNum[i]));
  }
  return result;
};
//---------------------------------
// 2024年06月21日->20240621->Date()
// 省略：今日、最低４桁必要だとgetNumDate(2024)
//---------------------------------
export const get8NumToDate = (dateString: string | number) => {
  // const date1 = stringToDate(String(dateString));
  const dateString2 = String(dateString).replace(/[^\d]/g, ''); //数字のみ
  const dl = dateString2.length;
  let a, b, c, c1, b1;
  if (dl === 4) {
    a = Number(dateString2.slice(0, 4));
    b = 1;
    c = 0;
    b1 = 1;
    c1 = 1;
  } else if (dl > 4 && dl <= 6) {
    a = Number(dateString2.slice(0, 4));
    b = Number(dateString2.slice(4, 6));
    c = Number(dateString2.slice(6));
    b1 = 1;
    c1 = 1;
  } else if (dl > 6) {
    a = Number(dateString2.slice(0, 4));
    b = Number(dateString2.slice(4, 6));
    c = Number(dateString2.slice(6));
    b1 = 1;
    c1 = 0;
  } else {
    a = new Date().getFullYear();
    b = Number(dateString2.slice(-2));
    c = 0;
    b1 = 1;
    c1 = 1;
  }
  const dt = new Date(a, b - b1, c + c1, 0, 0, 0);
  // console.log(dl, a, b, c, dt);
  return dt;
};

export type Result1 = {
  type: number;
  date: Date[];
  data010: number;
};
const debug9 = true;
//------------------------------------
// 週、始まり年月、曜日、
// CalledCalc400(2,"200001",2,new Date("1973/4/1")) // [1973-01-08]
// CalledCalc400(2,"200001",2,new Date("1973/4/1"),true) // [1973-01-08]
//------------------------------------
export const CalledCalc400 = (
  cWeeks: number | string = 23, //週間
  date: string = '', //始まり年月
  cWeekdays: number | string = 23, //曜日
  calendarDate: Date = new Date(), //
  flag: boolean = false, //true:1日
) => {
  const date1 = date.toString().padStart(2, '0').slice(-2); //Get Month
  const firstDate = get8NumToDate(date1);
  console.log('firstDate', firstDate.toLocaleDateString());
  firstDate.setFullYear(calendarDate.getFullYear());
  debug9 &&
    console.log('firstDate:', date1, '月', firstDate.toLocaleDateString());
  flag ? firstDate.setMonth(firstDate.getMonth(), 1) : '';
  const strDate1 = firstDate.toLocaleDateString();
  const weekdays = cWeekdays; //曜日
  const weeks = cWeeks; //週
  const result: Result1 = {
    type: 400,
    date: [],
    data010: 0,
  };
  result.date = callCalc401(weekdays, weeks, strDate1);
  return result;
};

// 曜日、週、年月で日付（）を返す
// 13,0,2,缶瓶収集日,400,3  #第13週毎月、火曜日
// 7,0,36,ごみ収集日,400,3  #毎週毎月、水土曜日
const callCalc401 = (
  weekdays: string | number,
  weeks: string | number,
  strDate1: string,
) => {
  const date100: Date[] = [];
  numberStringToArray(weeks).forEach((week) => {
    numberStringToArray(weekdays).forEach((weekday) => {
      debug9 && console.log('day401', weekday, '曜日', week, '週', strDate1);
      const date00 = getSpecificDayDate(weekday, week, strDate1);
      debug9 && console.log('date00', date00.toLocaleDateString());
      date100.push(date00);
      // const jc = date00.toLocaleString(locale, options1);
    });
  });
  return date100;
};

const cWeeks = 2;
const date = '200001';
const cWeekdays = 1;
const calendarDate = new Date('1973/4/20');

console.log('C400', CalledCalc400(cWeeks, date, cWeekdays, calendarDate));
// const date1 = date.toString().padStart(2, "0").slice(-2);
// console.log(date1, get8NumToDate(date1));