//-------------------------------------------------------------------
// 1週間の曜日[日曜日始まり]に日付を日付[list]で返す
// getWeekDay7("2025/05/01")の週の日曜日始まり7日間
// 返値:
// {"id": 0,"dateOnData": 27,"date": "2025/04/27","inMonth": 0,"day":0}
// {"id":1...,"id":2.....}
// {"id": 6, "dateOnData": 3, "date": '2025/05/03', "inMonth": 1,"day":6}
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
        day: newDate.getDay(),
      };
    });
  return dayList;
};
//-----------------------------------
// 日付("2024-5-16")+plusをDate変換される
// lastDate.setMonth(month99 - 1, Number(cDayDate)); //任意
// const date31 = CallLib.stringToDate(lastDate.toString());
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
// --------------------------------------
console.log(getWeekDay7('2025/05/01', 1));
