//
//
import { Holiday2 } from './Holiday2';

//-----------------------------------------------------
// 特別記念日("データー","カレンダー日")
// 項目Get:monthlyitem
//-----------------------------------------------------
//
const debug9 = false;

export const BirthDay = (specialStr: string[], calendarDateStr: string) => {
  const dd = specialStr.find((dataObj) => dataObj[23] === 'monthlyitem');
  // console.log('speStr', calendarDateStr, specialStr, dd);

  const birthdayStr = dd ? (dd[24] as string) : '';
  const birthdayStr2 = birthdayStr.replace(/<br>/g, '\r\n');
  //....解析(%M,%Y,%N)
  const result = Holiday2(birthdayStr2, calendarDateStr);
  debug9 && console.log('birthday', calendarDateStr, birthdayStr2);
  debug9 && console.log('BirthDay:', result);
  return result;
};
