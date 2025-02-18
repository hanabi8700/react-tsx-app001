// import React from 'react'
import { HolidayList } from './Rokuyo';
import * as calc from '~/CalenderLib';
//---------------------------------------------------------
// 土用の丑の日、節分を抽出 (order_rokuObj:11)
//土用は「立春・立夏・立秋・立冬直前の十八日間」と定められるらしい
//大暑が16日前+2日前が18日間の始まり(夏)
//# ２４節気の定義28(3夏,9秋,15冬,21春)立〇、(0春,12秋)〇分
//----------------------------------------------------------
function Holiday(rokuyo: HolidayList[]): HolidayList[] {
  const rituList = rokuyo.filter((data) => {
    //シャローコピー
    //立秋、大暑、丑の日、立春
    return (
      data.order === 11 &&
      (data.option === 9 ||
        data.option === 8 ||
        data.option1 === 11 ||
        data.option === 21)
    );
  });
  const rituObj = rituList.find((data) => {
    //立秋、大暑いずれか抽出(ritu***)
    return data.option === 9 || data.option === 8;
  });

  let resultX: HolidayList[] = [];
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

    const result2 = result1.map((data): HolidayList => {
      // const faultyCopy = JSON.parse(JSON.stringify(data));

      const faultyCopy: HolidayList = calc.deepCloneObj(data);
      faultyCopy.name = '土用の丑';
      faultyCopy.order = 31; //30以上49以下,//振替コード
      faultyCopy.type = 'rokuObj'; //振替無視
      faultyCopy.duration = 1;
      return faultyCopy;
    });
    resultX = resultX.concat(result2);
    // return result;
  }
  //-------------------------------
  const rituObj1 = rituList.find((data) => {
    //立春 条件にマッチする最初の要素を返す
    return data.option === 21;
  });
  if (rituList && rituObj1) {
    // const faultyCopy: HolidayList = calc.deepCloneObj(rituObj1);
    const obj: HolidayList = {
      date: calc.getDateWithString(calc.stringToDate(rituObj1.date, -1)),
      name: '節分',
      holiday: false,
      order: 32, //30以上49以下,//振替コード
      type: 'rokuObj', //振替無視
      option: 0,
      duration: 1,
      backgroundColor: 'None',
    };
    resultX = resultX.concat([obj]);
  }
  return resultX;
}

export default Holiday;
