// import React from 'react'
import { holidayList } from './Rokuyo';
import * as calc from '~/CalenderLib';
// 土用の丑の日
//土用は「立春・立夏・立秋・立冬直前の十八日間」と定められるらしい
//大暑が16日前+2日前が18日間の始まり(夏)
//# ２４節気の定義28(3夏,9秋,15冬,21春)立〇、(0春,12秋)〇分
function Holiday(rokuyo: holidayList[]): holidayList[] {
  const rituList = rokuyo.filter((data) => {
    //シャローコピー
    //立秋、大暑、丑の日
    return (
      data.order === 11 &&
      (data.option === 9 || data.option === 8 || data.option1 === 11)
    );
  });
  const rituObj = rituList.find((data) => {
    //立秋、大暑いずれか抽出
    return data.option === 9 || data.option === 8;
  });

  // console.log(rituList,rituObj);
  if (rituList && rituObj) {
    const unixTime = Date.parse(rituObj.date);
    const start1 = new Date(unixTime - 864e5 * (rituObj.option === 8 ? 2 : 18));
    const end1 = new Date(start1.getTime() + 864e5 * 17); //初日から18日
    const result1 = rituList.filter((ele) => {
      const tm = Date.parse(ele.date); //日時を表す文字列を解釈
      return (
        tm >= start1.getTime() && tm < end1.getTime() && ele.option1 === 11
      );
    });
    // console.log(start1, end1, rituObj, result);
    // console.log(result);

    const result = result1.map((data): holidayList => {
      // const faultyCopy = JSON.parse(JSON.stringify(data));

      const faultyCopy: holidayList = calc.deepCloneObj(data);
      faultyCopy.order = 31;
      faultyCopy.name = '土用の丑';
      faultyCopy.type = 'doyoObj';
      return faultyCopy;
    });
    return result;
  }
  return [];
}

export default Holiday;
