// 毎年6月末から1か月間隔ごとに 10回
// 31,1006,1,国民健康保険料(第%-N/10期),310,3
// 毎年5月末から2か月間隔ごとに 4回
// 31,405,2,固定資産税(第%-N/4期),310,3
// 2,5,0,母の日,400,1       #第2週5月日曜日
// 3,6,0,父の日,400,1       #第3週6月日曜日
// 13,0,2,缶瓶収集日,400,3  #第13週毎月、火曜日
// 7,0,36,ごみ収集日,400,3  #毎週毎月、水土曜日
// 7,0,4,プラ収集日,400,3   #毎週毎月、木曜日
// 24,0,1,雑誌収集日,400,3  #第24週毎月、月曜日

import * as CallLib from './CalenderLib';

// const options1: { [lang: string]: string } = {
//   year: 'numeric',
//   month: 'long',
//   day: 'numeric',
//   weekday: 'long',
// };
// const locale = 'ja-JP-u-ca-japanese';

// 曜日、週、年月、
export const CalledCalc400 = (
  cWeekdays: number | string = 23,
  cWeeks: number | string = 23,
  date: string = '0',
  flag: boolean = false,
) => {
  // const num = String(date).replace(/[^\d]/g, '')
  // const cYear = Number(num.slice(0,4));
  // const cMonth = Number(num.slice(4, 6));
  // const firstDate = new Date(cYear, cMonth-1, 1);
  const firstDate = date == '0' ? new Date() : new Date(date);
  flag ? firstDate.setMonth(firstDate.getMonth(), 1) : '';
  const strDate1 = firstDate.toString();
  const weekdays = cWeekdays;
  const weeks = cWeeks;

  const result: CallLib.EventType = {
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
  CallLib.numberStringToArray(weeks).forEach((week) => {
    CallLib.numberStringToArray(weekdays).forEach((weekday) => {
      const date00 = CallLib.getSpecificDayDate(weekday, week, strDate1);
      date100.push(date00);
      // const jc = date00.toLocaleString(locale, options1);
    });
  });
  return date100;
};
