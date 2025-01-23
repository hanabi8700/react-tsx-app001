//
import { HolidayList } from '../honban/src/pages/Rokuyo';
import * as calc from '~/CalenderLib';

export type Result1 = {
  type: number;
  date: Date[];
  data010: number;
};
// interface obj1 {
//   [prop: string]: any;
// }
// -----------------------------------------------
// 振替え処理
// SS：（振替コード:10）/10
// #項目（振替コード:10）指定日が日曜日土曜日祭日ならその次の日の以降の平日に振り替え
// #項目（振替コード:20）指定日が日曜日土曜日祭日ならその前の日の以前の平日に振り替え
// #項目（振替コード:30）指定日が日曜日祭日ならその次の日の以降の土曜日平日に振り替え
// #項目（振替コード:40）指定日が日曜日祭日ならその前の日の以前の土曜日平日に振り替え
// #項目（振替コード:50）カレンダーの今月の一言の項目に内容が表示されます
// #項目（振替コード:60）指定日が日曜日土曜日祭日なら対象外とする（平日のみ）
// #項目（振替コード:70）指定日が祭日ならその次の7日以降の土曜日平日に振り替え、日曜日は振替えない
// #項目（振替コード:80）指定日が祭日ならその前の7日以前の土曜日平日に振り替え、日曜日は振替えない
// -----------------------------------------------
export const CalledFurike100 = (data: HolidayList[]) => {
  const reasltHoliday = data.filter((v) => v.holiday === true);
  const vtype = ['rokuObj', 'today', 'holiday'];
  const result = data.map((v) => {
    const ss = v.order % 10;
    if (ss > 0 && ss != 5 && !v.holiday && !vtype.includes(v.type)) {
      let dt = calc.stringToDate(v.date);
      let checkHoliday = -1;
      let dayCount = 1;
      while (dayCount) {
        dayCount = 0;
        const dateDay = dt.getDay(); //youbi
        let addDaySunSat = dateDay === 0 ? 1 : dateDay === 6 ? 2 : 0; //日土
        checkHoliday =
          addDaySunSat === 0
            ? reasltHoliday.findIndex(
                (w) => w.date === calc.getDateWithString(dt),
              )
            : -1;
        addDaySunSat = checkHoliday >= 0 ? 1 : addDaySunSat;
        dayCount += addDaySunSat;
        dayCount != 0 ? (dt = calc.dtPlus(dt, dayCount)) : null;
        //----- 土日または祭日後の日付:dt
        checkHoliday = reasltHoliday.findIndex(
          (w) => w.date === calc.getDateWithString(dt),
        );
        checkHoliday >= 0 ? ((dt = calc.dtPlus(dt, 1)), dayCount++) : null;
      }
      v.date1 = v.date;
      v.date = calc.getDateWithString(dt);
    }
    return v;
  });
  return result;
};
