//
import { HolidayList } from '../honban/src/pages/Rokuyo';
import * as calc from './CalenderLib';

export type Result1 = {
  type: number;
  date: Date[];
  data010: number;
};
// interface obj1 {
//   [prop: string]: any;
// }
// -----------------------------------------------
// 振替え処理 v.order(order:3031),v.option1(option1:301)
// SS：orderの1桁目
// #項目（振替コード:10）指定日が日曜日土曜日祭日ならその次の日の以降の平日に振り替え
// #項目（振替コード:20）指定日が日曜日土曜日祭日ならその前の日の以前の平日に振り替え
// #項目（振替コード:30）指定日が日曜日祭日ならその次の日の以降の土曜日平日に振り替え
// #項目（振替コード:40）指定日が日曜日祭日ならその前の日の以前の土曜日平日に振り替え
// #項目（振替コード:50）カレンダーの今月の一言の項目に内容が表示されます
// #項目（振替コード:60）指定日が日曜日土曜日祭日なら対象外とする（平日のみ）
// #項目（振替コード:70）指定日が祭日ならその次の7日以降の土曜日平日に振り替え、日曜日は振替えない
// #項目（振替コード:80）指定日が祭日ならその前の7日以前の土曜日平日に振り替え、日曜日は振替えない
// #項目（休平日）休日=1／平日=0の背景色で表示します、注意振替対象ではありません
// #項目（休平日）祝日=2は休日背景色で表示します、振替対象です
// HolidayList{
//  type:string,
//  holiday:boolean,
//  date:string,
//  order:number.
//  option1:number,
// }
// -----------------------------------------------
export const CalledFurikae100 = (data: HolidayList[]) => {
  const resultHoliday = data.filter((v) => v.holiday === true);
  const cldata = calc.cloneObject4(data) as HolidayList[];
  const vtype = ['rokuObj', 'today', 'holiday']; //振替対象外
  //v.holiday: true
  const result = cldata.map((v) => {
    const ss = v.order % 10; //振替コード
    const hs = (v.option1 ?? 0) % 10;
    const hh = hs === 2 ? false : v.holiday; //休日
    if (ss > 0 && ss != 5 && !hh && !vtype.includes(v.type)) {
      let furikaeDate = v.date;
      furikaeDate =
        ss === 1 ? calc.furikae901(v.date, resultHoliday) : furikaeDate;
      furikaeDate =
        ss === 2 ? calc.furikae901(v.date, resultHoliday, false) : furikaeDate;
      furikaeDate = ss > 2 ? v.date : furikaeDate;
      v.date1 = v.date;
      v.date = furikaeDate;
      v.duration = v.duration ? v.duration : 1;
    }
    return v;
  });
  return result;
};

// // -----------------------------------------
// // 振替処理0
// // 指定日が日曜日土曜日祭日ならその次の日の以降の平日に振り替え
// // HolidayList=[{date:"2025/05/05"},,,{data:string}]
// // -----------------------------------------
// const furikae200 = (date: string, resultHoliday: HolidayList[]) => {
//   let dt = calc.stringToDate(date);
//   let checkHoliday = -1;
//   let dayCount = 1;
//   while (dayCount) {
//     dayCount = 0;
//     const dateDay = dt.getDay(); //youbi
//     let addDaySunSat = dateDay === 0 ? 1 : dateDay === 6 ? 2 : 0; //日土
//     checkHoliday =
//       addDaySunSat === 0
//         ? resultHoliday.findIndex((w) => w.date === calc.getDateWithString(dt))
//         : -1;
//     addDaySunSat = checkHoliday >= 0 ? 1 : addDaySunSat;
//     dayCount += addDaySunSat;
//     dayCount != 0 ? (dt = calc.dtPlus(dt, dayCount)) : null;
//     //----- 土日または祭日後の日付:dt
//     checkHoliday = resultHoliday.findIndex(
//       (w) => w.date === calc.getDateWithString(dt),
//     );
//     checkHoliday >= 0 ? ((dt = calc.dtPlus(dt, 1)), dayCount++) : null;
//   }

//   return calc.getDateWithString(dt);
// };

// // -----------------------------------------
// // 振替処理1
// // 指定日が日曜日土曜日祭日ならその前の日の以前の平日に振り替え
// // HolidayList=[{date:"2025/05/05"},,,{data:string}]
// // -----------------------------------------
// const furikae201 = (date: string, resultHoliday: HolidayList[]) => {
//   let dt = calc.stringToDate(date);
//   let checkHoliday = -1;
//   let dayCount = 1;
//   while (dayCount) {
//     dayCount = 0;
//     const dateDay = dt.getDay(); //youbi
//     let addDaySunSat = dateDay === 0 ? -2 : dateDay === 6 ? -1 : 0; //日土
//     checkHoliday =
//       addDaySunSat === 0
//         ? resultHoliday.findIndex((w) => w.date === calc.getDateWithString(dt))
//         : -1;
//     addDaySunSat = checkHoliday >= 0 ? -1 : addDaySunSat;
//     dayCount += addDaySunSat;
//     dayCount != 0 ? (dt = calc.dtPlus(dt, dayCount)) : null;
//     //----- 土日または祭日前の日付:dt
//     checkHoliday = resultHoliday.findIndex(
//       (w) => w.date === calc.getDateWithString(dt),
//     );
//     checkHoliday >= 0 ? ((dt = calc.dtPlus(dt, -1)), dayCount--) : null;
//   }

//   return calc.getDateWithString(dt);
// };
