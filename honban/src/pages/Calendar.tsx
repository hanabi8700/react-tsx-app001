//import React from 'react';
import * as calc from '~/CalenderLib';
import { MouseEventHandler, useCallback, useMemo, useState } from 'react';
import './Calendar.css';
import Rokuyo, { HolidayList } from './Rokuyo';
// import { DataEventsType } from './ServerAccess'; //interface


import Holiday from './Holiday';
import WeekDay from '../component/WeekDay';
import { ServerAccess } from './ServerAccess';
import { CalledFurikae100 } from '~/CalledFurikae100';
import { stockedDaysType, CalenderStack } from '~/CalenderStack';

// export const fetchUrlArray = () => {
//   const url = [
//     // 'https://hanamaru8700.com/cgi-bin/webcalhana/hanafullcal.py',
//     'https://hanamaru8700.com/cgi-bin/hanaflask/index.cgi/hanacalen/webcal',
//     'https://hanamaru8700.com/cgi-bin/hanaflask/index.cgi/hanacalen/holiday',
//     'https://hanamaru8700.com/cgi-bin/hanaflask/index.cgi/hanacalen/holiday003',
//   ];
// };
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
const debug8 = false;
const debug9 = false;
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
    // uDate,
  } = useCounter();
  //
  //dayOfWeeks 日月～土
  const weekDays = calc.getWeekday() as string[];
  const date5 = new Date();
  const date55 = calc.addMonths2Date(date5, countx);
  const calendarDateStr = calc.getDateWithString(date55);
  debug9 && console.log('カレンダー', calendarDateStr, date5, countx);
  //カレンダー 2024/01/30 Sat Sep 28 2024 13:55:35 GMT+0900 (日本標準時) -8
  //カレンダー 2024/03/01 Sat Sep 28 2024 13:58:18 GMT+0900 (日本標準時) -7

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
      duration: 1,
      backgroundColor: 'None',
    },
    {
      date: '2025/02/13',
      name: '継続14',
      holiday: false,
      order: 1101,
      type: 'holiday',
      option: 0,
      duration: 14,
      backgroundColor: 'None',
    },
    {
      date: '2025/02/15',
      name: '継続2',
      holiday: false,
      order: 1101,
      type: 'holiday',
      option: 0,
      duration: 2,
      backgroundColor: 'None',
    },
    {
      date: '2025/02/16',
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
  // 表示カレンダー範囲
  //--------------------------------------
  const result2 = Rokuyo(betweenArray); //六曜
  const result3 = Holiday(result2); //土用の丑の日(ID:31)、節分(ID:32)
  holidayArray = holidayArray.concat(result2, result3); //配列結合シャローコピー
  //calc.dateSort(holidayArray, ['date', 'order']);
  for (const element of holidayArray) {
    //ID設定
    element.id = numRandom();
  }
  //-----------------------------------------------------
  // サーバーへアクセス Get
  // calendarDates:カレンダーに関する日付群（月初、月末など）
  // calendarDateStr:カレンダー表示日付
  // lastDateDay:カレンダー表示最終日
  // holidayArray:ホリデイ祝日、六曜、特別記念日など取得
  //---
  // Return: stockedDays, dataEvent, holidayArray2
  // Stock:ストックID番号, Event:イベント情報, Holiday:祝日休日など
  //-----------------------------------------------------
  // const [stockedDays, dataEvent, holidayArray2] = ServerAccess(
  const [dataEvent, holidayArray2] = ServerAccess(
    calendarDates,
    calendarDateStr,
    lastDateDay,
    holidayArray,
  );
  // holidayArray = holidayArray2;
  // 3N0or4N0 の振替コード処理
  holidayArray = CalledFurikae100(holidayArray2);
  // 振替後にstockDays作成
  let stockedDays: stockedDaysType[] = []; //各日のイベント専有状態
  stockedDays = CalenderStack(holidayArray, stockedDays, true, true); //初期化伴う
  stockedDays = CalenderStack(dataEvent, stockedDays); //並び替え

  calc.dateSort(holidayArray, ['date', 'order']); //Sort
  calc.dateSort(dataEvent, ['date']); //Sort
  calc.dateSort(stockedDays, ['date']); //Sort
  debug8 && console.log('Calendar-stockedDays:', stockedDays);
  debug8 && console.log('Calendar-holidayArray:', holidayArray);
  debug8 && console.log('Calendar-dataEvent:', dataEvent);

  // const resultFilter = holidayArray.filter((d) => {
  //   return d.duration! <= 0 || !d.duration;
  // });
  // console.log('resultFilter', resultFilter);
  //
  debug9 && console.log('---------------------------------');
  // -----------------------------Display-Calendar-----------------------------
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
              type="month"
              name="birth"
              onChange={idouBtn}
              pattern="[0-9]{4}-[0-9]{2}"
              // value={calc.getFormatDateTimeStr(uDate)}
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
            {Array(6)
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
