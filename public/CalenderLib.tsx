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
  firstDateStr?: string; //月初String
  lastDayIndex?: number; //月末の曜日GetDay
  lastDayDate?: number; //月末の日にちGetDate
  prevLastDate?: Date; //先月末日のDate
  prevLastDayDate?: number; //先月末日の日にちGetDate
  prevDateLastWeek?: Date; //月初の週の日曜日
  nextDateFirstWeek?: Date; //date月末の週の土曜日
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

//------------------------------------------------------------
// 年月の指定した曜日の日付を取得する関数
// 来週の金曜日の日付を取得する場合は、
// 第一引数に5（金曜日）、第二引数に1（1週間後）を指定します
//------------------------------------------------------------
export const getSpecificDayDate = (
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
// 返値：[“2023-09-01”, ...]
//---------------------------------------------------------------
export const getDatesBetween = (startDate: Date, endDate: Date): Date[] => {
  const dates: Date[] = [];
  // const currentDate = new Date(startDate);
  const currentDate = stringToDate(getFormatDateTime(startDate));
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
  dateString1: string,
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

//---------------------------------
// 2024年06月21日->20240621->Date()
// 省略：今日、最低４桁必要だとgetNumDate(2024)
//---------------------------------
export const get8NumToDate = (dateString: string | number = '') => {
  let dateString2 = String(dateString).replace(/[^\d]/g, ''); //数字のみ
  if (dateString2.length < 4 && dateString2 !== '')
    dateString2 = ('0000' + dateString2).slice(-4);
  const dt =
    dateString2.slice(0, 4) +
    '/' +
    dateString2.slice(4, 6) +
    '/' +
    dateString2.slice(6);
  return dateString ? new Date(dt) : new Date();
};

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
// ISO: 2022-05-04T15:00:00.000Z <- 協定世界時で出力ので
// OFFSET -540分*60000 で予めずらす と00:00:00になる
// new Date('2024.7.21 13:00:04')Zを削除 return 13:00:04.000Z
//----------------------------------------------------------
export const getFormatDateTime = (date: Date, time: number = 0) => {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .split('T')[time];
};

// 最大公倍数
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
//var date = new Date();
//var copiedDate = new Date(date.getTime());
//

//------------------------------
// "1234"->[1,2,3,4]に変換する
//------------------------------
export const numberStringToArray = (num: string | number): number[] => {
  //String型に変換
  const stringNum = String(num).replace(/[^\d]/g, ''); //数字のみ
  const result = [];
  for (let i = 0; i < stringNum.length; i++) {
    result.push(parseInt(stringNum[i]));
  }
  return result;
};

//------------------------
// 日付の初期化 1日
//------------------------
export const initDate = () => {
  const date = new Date();
  date.setDate(1);
  return date;
};

//----------------------------------------------------------
//○ヶ月後、○ヶ月前を取得する
//"2024/05/06"(月)->monthTerm=3  3カ月後 "2024年08月05日"(月)
//"2024/05/06"(月)->monthTerm=-3 3カ月前 "2024年02月07日"(月)
//----------------------------------------------------------
export const getAddMonthDate2 = (
  date3: string,
  monthTerm: number = 1,
  sameDate = false, //○ヶ月前後の同じ日にちは :1
  getDateMode = true,
) => {
  // 年、月、日をそれぞれ算出
  const year3 = Number(date3.substring(0, 4));
  const month3 = Number(date3.substring(5, 7));
  let day3 = Number(date3.substring(8, 10));
  //?ヶ月前後を選択の際はその値を+-で;
  const endOfMonth = (function (paraYear, paraMonth) {
    const tempEndDate = new Date(paraYear, paraMonth, 0);
    return tempEndDate.getDate();
  })(year3, month3 + monthTerm);

  // if (day3 > endOfMonth) {
  //   day3 = endOfMonth;
  // } else {
  //   if (monthTerm >= 0) {
  //     day3 = day3 - 1;
  //   } else {
  //     day3 = day3 + 1;
  //   }
  // }
  day3 = day3 > endOfMonth ? endOfMonth : monthTerm >= 0 ? day3 - 1 : day3 + 1;

  const newDate = initDate(); //1日

  newDate.setFullYear(year3);
  newDate.setMonth(month3 + monthTerm - 1);
  newDate.setDate(day3 + (sameDate ? 1 : 0));

  const resultYear = newDate.getFullYear();
  const resultMonth = ('00' + (newDate.getMonth() + 1)).slice(-2);
  const resultDay = ('00' + newDate.getDate()).slice(-2);

  const result = getDateMode
    ? newDate
    : resultYear + '年' + resultMonth + '月' + resultDay + '日';
  return result;
};
//-------SetDate()の挙動---------------
// setDate(0)は先月末6/15->5/31,4/30,3/31,2/29...
// setDate(-1)は、6/15->5/30,4/29,3/30,2/28.....
// setDate(1)は月初、(30)30.....
// setDate(31:30+1)は6/15->7/1,7/31,7/31....
// setDate(32:30+2)は6/15->7/2,8/1,9/1,10/2,...
// 使い方：start1.setDate(start1.getDate() + 1);//１日後
//-----------------------------------------------------
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
//Deep Copy
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
//-------------------------------------------------------------------
// 1週間の曜日[日曜日始まり]に日付を日付[list]で返す
// {day: 0, date: 'Sun Jun 02 2024 19:06:36 GMT+0900 (日本標準時)'}
// getWeekDay7("2024/06/05")--->水曜日
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
//
//
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
  // const array = new Array(0); //0行配列(array)を作成
  // for (let y = 0; y < element; y++) {
  //   //ｙ行配列(array)の各要素に対して、eleRow列の配列を作成し、0で初期化
  //   array[y] = new Array(eleRow).fill(fill);
  // }
  //-------------------
  // let arr = Array(m)
  //   .fill()
  //   .map(() => Array(n));
  //-----------------
  // let a;
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
//二次元配列を連想配列に変換する、０行目はオブジェクトのキー
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
