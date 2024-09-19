//import React from 'react';
import * as calc from '~/CalenderLib';
import { MouseEventHandler, useCallback, useMemo, useState } from 'react';
// import * as calc from '../../../public/CalenderLib';
import './Calendar.css';
import Rokuyo, { HolidayList } from './Rokuyo';

import Holiday from './Holiday';
import { EventDataGet } from './EventDataGet';
import WeekDay from '../component/WeekDay';
import { stockedDaysType, CalenderStack } from '~/CalenderStack';
import { Holiday2 } from './Holiday2';

// export const fetchUrlArray = () => {
//   const url = [
//     // 'https://hanamaru8700.com/cgi-bin/webcalhana/hanafullcal.py',
//     'https://hanamaru8700.com/cgi-bin/hanaflask/index.cgi/hanacalen/webcal',
//     'https://hanamaru8700.com/cgi-bin/hanaflask/index.cgi/hanacalen/holiday',
//     'https://hanamaru8700.com/cgi-bin/hanaflask/index.cgi/hanacalen/holiday003',
//   ];
// };
let stockedDays: stockedDaysType[] = []; //各日のイベント専有状態
const numRandom = () => Math.floor(Math.random() * 10000) + 1; //ランダム数値

//-----------------------------------------------------
// 月、年、今日ボタン処理
//-----------------------------------------------------
//for HTML
const buttons = Array.from(document.getElementsByClassName('btn3'));
buttons.forEach((btn) => {
  btn.addEventListener('click', function handleClick(event) {
    console.log('button clicked');
    console.log(event);
    console.log(event.target);
  });
});
//React
const Button = (
  handleClick: MouseEventHandler<HTMLButtonElement> | undefined,
  value: string | number,
  className = '',
) =>
  useMemo(() => {
    debug8 && console.log('Button child component', value);
    return (
      <>
        <button type="button" onClick={handleClick} className={className}>
          {value}
        </button>
      </>
    );
  }, [className, handleClick, value]);
//-----------------------------------------------------
// 日付加減算
//-----------------------------------------------------
const useCounter = (initialValue = 0) => {
  const [countx, setCount] = useState<number>(initialValue);
  const [uDate, setUDate] = useState<Date>(new Date());
  debug8 && console.log('ボタンuseCounter', countx);

  const incrementM = useCallback(() => setCount((x) => x + 1), []);
  const decrementM = useCallback(() => setCount((x) => x - 1), []);
  const incrementY = useCallback(() => setCount((x) => x + 12), []);
  const decrementY = useCallback(() => setCount((x) => x - 12), []);

  const reset = useCallback(() => setCount(initialValue), [initialValue]);
  const idouBtn = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(e.target.valueAsDate);
    setUDate(e.target.valueAsDate ?? new Date());

    const dateNow = new Date();
    if (e.target.valueAsDate !== null) {
      const monthT = e.target.valueAsDate.getMonth() + 1;
      const yearT = e.target.valueAsDate.getFullYear();
      const mountNow = dateNow.getMonth() + 1;
      const yearNow = dateNow.getFullYear();
      const yearDiff = (yearT - yearNow) * 12;
      const monthDiff = yearDiff + (monthT - mountNow);
      setCount(() => monthDiff);
    }
  }, []);

  return {
    countx,
    incrementM,
    decrementM,
    incrementY,
    decrementY,
    reset,
    idouBtn,
    uDate,
  };
};

