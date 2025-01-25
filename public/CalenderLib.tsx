// import React from 'react';
//
// yyyy-mm-dd 形式が協定世界時 (UTC) と認識される
// date = new Date('2022-05-05');
// console.log(date.toLocaleString()); // 2022/5/5 9:00:00
// console.log(date.toISOString()); // 2022-05-05T00:00:00.000Z
// get current date
// const date = new Date();

// get current month
// const currentMonth = date.getMonth();

// get current year
// const currentYear = date.getFullYear();

// 7日後の日付を計算
// const sevenDaysLater = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000);

export interface ObjectLiteralLike0 {
  today: Date;
  date: Date; //指定の日付
  currentMonth: number; //指定の日付の月
  currentYear: number; //指定の日付の年
  firstDate: Date; //月始めのDate
  lastDate: Date; //月末のDate
  firstDateStr?: string; //月初String1day
  lastDayIndex?: number; //月末の曜日GetDay
  lastDayDate?: number; //月末の日にちGetDate
  prevLastDate?: Date; //先月末日のDate
  prevLastDayDate?: number; //先月末日の日にちGetDate
  prevDateLastWeek?: Date; //date月初の週の日曜日の日付
  nextDateFirstWeek?: Date; //date月末の週の土曜日の日付
  // [x: string]: string | number | Date;
}
export type EventType = {
  type: number;
  date: Date[];
  data010: number;
  [x: string]: number | Date[];
};

//****************************************************
// CalenderLib() or CalenderLib("2024/04/01",14)14dys=2weeks
export const CalenderLib = (dateString1: string = '', nextDateWeeks = 0) => {
  // get prev month current month and next month days
  // get current date
  const date = stringToDate(dateString1);
  date.setDate(1); //今年月1日
  // const date = initDate();//今年月1日
  // get current month
  const currentMonth = date.getMonth();

  // get current year
  const currentYear = date.getFullYear();
  const dateStructure: ObjectLiteralLike0 = {
    today: new Date(),
    date: date,
    currentMonth: currentMonth + 1,
    currentYear: currentYear,
    firstDate: new Date(currentYear, currentMonth, 1),
    lastDate: new Date(currentYear, currentMonth + 1, 0),
  };
  dateStructure.firstDateStr = getDateWithString(dateStructure.firstDate);
  // getDay():曜日を0から6の整数で取得する;
  dateStructure.lastDayIndex = dateStructure.lastDate.getDay();
  // getDate():日を1から31の整数で取得する;
  dateStructure.lastDayDate = dateStructure.lastDate.getDate();
  dateStructure.prevLastDate = new Date(currentYear, currentMonth, 0);
  dateStructure.prevLastDayDate = dateStructure.prevLastDate.getDate();
  dateStructure.prevDateLastWeek = new Date(
    dateStructure.firstDate.getTime() -
      dateStructure.firstDate.getDay() * 24 * 60 * 60 * 1000,
  );
  dateStructure.nextDateFirstWeek = new Date(
    dateStructure.lastDate.getTime() +
      (nextDateWeeks + 7 - dateStructure.lastDate.getDay() - 1) * 86400 * 1000,
  );

  // dateStructure.prevLastDayDate - dateStructure.prevLastDate.getDay();
  // setDate():日を設定する;1から31までの整数値
  // date.setDate(1);
  // update current year and month in header
  // month.innerHTML = `${months[currentMonth]} ${currentYear}`;
  // prev days html
  // for (let x = firstDay.getDay(); x > 0; x--) {
  //   // days += `<div class="day prev">${prevLastDayDate - x + 1}</div>`;
  // }
  return dateStructure;
};
// export const CalenderLib;
// type ArrayObjectLike = {
//   0: string;
//   1: string;
//   [num: number]: string;
// };
type ObjectLiteralLike = {
  // ja: string[];
  // en: string[];
  [x: string]: string[];
};
// {属性名: 属性値}の形式のオブジェクト
// type Props = {
//   date: Date | number | null;
//   lang: string | undefined;
// };
// type holidayList = {
//   [x: string]: {
//     date: string;
//   };
// };

//-----------------------------------
//和暦表示date
//-----------------------------------
export const WarekiDateString = (date: Date) => {
  const options1: { [index: string]: string } = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  };
  const locale = 'ja-JP-u-ca-japanese';
  return date.toLocaleString(locale, options1);
};
//和暦（Japanese Calendar）
export const JapaneseCalendar = (date: Date) => {
  return new Intl.DateTimeFormat('ja-JP-u-ca-japanese', {
    year: 'numeric',
  }).format(date);
};

//-----------------------------------------
// 曜日を求める関数;
// 第一引数(date)
// Dateオブジェクト、または0～6の整数を入力します。
// 省略または空白にすると配列を求めます。
// ----------
// 第二引数(lang)
// jaまたはenを入力します。
// 省略または空白にするとja形式で出力されます
//-------------------------------------------
export const getWeekday = (
  date: Date | number | null = 7,
  lang: string | undefined = 'ja',
): string | string[] => {
  const list: ObjectLiteralLike = {
    ja: ['日', '月', '火', '水', '木', '金', '土'],
    en: ['Sun', 'Mon', 'Tue', 'Wed', 'The', 'Fri', 'Sat'],
  };

  //dateチェック
  if (date == undefined) {
    date = new Date().getDay();
  } else if (date.constructor.name === 'Date') {
    date = (date as Date).getDay();
  } else if (!Number.isInteger(date)) {
    return '第一引数が不正です。';
  } else if ((date as number) < 0 || (date as number) > 7) {
    return '第一引数が不正です。Number';
  } else {
    date = Number(date);
  }

  //langチェック
  // if (lang == undefined || lang === '') {
  //   lang = 'ja';
  // } else if (lang != 'ja' && lang != 'en') {
  //   return '第二引数が不正です。';
  // }

  return date === 7 ? list[lang] : list[lang][date];
};
//-----------------------------------------------------
//春分の日3月、秋分の日9月を求める １９８０年以降 配列で返す
// 1979年までは、春分の日は 1960, 1968, 1972, 1976年が3月20日、他は3月21日になります。
// また、秋分の日は 1951, 1955, 1959, 1963, 1967, 1971, 1975, 1979年が9月24日、
// 他は9月23日になります。
//-----------------------------------------------------
export const sprinAutomDay = (year: number = 2024) => {
  const day1Syubun9 = Math.floor(
    23.2488 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4),
  );
  const day2Synbun3 = Math.floor(
    20.8431 + 0.242194 * (year - 1980) - Math.floor((year - 1980) / 4),
  );
  const sup20 = [1960, 1968, 1972, 1976];
  // const sup21 = [];
  const atm24 = [1951, 1955, 1959, 1963, 1967, 1971, 1975, 1979];
  // const atm23 = [];
  const springDay = sup20.indexOf(year) > -1 ? 20 : 21;
  const autumnDay = atm24.indexOf(year) > -1 ? 24 : 23;
  const ap =
    year >= 1980
      ? Array.from([day2Synbun3, day1Syubun9])
      : year >= 1950
        ? [springDay, autumnDay]
        : [0, 0];
  return ap;
};

