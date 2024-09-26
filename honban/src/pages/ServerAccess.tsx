//
import * as calc from '~/CalenderLib';
import { HolidayList } from './Rokuyo';
import { Holiday2 } from './Holiday2';
import { BirthDay } from './BirthDay';
import { EventDataGet } from './EventDataGet';
import { stockedDaysType, CalenderStack } from '~/CalenderStack';

//-----------------------------------------------------
//サーバーへアクセス Get
//-----------------------------------------------------
//
const debug8 = false;
const debug9 = false;
let stockedDays: stockedDaysType[] = []; //各日のイベント専有状態
const numRandom = () => Math.floor(Math.random() * 10000) + 1; //ランダム数値
export const ServerAccess = (
  calendarDates: calc.ObjectLiteralLike0,
  calendarDateStr: string,
  lastDateDay: Date,
  holidayArray: HolidayList[],
) => {
  //------------------------
  //通信データー取得範囲
  // console.log(holidayArray);
  // const endpointUrl = 'hanaflask/index.cgi/hanacalen/holiday';
  //------------------------
  const startDateStr = calc.getFormatDateTimeStr(
    calendarDates.prevDateLastWeek as Date,
  );
  const endDateStr = calc.getFormatDateTimeStr(
    lastDateDay, // カレンダー表示最終日
    // calendarDates.nextDateFirstWeek as Date,
  );
  debug9 && console.log('通信データ範囲', startDateStr, endDateStr);
  //////////////////////////////////////////
  //---------------------------
  //通信 特別記念日など取得のための通信実行
  //---------------------------
  const endpointUrl2 = 'webcalhana/data/yearly365.txt'; //honban\dist\yearly365.dat
  const endpointUrl3 = 'webcalhana/data/1970.1/1.txt'; //honban\dist\yearly365.dat
  const dataObj2 = toServerDataGET(endpointUrl2, {
    // responseType: 'blob', //text/plane,blob
    responseType: 'arraybuffer',
  });
  const dataObj3 = toServerDataGET(endpointUrl3, {
    // responseType: 'blob', //text/plane,blob
    responseType: 'arraybuffer',
  });
  //------------------------------------------
  //arrayBuffer(ShiftJis)-->decode-->UTF8へ変換関数
  //------------------------------------------
  function decodeShiftJis(data: ArrayBuffer): string {
    return new TextDecoder('shift-jis').decode(data);
  }
  //********** */
  //通信OK？
  //********** */
  if (dataObj2.data) {
    //祝日設定された情報など取得
    const specialHolidayTxt = decodeShiftJis(dataObj2.data);
    const result4: HolidayList[] = Holiday2(
      specialHolidayTxt,
      calendarDateStr,
      true,
    );
    // console.log('specialHoliday', specialHolidayTxt);
    //
    holidayArray = holidayArray.concat(result4); //配列結合シャローコピー
  }
  if (dataObj3.data) {
    // 特別記念日
    const specialHolidayTxt3 = decodeShiftJis(dataObj3.data);
    const resultObj3: string[] = calc.stringToObjectArray(
      specialHolidayTxt3,
      '\t',
    ) as any[];
    // console.log('DATA3', specialHolidayTxt3);
    // console.log('resultObj3:', resultObj3);
    //'resultObj3:'[{…}, {…}, {…}, {…}, {…}, {…}]
    //特別記念日など取得
    const result5 = BirthDay(resultObj3, calendarDateStr);
    holidayArray = holidayArray.concat(result5); //配列結合シャローコピー
  }
  for (const element of holidayArray) {
    element.id = numRandom(); //ID設定
    //element.order = element.order ? element.order : 1101;
    //element.date = calc.getDateWithString(new Date(element.start as string));
  }
  calc.dateSort(holidayArray, ['date', 'order']);//Sort
  stockedDays = CalenderStack(holidayArray, stockedDays, true, true); //初期化伴う
  ///////////////////////////////////////////////
  //------------------------
  // 通信 DataEvent
  //------------------------
  const endpointUrl = 'webcalhana/hanafullcal.py';

  const url = `${endpointUrl}?start=${startDateStr}&end=${endDateStr}`;
  const dataObj = toServerDataGET(url, {});
  //
  debug9 && console.log('Calendar-render');

  //********** */
  //通信OK？
  //********** */
  let dataEvent = [];
  if (dataObj.data) {
    //ダウンロードしたデーター
    dataEvent = calc.deepCloneObj(dataObj.data);//DeepCopy
    for (const element of dataEvent) {
      element.id = numRandom(); //ID設定
      element.order = element.order ? element.order : 1101;
      element.date = calc.getDateWithString(new Date(element.start as string));
    }
    //test項目
    // dataEvent.push({
    //   title: 'testTEST',
    //   id: numRandom(),
    //   order: 1109,
    //   date: '2024/09/14',
    //   duration: 2,
    //   backgroundColor: 'orange',
    //   start: '2024-09-14T00:00:00+09:00',
    // });
    stockedDays = CalenderStack(dataEvent, stockedDays); //並び替え
  }
  //該当クリック日付枠のイベントを検索
  calc.dateSort(stockedDays, ['date']);//Sort
  debug8 && console.log('Calendar-stockedDays:', stockedDays);
  debug8 && console.log('Calendar-holidayArray:', holidayArray);
  debug8 && console.log('Calendar-dataEvent:', dataEvent);
  //
  return [stockedDays, dataEvent, holidayArray];
};
//------------------------
// 通信サーバー
//------------------------
const toServerDataGET = (url: string, option = {}) => {
  // const url = `${endpointUrl}?start=${startDateStr}&end=${endDateStr}`;
  debug9 && console.log('dataGet', url);
  const dataObj = EventDataGet(url, option);
  // const dataObj2 = useCallback(
  //   (dataObj = EventDataGet(endpointUrl, startDateStr, endDateStr)),
  //   [startDateStr, endDateStr],
  // );

  debug9 &&
    console.log(
      'dataRECV',
      dataObj.iserror,
      dataObj.iserror ? dataObj.iserror : dataObj.data, //config.url//code
      dataObj.iserror ? dataObj.iserror.message : '',
      dataObj.isLoading,
      dataObj.isValidating,
    );
  return dataObj;
};
