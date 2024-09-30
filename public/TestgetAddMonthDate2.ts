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

//----------------------------------------------------------
//○ヶ月後、○ヶ月前を取得する getAddMonthDate2("2024/05/06", 3)
//"2024/05/06"(月)->monthTerm=3  3カ月後 "2024年08月05日"(月)
//"2024/05/06"(月)->monthTerm=-3 3カ月前 "2024年02月07日"(水)
//getAddMonthDate2("2024/05/06", -3,false,false)//'2024年02月07日'
//----------------------------------------------------------
export const getAddMonthDate2 = (
  date3: string,
  monthTerm: number = 1,
  // sameDate = false, //○ヶ月前後の同じ日にちは :true
  getDateMode = true,
) => {
  // 年、月、日をそれぞれ算出
  const year3 = Number(date3.substring(0, 4));
  const month3 = Number(date3.substring(5, 7));
  let day3 = Number(date3.substring(8, 10));
  //?ヶ月前後を選択の際はその値を+-で;月末日取得
  // new Date(dt.getFullYear(), dt.getMonth() + 1, 0)
  // const endOfMonthDay = (function (paraYear, paraMonth) {
  //   const tempEndDate = new Date(paraYear, paraMonth, 0);
  //   return tempEndDate.getDate();
  // })(year3, month3 + monthTerm);
  const endOfMonthDay = endOfMD(year3, month3, monthTerm);

  console.log('day3,endMD', day3, endOfMonthDay);

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

export const getAddMonthDate3 = (year, month, day, add) => {
  //nヶ月前後の年月日を取得する
  const addMonth = month + add;
  const endDate = getEndOfMonth(year, addMonth); //add分を加えた月の最終日を取得

  //引数で渡された日付がnヶ月後の最終日より大きければ日付を次月最終日に合わせる
  //5/31→6/30のように応当日が無い場合に必要
  if (day > endDate) {
    day = endDate;
  } else {
    day = day - 1;
  }

  const addMonthDate = new Date(year, addMonth - 1, day);
  return addMonthDate;
};

//今月の月末日を取得
//※次月の0日目＝今月の末日になる
function getEndOfMonth(year, month) {
  const endDate = new Date(year, month, 0);
  return endDate.getDate();
}
function getLastDate(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0);
}
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
//-----------------------------------------------------
//その月の初日、最終日、先月、来月を配列で返す
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
    date.getMonth(),
    0, //date.getDate(),
  );
  const lastDayOfMonth = new Date(
    firstDayOfMonth.getFullYear(),
    firstDayOfMonth.getMonth() + 1,
    0,
  ); //ひと月足して日にち0日、月末日
  return [firstDayOfMonth, lastDayOfMonth, lastMonth, nextMonth];
};

//--------------------------
//日付にXヶ月を追加
//addMonths(new Date('2024/4/1'), 6).toLocaleDateString()//'2024/10/1'
//addMonths(new Date('2024/1/31'), 1).toLocaleDateString()//'2024/2/29'
//--------------------------
export const addMonths2Date = (date: Date, months: number = 1) => {
  console.log('dates', date);

  const d = date.getDate(); //日にち
  date.setMonth(date.getMonth() + +months);
  if (date.getDate() != d) {
    date.setDate(0); //前月末日に戻る
  }
  return date;
};

//---
export const endOfMD = (
  year3: number,
  month3: number,
  monthTerm: number = 0,
) => {
  const endOfMonthDay = (function (paraYear, paraMonth) {
    const tempEndDate = new Date(paraYear, paraMonth, 0); //最終日
    console.log(tempEndDate, paraYear, paraMonth);
    return tempEndDate.getDate();
  })(year3, month3 + monthTerm);
  return endOfMonthDay;
};

//-----------------------------------------------------
//日付にXヶ月を追加 第2引数の月を基本に第１引数の日にちを返す
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
console.log(
  'F',
  getDateWithString(
    getAddMonthDate2(getDateWithString(new Date('2021/2/29')), -2) as Date,
  ),
  getDateWithString(
    getAddMonthDate2(getDateWithString(new Date('2020/12/31')), 2) as Date,
  ),
);
console.log('qq', getFirstLastDayOfMouth('2024/02/20')[0].toLocaleDateString());
console.log(addMonths2Date(new Date('2024/2/29'), 0).toLocaleDateString());
console.log(getAddMonthDate2('2024/02/29', -1, false));
console.log(getAddMonthDate2('2024/03/30', 0, false));
//console.log(getAddMonthDate3(2020, 2, 12, -1).toLocaleDateString());
//console.log(getLastDate(new Date("2024/09/31")));
//console.log(addMonths2Date3(20, new Date('2024/9/16'), 1).toLocaleDateString());
console.log('endOfMD', endOfMD(2024, 2, 5));