//------------------------------------------------------------
// 指定年月の第○番目の○曜日の日付を返します。関数 getNthWeekday
// 曜日を0（日曜）から6（土曜）の数値で指定します。
// 週番号（第○週目）を指定します。1からN
// 日付文字列"2025/01/06"
// 1月第2月曜日の日付を取得する場合は、
// 第一引数に1（月曜日）、第二引数に2（第2）を指定します[第2月曜日]
// const res1 = getSpecificDayDate(1, 2, '2024/01/01');
// console.log(res1.toLocaleDateString())  //2024/01/8
//------------------------------------------------------------
export const getSpecificDayDate = (
  tDay: number, //曜日コード0-6
  sWeek: number = 1, //週番号
  dateString1: string = '',
) => {
  const date1 = stringToDate(dateString1);
  date1.setDate(1); //1日
  const day1 = date1.getDay(); //1日の曜日
  //1月第2月曜日=(週番号)*7 + (7+曜日コード - 月初の曜日コード) % 7 - 6
  const dd = sWeek * 7 + ((7 + tDay - day1) % 7) - 6;
  const sDate = new Date(date1.getFullYear(), date1.getMonth(), dd);
  return sDate;
};

export const getSpecificDayDate2 = (
  tDay: number,
  sWeek: number = 1,
  dateString1: string = '',
) => {
  const date2 = stringToDate(dateString1);
  const date1 = stringToDate(dateString1);
  date1.setDate(1); //1日
  const day1 = date1.getDay(); //1日の曜日
  // console.log(date1.toLocaleDateString(), day1);
  tDay %= 7;
  const a2 = 7 - (day1 - tDay); //指定曜日<月初め曜日
  const a3 = tDay - day1; //月初め曜日<指定曜日
  const a0 = tDay === day1 ? 0 : tDay < day1 ? a2 : a3; //月初め曜日==指定曜日
  date2.setDate(1 + a0);
  const firstWeekDate = date2.getDate(); //月初め指定曜日の日にち
  const sDate = new Date(
    date1.getFullYear(),
    date1.getMonth(),
    firstWeekDate + 7 * (sWeek - 1),
  );
  // console.log(firstWeekDate, 'day', a0, day1, tDay, sDate.toLocaleDateString());
  return sDate;
};
//// 年月の指定した曜日の日付を取得する関数
// 来週の金曜日の日付を取得する場合は、(今週:0)
// 第一引数に1（月曜日）、第二引数に2（第2週）を指定します[第2週月曜日]
// const res1 = getSpecificDayDate(1, 2, '2024/10/1');
// console.log(res1.toLocaleDateString())  //2024/10/14
export const getSpecificDayDate3 = (
  targetDay: number,
  offsetWeek: number = 0,
  dateString1: string = '',
): Date => {
  const currentDate = stringToDate(dateString1);
  // const currentDate = new Date();
  const currentDay = currentDate.getDay(); //曜日
  const difference = targetDay - currentDay + offsetWeek * 7;
  currentDate.setDate(currentDate.getDate() + difference);
  return currentDate;
};

//---------------------------------------------------------------
// 2つの日付(new Date)の間にある全ての日付を配列として取得しています。
// 返値：[“2023-09-01”, ...endDate]
//---------------------------------------------------------------
export const getDatesBetween = (startDate: Date, endDate: Date): Date[] => {
  const dates: Date[] = [];
  // const currentDate = new Date(startDate);
  const currentDate = stringToDate(getDateWithString(startDate));
  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
};

//-------------------------------------------------------------------------
// 日付(new Date)を渡すと、その日付がその月の第何週目に当たるかを返してくれる関数
//-------------------------------------------------------------------------
export const getWeekIndex = (date: Date): number => {
  const week = 7; // 1週間は7日
  const sunday = date.getDate() - date.getDay();
  const nextSaturday = sunday + 6;
  const targetDay = nextSaturday + 6;
  const weekIndex = Math.floor(targetDay / week);
  return weekIndex;
};

//-----------------------------------------------------------
// 二つの日付("2024/5/1","2024,5,5")の差分を日数で返す
// 初日は含まない   dateFlag=false : 年齢, (default)true: 日数
//-----------------------------------------------------------
export const getDateDiff = (
  dateString1: string, //base
  dateString2: string,
  dateFlag: boolean = true,
) => {
  const date1 = new Date(dateString1);
  const date2 = new Date(dateString2);
  // 2つの日付の差分（ミリ秒）を計算
  const msDiff = date2.getTime() - date1.getTime();
  // 求めた差分（ミリ秒）を日付に変換
  // 差分÷(1000ミリ秒×60秒×60分×24時間)
  // ceil()「0.01」のように微細な値でも切り上げとなります。
  // またマイナスの値はゼロ方向に切り上げとなることに注意しましょう。
  //const diff1 = Math.floor(msDiff / 1000); //DiffTime
  const diff2 = Math.floor(msDiff / 864e5); //DiffDate
  // const diff3 = diff1 - 86400 * diff2;
  const leap = countLeapYear(date1.getFullYear(), date2.getFullYear());
  const diff4 = Math.floor((diff2 - leap * 366) / 365) + leap; //DiffYear
  return dateFlag ? diff2 : diff4;
};

