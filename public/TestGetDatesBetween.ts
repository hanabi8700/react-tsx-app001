
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
//------------------------------------------------------------
// 年月の指定した曜日の日付を取得する関数
// 来週の金曜日の日付を取得する場合は、
// 第一引数に1（月曜日）、第二引数に2（第2）を指定します[第2月曜日]
// const res1 = getSpecificDayDate(1, 2, '2024/10/1');
// console.log(res1.toLocaleDateString())  //2024/10/14
//------------------------------------------------------------
export const getSpecificDayDate = (
  tDay: number,
  sWeek: number = 1,
  dateString1: string = '',
) => {
  console.log("GetSpecDatDate:",tDay,sWeek,dateString1)

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
//--*************************************************
const date = stringToDate("2025/1/1");
const currentMonth = date.getMonth();
const currentYear = date.getFullYear();
const firstDate2= new Date(currentYear, currentMonth, 1)
const lastDate2=new Date(currentYear, currentMonth + 1, 0),
const nextDateWeeks =0
const calendarDates = {
  currentMonth: currentMonth + 1,
  currentYear: currentYear,
  firstDate: new Date(currentYear, currentMonth, 1),
  lastDate: new Date(currentYear, currentMonth + 1, 0),
  prevDateLastWeek: new Date( //date月初の週の日曜日の日付
    firstDate2.getTime() - firstDate2.getDay() * 24 * 60 * 60 * 1000
  ),
  nextDateFirstWeek : new Date(
    lastDate2.getTime() +
      (nextDateWeeks + 7 - lastDate2.getDay() - 1) * 86400 * 1000,
  );
};
//------------------------------------------------------------------
//--------------------------------------
//表示カレンダー全日付 betweenArray by Date()
//--------------------------------------
const betweenArray = getDatesBetween(
  // calendarDates.firstDate, //月初め１日から５５日
  calendarDates.prevDateLastWeek as Date, //月初め１日前の日曜日から５５日
  //calendarDates.lastDate+2週目の土曜日までをDate配列で
  getSpecificDayDate(
    6, //土曜日まで
    7, //第７
    getDateWithString(calendarDates.lastDate) //date月初の週の日曜日の日付
  )
);
betweenArray.map((d)=>{console.log(d.toLocaleDateString())});
console.log("//date月初の週の日曜日の日付", calendarDates.prevDateLastWeek.toLocaleDateString())
console.log("//date月末の週の土曜日の日付:", calendarDates.nextDateFirstWeek.toLocaleDateString());
