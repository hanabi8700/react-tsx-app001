// #拡張形式２（週,始年月,曜日,拡張内容,休平日+400+振替コード,種別色,終年,除外年01,除外年02,除外年03,）
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
// 2,200001,1,成人の日,401,                   #第２週１月の月曜日
// 2,202010,1,スポーツのの日,401,,,2020,2021  #第２週１０月の月曜日

import * as CallLib from './CalenderLib';
import { Result1 } from '@/pages/Holiday2';
const debug9 = false;
// const options1: { [lang: string]: string } = {
//   year: 'numeric',
//   month: 'long',
//   day: 'numeric',
//   weekday: 'long',
// };
// const locale = 'ja-JP-u-ca-japanese';

//------------------------------------
// 週、始まり年月、曜日、
// CalledCalc400(2,"200001",2,new Date("1973/4/1")) // [1973-01-08]
//------------------------------------
export const CalledCalc400 = (
  cWeeks: number | string = 23, //週間
  date: string = '', //始年月
  cWeekdays: number | string = 23, //曜日
  calendarDate: Date = new Date(),

  flag: boolean = false,
) => {
  const lastDate = structuredClone(calendarDate); //DeepCopy
  const monthStr = date.toString().padStart(2, '0').slice(-2);
  //始まり年月より月を取得後、今年の日付取得（取得月で）後、カレンダー年に変更
  const firstDate = CallLib.get8NumToDate(monthStr);
  firstDate.setFullYear(lastDate.getFullYear());
  //
  flag ? firstDate.setMonth(firstDate.getMonth(), 1) : '';
  debug9 &&
    console.log(
      'lastDate',
      lastDate.toLocaleDateString(),
      'firstDate:',
      monthStr,
      '月',
      firstDate.toLocaleDateString(),
    );
  const strDate1 = Number(monthStr)
    ? firstDate.toLocaleDateString()
    : lastDate.toLocaleDateString();
  const weekdays = cWeekdays; //曜日
  const weeks = cWeeks; //週
  const result: Result1 = {
    type: 400,
    date: [],
    data010: 0,
  };
  result.date = callCalc401(weeks, weekdays, strDate1);
  return result;
};

// 週、曜日、年月で日付（）を返す
// 13,0,2,缶瓶収集日,400,3  #第13週毎月、火曜日
// 7,0,36,ごみ収集日,400,3  #毎週毎月、水土曜日
//console.log('F401:', callCalc401(13,2,""));#第13週毎月、火曜日
//'F401:', [ new Date('2024-09-02T15:00:00.000Z'), new Date('2024-09-16T15:00:00.000Z') ]
//
const callCalc401 = (
  weeks: string | number,
  weekdays: string | number,
  strDate1: string,
) => {
  const date100: Date[] = [];
  weeks = Number(weeks) === 7 ? 1234567 : weeks;
  CallLib.numberStringToArray(weeks).forEach((week) => {
    CallLib.numberStringToArray(weekdays).forEach((weekday) => {
      debug9 && console.log('day401', week, '週', weekday, '曜日', strDate1);
      const result = CallLib.getSpecificDayDate(weekday, week, strDate1);
      debug9 && console.log('result', result.toLocaleDateString());
      date100.push(result);
      // const jc = date00.toLocaleString(locale, options1);
    });
  });
  return date100;
};