//-----------------------------------------------------
// カレンダー本体
//-----------------------------------------------------
const debug8 = true;
const debug9 = true;
export const Calendar = () => {
  debug9 && console.log('Calendar');
  const {
    countx,
    incrementM,
    decrementM,
    incrementY,
    decrementY,
    reset,
    idouBtn,
    uDate,
  } = useCounter();
  //
  //dayOfWeeks 日月～土
  const weekDays = calc.getWeekday() as string[];

  const date5 = new Date();
  const calendarDateStr = calc.getDateWithString(
    calc.getAddMonthDate2(calc.getDateWithString(date5), countx, true) as Date,
  );
  debug9 && console.log('カレンダー', calendarDateStr);

  //--------------------------------------------------------
  // date.toLocaleDateString(); // 2020/5/13
  //--------------------------------------------------------
  const calendarDates = calc.CalenderLib(calendarDateStr);
  const ddYear = calendarDates.currentYear;
  const ddMonth = calendarDates.currentMonth;
  const ddWareki = calc.JapaneseCalendar(calendarDates.firstDate);

  debug9 && console.log('calendarDates:', calendarDates);
  // index 0:きょう  1~n:祝日、六曜
  let holidayArray: HolidayList[] = [
    {
      date: calc.getDateWithString(calendarDates.today),
      name: 'today',
      holiday: false,
      order: 0,
      type: 'today',
      option: 0,
      backgroundColor: 'None',
    },
    {
      date: '2024/08/13',
      name: '継続14',
      holiday: false,
      order: 1101,
      type: 'holiday',
      option: 0,
      duration: 14,
      backgroundColor: 'None',
    },
    {
      date: '2024/08/15',
      name: '継続2',
      holiday: false,
      order: 1101,
      type: 'holiday',
      option: 0,
      duration: 2,
      backgroundColor: 'None',
    },
    {
      date: '2024/08/16',
      name: '継続4',
      holiday: false,
      order: 1101,
      type: 'holiday',
      option: 0,
      duration: 4,
      backgroundColor: 'None',
    },
  ];
  //--------------------------------------
  //表示カレンダー全日付 betweenArray by Date()
  //--------------------------------------
  const betweenArray = calc.getDatesBetween(
    // calendarDates.firstDate, //月初め１日から５５日
    calendarDates.prevDateLastWeek as Date, //月初め１日前の日曜日から５５日
    //calendarDates.lastDate+2週目の土曜日までをDate配列で
    calc.getSpecificDayDate(
      6, //土曜日まで
      7, //第７
      calc.getDateWithString(calendarDates.lastDate),
    ),
  );
  // カレンダー表示最終日
  const lastDateDay = betweenArray[betweenArray.length - 1];
  // debug9 && console.log('表示カレンダー全日付', betweenArray);

  //--------------------------------------
  // ホリデイ祝日、六曜、特別記念日など取得
  //--------------------------------------
  const result2 = Rokuyo(betweenArray); //六曜
  const result3 = Holiday(result2); //土用の丑の日(ID:31)
  holidayArray = holidayArray.concat(result2, result3); //配列結合シャローコピー
  //calc.dateSort(holidayArray, ['date', 'order']);
  for (const element of holidayArray) {
    //ID設定
    element.id = numRandom();
  }
  //------------------------
  //通信データー取得範囲
  // console.log(holidayArray);
  // const endpointUrl = 'hanaflask/index.cgi/hanacalen/holiday';
  //------------------------
  const endpointUrl = 'webcalhana/hanafullcal.py';

  const startDateStr = calc.getFormatDateTimeStr(
    calendarDates.prevDateLastWeek as Date,
  );
  const endDateStr = calc.getFormatDateTimeStr(
    lastDateDay, // カレンダー表示最終日
    // calendarDates.nextDateFirstWeek as Date,
  );
  debug9 && console.log('通信データ範囲', startDateStr, endDateStr);
  //////////////////////////////////////////
  //特別記念日など取得のための通信
  const endpointUrl2 = 'webcalhana/data/yearly365.txt'; //honban\dist\yearly366.dat
  const dataObj2 = EventDataGet(endpointUrl2, {
    // responseType: 'blob', //text/plane,blob
    responseType: 'arraybuffer',
  });
  debug9 &&
    console.log(
      'dataRECV2',
      dataObj2.iserror,
      dataObj2.iserror ? dataObj2.iserror : dataObj2.data, //config.url//code
      dataObj2.iserror ? dataObj2.iserror.message : '',
      dataObj2.isLoading,
      dataObj2.isValidating,
    );
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
    //特別記念日など取得
    const specialHolidayTxt = decodeShiftJis(dataObj2.data);
    console.log('specialHoliday', specialHolidayTxt);
    const result4: HolidayList[] = Holiday2(specialHolidayTxt, calendarDateStr);
    holidayArray = holidayArray.concat(result4); //配列結合シャローコピー
    for (const element of holidayArray) {
      element.id = numRandom(); //ID設定
      //element.order = element.order ? element.order : 1101;
      //element.date = calc.getDateWithString(new Date(element.start as string));
    }
    calc.dateSort(holidayArray, ['date', 'order']);
  }
  ///////////////////////////////////////////////
  //------------------------
  // 通信
  //------------------------
  const url = `${endpointUrl}?start=${startDateStr}&end=${endDateStr}`;
  const dataObj = EventDataGet(url, {});
  // const dataObj2 = useCallback(
  //   (dataObj = EventDataGet(endpointUrl, startDateStr, endDateStr)),
  //   [startDateStr, endDateStr],
  // );

  // console.log(dataObj, dataObj.data, dataObj.iserror);
  debug9 &&
    console.log(
      'dataRECV',
      dataObj2.iserror,
      dataObj2.iserror ? dataObj2.iserror : dataObj2.data, //config.url//code
      dataObj2.iserror ? dataObj2.iserror.message : '',
      dataObj2.isLoading,
      dataObj2.isValidating
    );
  debug9 && console.log('Calendar-render');
  stockedDays = CalenderStack(holidayArray, stockedDays, true, true); //初期化伴う

  //********** */
  //通信OK？
  //********** */
  let dataEvent = [];
  if (dataObj.data) {
    //ダウンロードしたデーター
    // const data1 = JSON.stringify(dataObj.data, null, 2);
    dataEvent = calc.deepCloneObj(dataObj.data);
    for (const element of dataEvent) {
      element.id = numRandom(); //ID設定
      element.order = element.order ? element.order : 1101;
      element.date = calc.getDateWithString(new Date(element.start as string));
    }
    //test項目
    dataEvent.push({
      title: 'testTEST',
      id: numRandom(),
      order: 1109,
      date: '2024/09/14',
      duration: 2,
      backgroundColor: 'orange',
      start: '2024-09-14T00:00:00+09:00',
    });
    stockedDays = CalenderStack(dataEvent, stockedDays); //並び替え
  }
  //該当クリック日付枠のイベントを検索
  calc.dateSort(stockedDays, ['date']);
  debug8 && console.log('Calendar-stockedDays:', stockedDays);
  debug8 && console.log('Calendar-holidayArray:', holidayArray);
  debug8 && console.log('Calendar-dataEvent:', dataEvent);

  // -----------------------------Display-Calendar-------------------------------------
  return (
    <>
      {/* //-------------ヘッダー----------------- */}
      <div className="calendar-wrappe">
        <div className="bt_hedder">
          <form action="" className="nav-calendar" name="nav-calendar">
            {Button(decrementY, '前年', 'bt_preyear')}
            {Button(decrementM, '前月', 'bt_prmonth')}
            <span className="bt_ddyear">{ddYear}</span>
            <span className="bt_ddmonth">{ddMonth}月</span>
            <span className="bt_ddwareki">({ddWareki})</span>
            <span>{countx}</span>
            {Button(incrementM, '次月', 'bt_postmonth')}
            {Button(incrementY, '次年', 'bt_postyear')}
            {Button(reset, '今日', 'bt_posttoday')}
            <input
              className="bt_today"
              type="date"
              name="birth"
              onChange={idouBtn}
              value={calc.getFormatDateTimeStr(uDate)}
            />
            {/* {Button(idouBtn, '移動', 'bt_idou')} */}
            {/* <button className="btn3" type="button">移動</button> */}
            {/* <!-- 直前のページに戻る --> */}
            {/* <input type="button" onClick={history.back()} value="戻る" /> */}
          </form>
        </div>
        {/* //------------------カレンダー-------------------- */}
        <div className="calendar5">
          <div className="ht-row-monthly-view">
            <div className="weekday2 flex2">
              {/* 日、月、火… */}
              {weekDays.map((weekday, index) => {
                return (
                  <div key={index} className="item flex1">
                    {weekday}
                  </div>
                );
              })}
              {/* <div className="item flex1">日</div>  */}
            </div>
            {/* １~ N 週目 */}
            {Array(7)
              .fill(0)
              .map((_, index) => {
                return (
                  // <>
                  <WeekDay
                    key={index}
                    ctDate={calendarDates.firstDateStr as string} //月始(1day)
                    weeksNum={index}
                    holidayArray={holidayArray}
                    dataEvent={dataEvent}
                    stockedDays={stockedDays}
                  ></WeekDay>
                  // </>
                );
              })}
            {/* End */}
          </div>
        </div>
      </div>
    </>
  );
};