//-----------------------------------
// 日付("2024-5-16")+plusをDate変換される
//-----------------------------------
export const stringToDate = (dateString1: string, pulas: number = 0): Date => {
  const dt = '' !== dateString1 ? new Date(dateString1) : new Date();
  dt.setDate(dt.getDate() + pulas);
  return dt;
};

//------------------------------------
// 日付(Date)+plusでDateを返す(入力日付に影響なし)
// plus=0 で日付コピー
//------------------------------------
export const dtPlus = (dt: Date, pulas: number = 0) => {
  const end = new Date(dt.getTime());
  end.setDate(end.getDate() + pulas);
  return end;
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
// let sec = Math.floor((date3 / 1000) % 60);
// let min = Math.floor((date3 / 1000 / 60) % 60);
// let hour = Math.floor((date3 / 1000 / 60 / 60) % 24);
// let day = Math.floor(date3 / 1000 / 60 / 60 / 24);
//------------------------
// Date() --> "yyyy/mm/dd"
//------------------------
// const getFormatDate = (date: Date) => {
//   const year = date.getFullYear().toString().padStart(4, '0');
//   const month = (date.getMonth() + 1).toString().padStart(2, '0');
//   const day = date.getDate().toString().padStart(2, '0');
//   const result = year + '/' + month + '/' + day;
//   return result;
// };
//-----------------------------------------------------
//数値を固定長文字列へ変換(0埋める) (243,6)->"000243"
//"%0*d" width num
//-----------------------------------------------------
export const leftFillNum = (num: number, targetLength: number): string => {
  return num.toString().padStart(targetLength, '0');
};
//-----------------------------------------------------
//数値を固定長(切り抜き)文字列へ変換(0埋める) (24302,2)->"02"
//-----------------------------------------------------
export const SliceNum = (num: number, targetLength: number): string => {
  return num
    .toString()
    .padStart(targetLength, '0')
    .slice(targetLength * -1);
};
//-----------------------------------------------------
//数値を固定長(切り抜き)文字列へ変換(*埋める) (24302,2)->"***02"
//-----------------------------------------------------
export const Slice3Num = (
  num: number,
  targetLength: number,
  charact = '*',
): string => {
  const len = String(num).length;
  return num
    .toString()
    .slice(targetLength * -1)
    .padStart(len, charact);
};
//---------------------------------
// 2024年06月21日->20240621->Date()
// 省略：今日、最低４桁必要だとgetNumDate(2024)
//---------------------------------
export const get8NumToDate = (dateString: string | number) => {
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

// export const get8NumToDate = (dateString: string | number = '') => {
//   let dateString2 = String(dateString).replace(/[^\d]/g, ''); //数字のみ
//   dateString2 =
//     Number(dateString2) > 12 && Number(dateString2) < 40 ? `0` : dateString2;

//   if (dateString2.length < 4 && dateString2 !== '')
//     dateString2 = ('0000' + dateString2).slice(-4);
//   const dt =
//     dateString2.slice(0, 4) +
//     '/' +
//     dateString2.slice(4, 6) +
//     '/' +
//     dateString2.slice(6);
//   return dateString ? new Date(dt) : new Date();
// };

//-----------------------------------------------
// 二つ年（2000,2024）の間にあるうるう年の回数を返す
//-----------------------------------------------
const isLeapYear = (year: number): boolean =>
  (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
export const countLeapYear = (fromYear: number, toYear: number = fromYear) => {
  //数え上げ
  let count = 0;
  for (let i = fromYear; i <= toYear; i++) if (isLeapYear(i)) count++;
  return count;
};

//----------------------------------------------------------
// Dateオブジェクトを「YYYY-MM-DD」に整形する
// ISO: 2024-09-15T15:00:00.000Z <- 協定世界時で出力なので
// -------//OFFSET -540分*60000 で予めずらす と00:00:00になる
// getFormatDateTimeStr(new Date("2024/9/16 0:00"))---> "2024-09-15"
//----------------------------------------------------------
export const getFormatDateTimeStr = (date: Date, time: number = 0) => {
  return new Date(date.getTime()) //- date.getTimezoneOffset() * 60000)
    .toISOString()
    .split('T')[time];
};
//-----------------------------------------------------
//その月の初日、最終日、先月末、来月始めを配列で返す
//getFirstLastDayOfMouth('2024/02/20')[0] //'2024/2/1'
//-----------------------------------------------------
export const getFirstLastDayOfMouth = (dateString: string | number) => {
  const date = get8NumToDate(dateString);
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  // 来月初めて
  const nextMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    1, //date.getDate(),
  );
  // 先月末
  const lastMonth = new Date(
    date.getFullYear(),
    date.getMonth(), //- 1,
    0, //date.getDate(),
  );
  const lastDayOfMonth = new Date(
    firstDayOfMonth.getFullYear(),
    firstDayOfMonth.getMonth() + 1,
    0, //※次月の0日目＝今月の末日になる
  );
  return [firstDayOfMonth, lastDayOfMonth, lastMonth, nextMonth];
};
//------------------------
// 日付の初期化 1日
// initDate("2024-5-6").toLocaleString() //'2024/5/1 0:00:00'
// initDate("2024-5-6",1,22).toLocaleString()//'2024/5/1 22:00:00'
//------------------------
export const initDate = (dateString1 = '', day = 1, hour = 0, minute = 0) => {
  const dt = '' !== dateString1 ? new Date(dateString1) : new Date();
  dt.setDate(day); //日付の月の日を設定します
  dt.setHours(hour, minute, 0); //日付の時間を設定します。
  return dt;
};
//-----------------------------------------------------
//〇ヶ月前後を選択の際はその値を+-で;月末日取得
// new Date(dt.getFullYear(), dt.getMonth() + 1, 0)//最終日
//console.log('endOfMD', endOfMD(2022,2));//'endOfMD', 28
//console.log('endOfMD', endOfMD(2024,2));//'endOfMD', 29
//console.log('endOfMD', endOfMD(2024,2,-5));//'endOfMD', 30  ,2023/09/30 ,2+(-5)=-3
//-----------------------------------------------------
export const endOfMD = (
  year3: number,
  month3: number,
  monthTerm: number = 0,
) => {
  const endOfMonthDay = (function (paraYear, paraMonth) {
    const tempEndDate = new Date(paraYear, paraMonth, 0); //最終日
    //console.log(tempEndDate, paraYear, paraMonth);
    return tempEndDate.getDate();
  })(year3, month3 + monthTerm);
  return endOfMonthDay;
};
//----------------------------------------------------------
//契約○ヶ月後、○ヶ月前を取得する getAddMonthDate2("2024/05/06", 3)
//"2024/05/06"(月)->monthTerm=3  3カ月後 "2024年08月05日"(月)
//"2024/05/06"(月)->monthTerm=-3 3カ月前 "2024年02月07日"(月)
//なお2月29日の一ヶ月前は1月30日である事には注意
//getAddMonthDate2("2024/05/06", -3,false)//'2024年02月07日'
//console.log(getAddMonthDate2('2023/11/30', 3, false));//'2024年02月29日'
//console.log(getAddMonthDate2('2024/02/29', -1, false));//'2024年01月30日'
//console.log(getAddMonthDate2('2024/05/30', -3, false));//2024年02月29日
//console.log(getAddMonthDate2('2024/05/28', -3, false));//2024年02月29日
//console.log(getAddMonthDate2('2024/05/01', 1, false));//'2024年05月31日'
//console.log(getAddMonthDate2('2024/05/01', 0, false));//'2024年04月30日'XXX
//----------------------------------------------------------
export const getAddMonthDate2 = (
  date3: string,
  monthTerm: number = 1,
  //sameDate = false, //○ヶ月前後の同じ日にちは :1
  getDateMode = true,
) => {
  // 年、月、日をそれぞれ算出
  const year3 = Number(date3.substring(0, 4));
  const month3 = Number(date3.substring(5, 7));
  let day3 = Number(date3.substring(8, 10));
  const endOfMonthDay = endOfMD(year3, month3, monthTerm);
  day3 =
    day3 > endOfMonthDay ? endOfMonthDay : monthTerm >= 0 ? day3 - 1 : day3 + 1;

  const newDate = initDate(); //本月1日

  newDate.setFullYear(year3);
  newDate.setMonth(month3 + monthTerm - 1);
  newDate.setDate(day3);

  const resultYear = newDate.getFullYear();
  const resultMonth = ('00' + (newDate.getMonth() + 1)).slice(-2);
  const resultDay = ('00' + newDate.getDate()).slice(-2);

  const result = getDateMode
    ? newDate
    : resultYear + '年' + resultMonth + '月' + resultDay + '日';
  return result;
};
//-------------------------------------------------------------------------
//具体的計算例 民法第143条第2項（暦による期間の計算）契約
//週の場合は、例えば火曜日に期間が3週間の契約が発効した場合は、
//  期間の満了日は、3週間後の火曜日の前日の月曜日ということになります。
//月の場合は、例えば4月1日に期間が1ヶ月間の契約が発効した場合は、
//  期間の満了日は、1ヶ月後の5月1日の前日の4月30日ということになります。
//ただし、1月30日に1ヶ月間の契約が発効した場合は、2月30日がありませんので、
//  2月28日（閏年の場合は2月29日）が期間の満了日になります。
//年の場合は、例えば平成18年6月1日に期間が2年間の契約が発効した場合は、
//  期間の満了日は、2年後の平成20年6月1日の前日の平成20年5月31日ということになります。
//---------------------------------------------------------------------------
//--------------------------
//日付に〇ヶ月を追加
//addMonths2Date(new Date('2024/4/1'), 6).toLocaleDateString()//'2024/10/1'
//addMonths2Date(new Date('2024/1/31'), 1).toLocaleDateString()//'2024/2/29'
//console.log(addMonths2Date(new Date('2024/1/16'), 1).toLocaleDateString());//'2024/2/16'
//--------------------------
export const addMonths2Date = (date: Date, months: number = 1) => {
  const d = date.getDate(); //Day
  date.setMonth(date.getMonth() + +months);
  if (date.getDate() != d) {
    date.setDate(0); //前月末日に戻る
  }
  return date;
};
//-----------------------------------------------------
//日付に〇ヶ月を追加 第2引数の月を基本に
//addMonths2(31,new Date('2024/4/1'), 6).toLocaleDateString()//'2024/10/31'
//addMonths2(31,new Date('2024/1/31'), 1).toLocaleDateString()//'2024/2/29'
//addMonths2(20, new Date('2024/9/16'), 0).toLocaleDateString();//'2024/9/20'
//-----------------------------------------------------
export const addMonths2Date3 = (
  days: number,
  date: Date,
  months: number = 0,
) => {
  const baseDate = new Date(date.getFullYear(), date.getMonth()); // 計算の基準
  const dateOfThisMonth = new Date(baseDate);
  dateOfThisMonth.setMonth(dateOfThisMonth.getMonth() + months);
  const endOfThisMonth = new Date(
    dateOfThisMonth.getFullYear(),
    dateOfThisMonth.getMonth() + 1,
    0,
  ); // 今月の末日
  dateOfThisMonth.setDate(Math.min(Math.abs(days), endOfThisMonth.getDate())); // 今月の〇日
  // console.log(
  //   baseDate.toLocaleDateString(),
  //   dateOfThisMonth.toLocaleDateString(),
  // );
  return dateOfThisMonth;
};
//-------------------------------------------------------------------
// 1週間の曜日[日曜日始まり]に日付を日付[list]で返す
// [{day: 0, date: 'Sun Jun 02 2024 19:06:36 GMT+0900 (日本標準時)'},{}...,{}]
// getWeekDay7("2024/06/05")の週の日曜日始まり7日間
//-------------------------------------------------------------------
export const getWeekDay7 = (
  dateString1: string = '', //本日
  weeks: number = 0, //週間目
  weekStartDayOffset: number = 0, //日曜日始まり
) => {
  const _date = stringToDate(dateString1);
  const _day = weekStartDayOffset - _date.getDay();
  const sunDayNum = _date.getTime() + 864e5 * _day + 7 * 864e5 * weeks;
  const _yearMonth = _date.getFullYear() * 100 + _date.getMonth() + 1;

  let dayFormat = 0;
  let newDate = _date;
  let _yearMonth1 = 0;
  let inMonth = 0;
  const dayList = Array(7)
    .fill(0)
    .map((_, idx) => {
      dayFormat = sunDayNum + 864e5 * idx;
      newDate = new Date(dayFormat);
      const date = newDate.getDate(); //日にち
      _yearMonth1 = newDate.getFullYear() * 100 + newDate.getMonth() + 1;

      inMonth = _yearMonth === _yearMonth1 ? 1 : 0;
      return {
        id: idx,
        dateOnData: date,
        date: getDateWithString(newDate),
        inMonth: inMonth,
      };
    });
  return dayList;
};
//------------------------------------------
//回数月or始まり年月
//getNamYearMonth("2024/47")//[ 0, 2024, 11 ]
//const [num9, year9, month] = CallLib.getNamYearMonth(cCounts);
//[31, 1006]  or [22, 200910]
//num9=10,year9=0,month=6  or  num9=0,year9=2009,month=10
//------------------------------------------
export const getNamYearMonth = (cCounts: number | string = 1) => {
  let num9 = Number(String(cCounts).replace(/[^\d]/g, '')); //数字のみ
  let year9 = 0;
  //----------------------------
  let month = (num9 % 100) % 12; //月
  month = month == 0 ? 12 : month;
  num9 = parseInt(String(num9 / 100)); //回数or始まり年
  num9 >= 100
    ? ((year9 = num9), (num9 = 0))
    : (num9 = num9 % 100 == 0 ? 1 : num9 % 100);
  //[31, 1006]  or [22, 200910]
  //num9=10,year9=0,month=6  or  num9=0,year9=2009,month=10
  return [num9, year9, month];
};

//----呼び出し方法------------------------------------
//     const aa = v.date.split('/');//2024/01/20
//     const opt1: obj1 = {};
//     opt1['Y'] = aa[0];
//     opt1['M'] = aa[1];
//     opt1['-M'] = Number(aa[1]) - 1 === 0 ? 12 : Number(aa[1]) - 1;
//     opt1['N'] = v.option % 100;
//     opt1['-N'] = (v.option % 100) + 1;
//     const name2 = replaceMMM(v.name, opt1);
//     //console.log(name2);
//     v.name = name2;
//-----------------------------------------------------
// 置き換え 文字列 %M,%N,%Y
// text : "TS3締日%M月分"(ソース)
// opt1 : {M:"3",Y:"2024",N:"1"}(置き換え文字列)
// regexx : /%([+-]?)([0-9]?)[YMN]/g (省略時デホルト)
//-----------------------------------------------------
//
interface obj1 {
  [prop: string]: any;
}
export const replaceMMM = (
  text: string,
  opt1: obj1,
  regexx = /%([+-]?)([0-9]?)[YMN]/g,
) => {
  const target = text.match(regexx);
  //(2) ['%-M', '%M']
  if (target) {
    target.filter((v) => {
      const endChar = v.substring(v.length - 1);
      const singe = v.substring(v.indexOf('%') + 1, v.indexOf(endChar));
      const vv = singe === '-' || singe === '+' ? singe + '1' : singe;
      const result2 = Number.isNaN(Number(vv)) ? 0 : Number(vv);
      //Number.isNaN():数値でないものはすべて false を返します
      let num9 = Number(opt1[endChar]) + result2;
      //if (singe === '-' || singe === '+') {
      if (result2 == -1 && opt1[singe + endChar]) {
        num9 = Number(opt1[singe + endChar]);
      }
      text = text.replace(v, String(num9));
      //console.log('re', result2, '(', vv, ',', singe, ')', endChar);
    });
  }
  return text;
};

//--------------------------------------
//協定世界時のシリアル値：ExcelTimeUTC ＝ UnixTime / 86400 + 25569
//日本標準時のシリアル値：ExcelTimeJST ＝ (UnixTime + 32400) / 86400 + 25569
//+32400秒 / 86400秒 = 0.375 (tz) or ndt.getTimezoneOffset()= 540分 / 1440分 =0.375;
//GetTime()を秒に変換 /1000=秒 date.getTime() / 864e5
//協定世界時(UTC)1970年1月1日00:00:00からの経過時間を表すDateオブジェクトのミリ秒単位
//１日の秒数：24時間×60分×60秒 ＝ 86400秒
//UTC に対する JST の時差：+9時間 ＝ +32400秒
//UNIX Time の基準時刻 (1970/01/01(木) 00:00:00 UTC) に相当するシリアル値：25569
//UNIX Time ＝ (JD － 2440587.5) * 86400
//MJD = JD － 240 0000; 修正ユリウス日 54301 0.5日を引けば正子の値も得られる．
//const Si12 = JD % 12; //十二支
//確認： https://eco.mtk.nao.ac.jp/cgi-bin/koyomi/cande/jd2date.cgi
//
//usage:const qw = calc.date_JSTsetJD(calc.date_UTCgetJD(new Date('2024/07/31')));
//---------------------------------------
export function date_UTCgetJD(date: Date) {
  //UtC世界標準時をtimestamp返す
  const tz = date.getTimezoneOffset() / 1440;
  return 2440587 + date.getTime() / 864e5 - tz;
}

export function date_JSTsetJD(jd: number) {
  //JST日本標準時をDate返す
  const date = new Date();
  const tz = date.getTimezoneOffset() / 1440;
  date.setTime((jd + tz - 2440587) * 864e5);
  return date;
}
/**
 * 曜日を返す
 * @param {any} dayIndex=0
 * @param {any} en=false
 * @returns {any}
 */
export function dayOfWeek(dayIndex = 0, en = false) {
  const weeksJP = ['日', '月', '火', '水', '木', '金', '土'];
  const weeksEN = ['sun', 'mon', 'tue', 'thu', 'wed', 'fri', 'sat'];
  const weeks = en ? weeksEN : weeksJP;
  if (dayIndex < 0) {
    return weeks.length;
  }
  return weeks[dayIndex % 7];
}

/**
 * 和暦を返す
 * @param {any} currentDate
 * @returns {any} オブジェクト
 * this.getJapanCalendar(new Date(1868,11,2))
 *   ->year=1,yearText:{text: '明治', stext: 'M'}、明治元年
 */
export function getJapanCalendar(currentDate: Date) {
  const JcData = [
    {
      year: 2019,
      month: 5,
      date: 1,
      yearText: { text: '令和', stext: 'R' },
      Milliseconds: 0,
    },
    {
      year: 1989,
      month: 1,
      date: 8,
      yearText: { text: '平成', stext: 'H' },
      Milliseconds: 0,
    },
    {
      year: 1926,
      month: 12,
      date: 25,
      yearText: { text: '昭和', stext: 'S' },
      Milliseconds: 0,
    },
    {
      year: 1912,
      month: 7,
      date: 30,
      yearText: { text: '大正', stext: 'T' },
      Milliseconds: 0,
    },
    {
      year: 1868,
      month: 10,
      date: 23,
      yearText: { text: '明治', stext: 'M' },
      Milliseconds: 0,
    },
  ];
  JcData.forEach((e) => {
    //時間(milliseconds)を追加
    e.Milliseconds = new Date(e.year, e.month, e.date).getTime();
  });
  const t = currentDate.getTime();
  const w = JcData.find((e) => t >= e.Milliseconds);
  if (w) {
    const y = currentDate.getFullYear() - w.year + 1;
    return { year: y, yearText: w['yearText'] };
  }
  return {};
}

// -----------------------------------------
// 振替処理1
// 指定日が日曜日土曜日祭日ならその前後の日の以前後の平日に振り替え
// obj1=[{date:"2025/05/05"},,,{data:string}]
// -----------------------------------------
export const furikae901 = (
  date: string,
  resultHoliday: obj1[],
  increase = true,
) => {
  let dt = stringToDate(date);
  let checkHoliday = -1;
  let dayCount = 1;
  const offset = increase ? 1 : -1;//前-1;後+1
  while (dayCount) {
    dayCount = 0;
    const dateDay = dt.getDay(); //youbi
    let addDaySunSat;
    if (increase) {
      addDaySunSat = dateDay === 0 ? 1 : dateDay === 6 ? 2 : 0; //日土
    } else {
      addDaySunSat = dateDay === 0 ? -2 : dateDay === 6 ? -1 : 0; //日土
    }
    checkHoliday =
      addDaySunSat === 0
        ? resultHoliday.findIndex((w) => w.date === getDateWithString(dt))
        : -1;
    addDaySunSat = checkHoliday >= 0 ? offset : addDaySunSat;
    dayCount += addDaySunSat;
    dayCount != 0 ? (dt = dtPlus(dt, dayCount)) : null;
    //----- 土日または祭日前の日付:dt
    checkHoliday = resultHoliday.findIndex(
      (w) => w.date === getDateWithString(dt),
    );
    checkHoliday >= 0
      ? ((dt = dtPlus(dt, offset)), (dayCount += offset))
      : null;
  }

  return getDateWithString(dt);
};

//var date = new Date();
//var copiedDate = new Date(date.getTime());
//-------SetDate()の挙動---------------
// setDate(0)は先月末6/15->5/31,4/30,3/31,2/29...
// setDate(-1)は、6/15->5/30,4/29,3/30,2/28.....
// setDate(1)は月初、(30)30.....
// setDate(31:30+1)は6/15->7/1,7/31,7/31....
// setDate(32:30+2)は6/15->7/2,8/1,9/1,10/2,...
// 使い方：start1.setDate(start1.getDate() + 1);//１日後
//-----------------------------------------------------
//********************************************************* */
//********** 数値計算 ************************************** */
//********************************************************* */
// 最大公倍数(LCM)
// 値が複数個ある場合は、argumentsを使うことで計算することが可能です
// アロー関数は、argumentsは使用できません。
// lcm(15,25,50) > 150
// function calcLcm() {
//   const g = (n: number, m: number): number => (m ? g(m, n % m) : n);
//   const l = (n: number, m: number): number => (n * m) / g(n, m);
//   let ans = arguments[0];

//   for (let i = 1; i < arguments.length; i++) {
//     ans = l(ans, arguments[i]);
//   }
//   return ans;
// }
//
export const calcLcm = (...argc: number[]) => {
  const g = (n: number, m: number): number => (m ? g(m, n % m) : n);
  const l = (n: number, m: number): number => (n * m) / g(n, m);
  let ans = argc[0];

  for (let i = 1; i < argc.length; i++) {
    ans = l(ans, argc[i]);
  }
  return ans;
};
// 最大公約数（GCD）を求める関数
export const calcGcd = (a: number, b: number): number => {
  return b === 0 ? a : calcGcd(b, a % b);
};

//------------------------------
// "12-34"->[1,2,3,4]に変換する
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
//-----------------------------------------------------
//Range
//-----------------------------------------------------
/**
 * @param  {int} begin
 * @param  {int} end
 * @param  {int} interval=1
 */
// for (const i of range(begin,end)) {}
export function* range(begin: number, end: number, interval = 1) {
  for (let i = begin; i < end; i += interval) {
    yield i;
  }
}
//-----------------------------------------------------
//配列連番の生成（範囲指定）
// const List2 = calc.range2(10, 26).map(String);
//-----------------------------------------------------
export const range2 = (
  start: number,
  stop: number,
  step: number = 1,
): number[] =>
  Array.from({ length: (stop - start) / step + 1 }, (_, i) => start + i * step);

//-----------------------------------------------------
// 文字列形式で取得するので改行文字で区切って配列に
// その後","で区切ってオブジェクト配列に変換
// calc.stringToObjectArray(specialHolidayTxt3,"\t")
// [{10:xxxx,11:xxx,...30:xxxxx}...{}]
//-----------------------------------------------------
export const stringToObjectArray = (
  lineText: string,
  separator2 = ',',
  separator = /\r?\n/,
  commentLine = true, ////コメント行削除
) => {
  // const kugiri = /\r?\n/;
  const lineList = lineText.split(separator, -1); //データを配列に
  const keyList = range2(10, 30);
  const regex = commentLine ? /^#|^$/ : ''; //コメント行削除
  const resultObj = lineList
    .filter((data) => {
      // console.log('Data:', data);
      return !data.match(regex);
    }) // 2行目以降がデータのため
    .map((line: string) => {
      const valueList = line.split(separator2);
      const tmpObj: { [x: string]: string } = {};
      keyList.map((key, index) => (tmpObj[key] = valueList[index]));
      return tmpObj;
    });
  return resultObj;
};

//-----------------------------------------------------
//Deep Copy
//const deepCopy = structuredClone(originalDate);
//-----------------------------------------------------
//structuredClone(value, transfer);
//１．Deep Copy
// export function deepCloneObj2(originalObject) {
//   return JSON.parse(JSON.stringify(originalObject));
// }
//２．Deep Copy
export function deepCloneObj(obj: any): any {
  if (typeof obj === 'object') {
    if (Array.isArray(obj)) {
      return obj.map(deepCloneObj);
    } else {
      const clonedObj: { [index: string]: any } = {};
      for (const key in obj) {
        clonedObj[key] = deepCloneObj(obj[key]);
      }
      return clonedObj;
    }
  } else {
    return obj;
  }
}
//３．Deep Copy
// export function cloneObject(obj) {
//   const clone = {};
//   Object.keys(obj).forEach((key) => {
//     obj[key] != null && typeof obj[key] === 'object'
//       ? (clone[key] = cloneObject(obj[key]))
//       : (clone[key] = obj[key]);
//   });
//   return clone;
// }

// const obj: {
//   name: string;
//   age: number;
// } = {
//   name: 'John Doe',
//   age: 30,
// };
// const keys: Array<keyof typeof obj> = Object.keys(obj);
// const name: string = obj[keys[0]];
//
//４．Deep Copy
//Object,Array,Date,SetやMapなどのオブジェクトもコピーできる
export const cloneObject4 = (originalDate: any) => {
  const deepCopy = structuredClone(originalDate);
  return deepCopy;
};
//
//

/**
 * 任意の桁で四捨五入する関数
 * @param {number} value 四捨五入する数値
 * @param {number} base どの桁で四捨五入するか（10→10の位、0.1→小数第１位）
 * @return {number} 四捨五入した値
 */
export const numRound = (value: number, base: number): number => {
  return Math.round(value * base) / base;
};
//---------------------
//オブジェクト配列の指定されたKEYでまとめて文字列の配列を返す
//join... Object配列[{name:"name"}{...}]をArray["name","name1"...]つなぐ
// const array2 = calc.joinList(newDataset,"name"); //nameだけ取り出す
//---------------------
// type profileObj = {
//   [x:string]:any;
// };
export const joinList = (newDataset: object[], tagkey: string): string[] => {
  const dataString =
    newDataset.length === 0
      ? []
      : newDataset
          .map((data: { [index: string]: any }) => {
            return data[tagkey];
          })
          .reduce((prev: string[], curr: string): string[] => {
            return [...prev, curr]; //[...prev, curr, ' ']
          }, []);
  //.slice(0, -1); //最後のセパレター削除["友引"," ","芒種"]

  return dataString;
};

// holidayList = holidayList.concat(result); //配列結合
// オブジェクト→配列 arr.find(([id, data])=>{})
//const arr = Object.entries(obj);//id=obj.key,data={obj.data}
//--------------------------------
// オブジェクト配列で特定の値KEYでソートする処理
//-------------------------------------
export const dateSort = (
  //const myObj: {[index: string]:any} = {}
  MyArray: { [index: string]: any }[],
  sortKey: string[],
  sortType: string = 'ASC',
) =>
  MyArray.sort(function (x, y) {
    // const firstDate = new Date(x[sortKey]),SecondDate = new Date(y[sortKey]);
    let result = compareSort(sortKey[0], sortType, x, y);
    if (sortKey.length > 1 && result === 0) {
      result = compareSort(sortKey[1], sortType, x, y);
      if (sortKey.length > 2 && result === 0) {
        result = compareSort(sortKey[2], sortType, x, y);
      }
    }

    return result;
  });
const compareSort = (
  sortKey: string,
  sortType: string,
  source: any,
  target: any,
) => {
  const result = 0;
  if (sortType === 'ASC') {
    // 昇順
    if (source[sortKey] < target[sortKey]) return -1;
    if (source[sortKey] > target[sortKey]) return 1;
  } else {
    // 降順
    if (source[sortKey] > target[sortKey]) return -1;
    if (source[sortKey] < target[sortKey]) return 1;
  }
  return result;
};
//-------------------------------------
// 要素入れ替えの処理 [3,1],1,2 -> [3,undefine,1]
// replaceArrayElements(配列, 入れ替え先インデックス, 入れ替えもとインデックス);
//-------------------------------------
export function replaceArrayElements(
  array: any[],
  targetId: number,
  sourceId: number,
) {
  const cloneArray = [...array];
  [cloneArray[targetId], cloneArray[sourceId]] = [
    array[sourceId],
    array[targetId],
  ];
  return cloneArray;
}
//type Concat<T extends unknown[], U extends unknown[]> = [...T, ...U]
//-------------------------------------
// 配列を任意のサイズ毎に区切る
//const ary = [1, 2, 3, 4, 5, 6, 7, 8]
//console.log(eachSlice(ary, 2)); // [[1, 2], [3, 4], [5, 6], [7, 8]]
//console.log(eachSlice(ary, 4)); // [[1, 2, 3, 4], [5, 6, 7, 8]];
//-------------------------------------
export const eachSlice = (ary: number[], size: number): number[][] =>
  ary.reduce<number[][]>(
    (newArray, _, i) =>
      i % size ? newArray : [...newArray, ary.slice(i, i + size)],
    [],
  );

//------------------------------------------
//const data = [...Array(100).keys()]; // 0 から 99 までの配列
//[...arr].forEach((v,i) => {})//forの代わり
//2次元配列の生成と値の初期化 create
//fillを使用して初期化した場合(Row列,Col行)
//------------------------------------------
export const create2DimArray = (
  eleRow: number, //列
  element: number = 1, //行
  fill: number | string = 0,
): any[][] => {
  const array = Array.from({ length: element }, () =>
    Array.from({ length: eleRow }).fill(fill),
  );
  //------------------------
  //2. const array = new Array(0); //0行配列(array)を作成
  // for (let y = 0; y < element; y++) {
  //   //ｙ行配列(array)の各要素に対して、eleRow列の配列を作成し、0で初期化
  //   array[y] = new Array(eleRow).fill(fill);
  // }
  //-------------------
  //3. let arr = Array(m)
  //   .fill()
  //   .map(() => Array(n));
  //-----------------
  //4. let a;
  // for (a = []; a.length < 3; ) a.push(Array(5).fill(0));
  //------------------

  return array;
};
//-----------------------------------------------------
//2次元配列から特定の列だけ取り出し(縦列)
//Array[[a1,b1],[a2,b2],[a3,b3]]=>[b1,b2,b3]
//-----------------------------------------------------
export const getRow2DimArray = (arr2d: any[][], eleCol: number = 0): any[] => {
  const picked = arr2d.map((item) => item[eleCol]);
  return picked;
};
//-----------------------------------------------------
//二次元配列[][]から一次元配列[]への変換
//Down Ndim to N-1dim
//reduce & concat 1回につきカッコが一つ外れる。カッコがない要素はそのまま出力される。
//-----------------------------------------------------
export const get2dTo1d = (arr2d: any[][]) => {
  const array1d = arr2d.reduce((newArr, elem) => {
    return newArr.concat(elem); //elem:[1,2]
  }, []);
  // const array1d = [];
  // for (const array of arr2d) {
  //   for (const result of array) {
  //     array1d.push(result);
  //   }
  // }
  return array1d;
};
//-----------------------------------------------------
// 二次元配列の姿の文字列を作成する
//-----------------------------------------------------
export const str2d = (arr2d: any[][]) => {
  const str = arr2d.map((row) => row.join(' ')).join('\n');
  return str;
};
//-----------------------------------------------------
//二次元配列をオブジェクト(連想)配列に変換する、０行目はオブジェクトのキー
//[["氏名", "年齢", "性別"],  ["今野 智博", "75", "男"]]
//-----------------------------------------------------
export const conv2dToObj = (arr2d: any[][]) => {
  const keys = arr2d[0];
  const newObj = arr2d.slice(1).map((item) => {
    //arr2d[1]から
    const obj: { [x: string]: any } = {};
    keys.forEach((key, i) => (obj[key] = item[i]));
    return obj;
  });
  return newObj;
};
//-----------------------------------------------------
//TwoDimensional、二次元配列と二次元配列を非破壊的に結合する。
//false:第1引数のarr1の下側に、第2引数のarr2を追加(concat)する。
//true :第1引数のarr3の右側に、第2引数のarr4を追加(concat)する
//[第3引数]axis: false縦方向に結合、axis: true横方向に結合
//--- array[Row][Column]...
//var arr1 = [['A1','B1','C1'],['A2','B2','C2'],['A3','B3','C3']];
//var arr2 = [['A4','B4','C4'],['A5','B5','C5']];
//var arr3 = [['A1','B1','C1'],['A2','B2','C2'],['A3','B3','C3']];
//var arr4 = [['D1','E1'],['D2','E2'],['D3','E3']];
//-----------------------------------------------------
export const concat2DimArray = (
  array1: any[],
  array2: any[],
  axis: boolean = false,
) => {
  // if (axis != 1) axis = 0;
  let array3 = [];
  if (!axis) {
    //縦方向の結合
    array3 = array1.slice();
    for (let i = 0; i < array2.length; i++) {
      array3.push(array2[i]);
    }
  } else {
    //横方向の結合
    //TS2339エラーは型を明示していない場合に発生するエラーです。
    for (let i = 0; i < array1.length; i++) {
      array3[i] = array1[i].concat(array2[i]);
    }
  }
  return array3;
};
//-----------------------------------------------------
//一次元配列に値をpushする際と同様に、二次元配列に二次元配列を破壊的に追加する。
//[第3引数]axis: false縦方向に結合、axis: true横方向に結合
//-----------------------------------------------------
export const push2DimArray = (
  array1: any[],
  array2: any[],
  axis: boolean = false,
) => {
  // if (axis != 1) axis = 0;
  if (!axis) {
    //縦方向の追加
    for (let i = 0; i < array2.length; i++) {
      array1.push(array2[i]);
    }
  } else {
    //横方向の追加
    for (let i = 0; i < array1.length; i++) {
      Array.prototype.push.apply(array1[i], array2[i]);
    }
  }
};
//-----------------------------------------------------
//後入れ先出し（LIFO：Last In First Out）
//-----------------------------------------------------
export class Stack {
  items: any[];
  constructor() {
    this.items = [];
  }

  // 要素の追加
  push(element: any) {
    this.items.push(element);
  }

  // 要素の取り出し
  pop() {
    if (this.items.length === 0) return 'スタックは空です。';
    return this.items.pop();
  }
}
//-----------------------------------------------------
//先入れ先出し（FIFO：First In First Out）
//-----------------------------------------------------
export class Queue {
  items: any[];
  constructor() {
    this.items = [];
  }

  // 要素の追加
  enqueue(element: any) {
    this.items.push(element);
  }

  // 要素の取り出し
  dequeue() {
    if (this.items.length === 0) return 'キューは空です。';
    return this.items.shift();
  }
}
//-----------------------------------------------------
//
//-----------------------------------------------------
