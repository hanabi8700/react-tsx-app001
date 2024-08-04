//import React from 'react';
import { MouseEventHandler, useCallback, useMemo, useState } from 'react';
// import * as calc from '../../../public/CalenderLib';
import * as calc from '~/CalenderLib';
import './Calendar.css';
import Rokuyo, { holidayList } from './Rokuyo';

import Holiday from './Holiday';
import { EventDataGet } from './EventDataGet';

// export const fetchUrlArray = () => {
//   const url = [
//     // 'https://hanamaru8700.com/cgi-bin/webcalhana/hanafullcal.py',
//     'https://hanamaru8700.com/cgi-bin/hanaflask/index.cgi/hanacalen/webcal',
//     'https://hanamaru8700.com/cgi-bin/hanaflask/index.cgi/hanacalen/holiday',
//     'https://hanamaru8700.com/cgi-bin/hanaflask/index.cgi/hanacalen/holiday003',
//   ];
// };
//-----------------------------------------------------
// １週間のバックグラウンド関数
// ctDate:"日付",weeksNum:週番号,dataset:休日オブジェクト
//-----------------------------------------------------
const weekDayBG = (
  ctDate: string,
  weeksNum: number,
  dataset: holidayList[],
) => {
  const weekdayArray = calc.getWeekDay7(ctDate, weeksNum);
  //today.format="2024/06/05"
  // const newDataset = dataset.findIndex((data) => data.name === 'bbb');

  let newDataset = -1;
  return weekdayArray.map((d, index) => {
    let cName = 'day flex1 ';
    //祝日
    newDataset = dataset.findIndex(
      (data) => data.date === d.date && data.holiday,
    );
    cName += newDataset > -1 ? 'holiday ' : '';
    //当日
    newDataset = dataset.findIndex(
      (data) => data.date === d.date && data.name === 'today',
    );
    cName += newDataset > -1 ? 'today ' : '';
    cName += d.inMonth ? 'dayly ' : 'outmonth ';
    return <div key={index} className={cName}></div>;
  });
};
//-----------------------------------------------------
// 1週間のフォアグラウンド関数
// ctDate:"日付",weeksNum:週番号,dataset:休日オブジェクト
//-----------------------------------------------------
const weekDayFG = (
  ctDate: string,
  weeksNum: number,
  dataset: holidayList[],
) => {
  const weekdayArray = calc.getWeekDay7(ctDate, weeksNum);
  //today.format="2024/06/05"
  // let newDataset:string[];
  const event2List = weekdayArray.map((d, index) => {
    const bt = (
      <button type="button" name={d.date}>
        {d.dateOnData}
      </button>
    ); //日にち表示Button
    //--------------------------------------------
    //newDataset = dataset.findIndex((data) => data === d.date);
    let newDataset = dataset.filter((data) => {
      return data.date === d.date && 9 < data.order && data.order < 30;
      //六曜（ろくよう、りくよう）dataset 1Day  (order:10=>29)
    });
    //--------------------------------------
    const array1 = calc.joinList(newDataset, 'name'); //nameだけ取り出す
    newDataset = dataset.filter((data) => {
      return data.date === d.date && data.holiday && data.order >= 999;
      //祝日 dataset 1Day
    });
    const array2 = calc.joinList(newDataset, 'name'); //nameだけ取り出す
    const newArray = array1.concat(array2);
    //---------------------------------------
    //出力
    const sp = <span>{newArray.join()}</span>;
    // <span>友引 芒種</span>
    return (
      <div key={index} className="day flex1">
        {bt}
        {sp}
      </div>
    );
    //ここまでのreturnをoutput2Listに詰め込む
  });
  {
    /*
    <div class="ht-row flex2">
      <div class="day flex1">
        <button type="button" name="2024/07/06">
          6
        </button>
        <span>赤口小暑</span>
      </div>
    </div>
    <div class="day flex1"></div>
    <div class="day flex1"></div>
    :
  */
  }
  const output = (
    <div className="ht-row flex2">
      {event2List.map((d) => {
        return d;
      })}
    </div>
  );
  return output;
};
//-----------------------------------------------------
// ctDate:"日付",weeksNum:週番号,dataset:休日オブジェクト
// 1週間のイベント表示 一行分
// イベント５行分
//----------------------------------------------------
type Outlets2 = {
  length: number;
  color: string;
  [x: string]: string | number;
};
interface EventType {
  backgroundColor: string;
  title: string;
  shuitem?: string;
  start?: string;
  allDay?: boolean;
  description?: string;
  stime_s?: string;
  catitem?: string;
  length?: number;
}

const event3list: EventType[] = [
  {
    allDay: true,
    backgroundColor: 'Olive',
    description: 'トヨタ',
    shuitem: '種別,その他',
    start: '2024-07-28T00:00:00+09:00',
    title: 'TS3Card増額申し込み/その他',
  },
  {
    allDay: true,
    backgroundColor: 'None',
    description: 'お墓の管理費2000',
    shuitem: '種別,コール',
    start: '2024-08-01T00:00:00+09:00',
    title: '払込取扱票届く/コール',
  },
  {
    allDay: true,
    backgroundColor: 'Olive',
    shuitem: '種別,その他',
    start: '2024-08-01T00:00:00+09:00',
    title: '関西みらい銀行振り込み先整理/その他',
  },
  {
    backgroundColor: 'blue',
    description: '門真運転免許',
    shuitem: '種別,研修会議',
    start: '2024-07-30T16:45:00+09:00',
    stime_s: '16:45 >17:10',
    title: '免許証について電話する/研修会議',
  },
  {
    backgroundColor: 'None',
    shuitem: '種別,コール',
    start: '2024-08-19T11:00:00+09:00',
    stime_s: '11:00 >11:30',
    title: '?訪問看護/コール',
  },
  {
    allDay: true,
    backgroundColor: 'Olive',
    catitem: 'カテゴリ,メンテナンス',
    description: '南野',
    shuitem: '種別,その他',
    start: '2024-08-22T00:00:00+09:00',
    title: '車庫のシャッター/その他',
  },
];
const event2List: Outlets2[][] = [
  [
    {
      date: '2024/08/01',
      title: '01234567890123456789',
      length: 3,
      color: '#7c25ee',
    },
    {
      date: '2024/07/28',
      title: 'aaaaaaaaaaaaaaaaaaa',
      length: 2,
      color: 'blue',
    },
  ],
  [],
];
const weekEvent = (
  ctDate: string,
  weeksNum: number,
  // dataSet: holidayList[],
  data5List: EventType[],
  count = 1, //行数
) => {
  const weekdayArray = calc.getWeekDay7(ctDate, weeksNum);
  const datalist = []; //7列5行
  for (const obj1 of weekdayArray) {
    const result = data5List.filter(
      (date1) => calc.getDateWithString(new Date(date1.start)) === obj1.date,
    );
    datalist.push(result);
  }
  console.log('🚀 ~ file: Calendar.tsx:209 ~ datalist:', datalist);
  const aa = calc.getRow2DimArray(datalist, 1);
  console.log('🚀 ~ file: Calendar.tsx:210 ~ aa:', aa);

  const output: JSX.Element[] = [];

  for (let i = 0; i < count; i++) {
    //１行分
    // output.push(weekDayEventFG()); //ctDate, weeksNum, dataSet);
    // N行i列のアイテムをまとめる
    const aa:EventType[] = calc.getRow2DimArray(datalist, i);
    // console.log(event2List);
    output.push(
      // < className="ht-row flex2">
      <>
        {aa.map((d, index) => {
          if (d && d.backgroundColor === 'None') {
            d.backgroundColor = 'rgba(0, 0, 128, 0.3)';
          }
          if (d === undefined)
            d = {
              length: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              title: 'd',
            };
          //-------------------------------------------------
          d.length = 1;
          const lengthOut = 'calc(' + (100 / 7) * d.length + '%)';
          return (
            <div
              key={index}
              className="calendar-event3"
              style={{
                backgroundColor: d.backgroundColor,
                overflow: 'hidden',
                flexBasis: lengthOut,
              }}
            >
              {d.title}
            </div>
          );
        })}
      </>,
    );
  }
  return output;
};
//-----------------------------------------------------
// 月、年、今日ボタン処理
//-----------------------------------------------------

const Button = (
  handleClick: MouseEventHandler<HTMLButtonElement> | undefined,
  value: string | number,
  className = '',
) =>
  useMemo(() => {
    console.log('Button child component', value);
    return (
      <>
        <button type="button" onClick={handleClick} className={className}>
          {value}
        </button>
      </>
    );
  }, []);

export const useCounter = (initialValue = 0) => {
  const [countx, setCount] = useState(initialValue);
  console.log('ボタン', countx);

  const incrementM = useCallback(() => setCount((x) => x + 1), []);
  const decrementM = useCallback(() => setCount((x) => x - 1), []);
  const incrementY = useCallback(() => setCount((x) => x + 12), []);
  const decrementY = useCallback(() => setCount((x) => x - 12), []);

  const reset = useCallback(() => setCount(initialValue), [initialValue]);

  return { countx, incrementM, decrementM, incrementY, decrementY, reset };
};

//-----------------------------------------------------
// カレンダー本体
//-----------------------------------------------------

export const Calendar = () => {
  console.log('Calendar');
  const { countx, incrementM, decrementM, incrementY, decrementY, reset } =
    useCounter();
  //dayOfWeeks 日月～土
  const weekDays = calc.getWeekday() as string[];

  const date5 = new Date();
  const calendarDate = calc.getDateWithString(
    calc.getAddMonthDate2(calc.getDateWithString(date5), countx, true) as Date,
  );

  //--------------------------------------------------------
  // date.toLocaleDateString(); // 2020/5/13
  //--------------------------------------------------------
  const calendarDates = calc.CalenderLib(calendarDate);
  const ddYear = calendarDates.currentYear;
  const ddMonth = calendarDates.currentMonth;
  const ddWareki = calc.JapaneseCalendar(calendarDates.firstDate);

  // index 0:きょう  1~n:祝日、六曜
  let holidayList: holidayList[] = [
    {
      date: calc.getDateWithString(calendarDates.today),
      name: 'today',
      holiday: false,
      order: 0,
      type: 'today',
      option: 0,
    },

    // {
    //   date: '2024/07/13',
    //   name: '祝日',
    //   holiday: true,
    //   order: 401,
    // },
  ];
  const betweenArray = calc.getDatesBetween(
    calendarDates.firstDate, //月初め１日から５５日
    //calendarDates.lastDate+2週目の土曜日までをDate配列で
    calc.getSpecificDayDate(
      6, //土曜日
      3, //2週目0,1,2
      calc.getDateWithString(calendarDates.lastDate),
    ),
  );
  //--------------------------------------
  // ホリデイ祝日、六曜、特別記念日など
  //--------------------------------------
  const result2 = Rokuyo(betweenArray); //六曜
  const result3 = Holiday(result2); //土用の丑の日
  holidayList = holidayList.concat(result2, result3); //配列結合シャローコピー

  calc.dateSort(holidayList, ['date', 'order']);

  // console.log(holidayList);
  // const endpointUrl = 'hanaflask/index.cgi/hanacalen/holiday';
  const endpointUrl = 'webcalhana/hanafullcal.py';

  const startDateStr = calc.getFormatDateTime(
    calendarDates.prevDateLastWeek as Date,
  );
  const endDateStr = calc.getFormatDateTime(
    calendarDates.nextDateFirstWeek as Date,
  );

  const dataObj = EventDataGet(endpointUrl, startDateStr, endDateStr);
  // const dataObj2 = useCallback(
  //   (dataObj = EventDataGet(endpointUrl, startDateStr, endDateStr)),
  //   [startDateStr, endDateStr],
  // );

  // console.log(dataObj, dataObj.data, dataObj.iserror);
  console.log(
    'data',
    dataObj.iserror ? dataObj.iserror.config.url : dataObj.data,
    dataObj.iserror ? dataObj.iserror.message : '',
  );
  console.log('Calendar-end');
  let dataEvent = [];
  if (dataObj.data) {
    // const data1 = JSON.stringify(dataObj.data, null, 2);
    dataEvent = calc.deepCloneObj(dataObj.data);
    console.log(
      '🚀 ~ file: Calendar.tsx:384 ~ Calendar ~ dataEvent:',
      dataEvent,
    );
  }
  //該当クリック日付枠のイベントを検索{date: '2022-04-12', index: 0, randomId: 89747775}
  // -----------------------------Display-Calendar-------------------------------------
  return (
    <>
      {/* {console.log("fee")} */}
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
            <input className="bt_today" type="date" name="birth" />
            {/* {Button('', '移動', 'bt_idou')} */}
            <button className="bt_idou" type="button">
              移動
            </button>
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
            {/* １週目 */}
            <div className="ht-row-monthly possec flex2 date3">
              <div className="ht-row-bg posabs flex2">
                {/* 背景色 */}
                {weekDayBG(
                  calendarDates.firstDateStr as string,
                  0,
                  holidayList,
                )}
                {/* <div className="day flex1 holiday today"></div> */}
              </div>
              <div className="ht-row-container possec2">
                {/* 日付行 */}
                {weekDayFG(
                  calendarDates.firstDateStr as string,
                  0,
                  holidayList,
                )}

                {/* イベント行 */}
                {weekEvent(
                  calendarDates.firstDateStr as string,
                  0,
                  dataEvent,
                  5,
                ).map((val, index) => {
                  return (
                    <div key={index} className="ht-row flex2">
                      {val}
                    </div>
                  );
                })}
              </div>
            </div>
            {/* ２週目 */}
            <div className="ht-row-monthly possec flex2 date3">
              <div className="ht-row-bg posabs flex2">
                {weekDayBG(
                  calendarDates.firstDateStr as string,
                  1,
                  holidayList,
                )}
              </div>
              <div className="ht-row-container possec2">
                {weekDayFG(
                  calendarDates.firstDateStr as string,
                  1,
                  holidayList,
                )}
                {/* イベント行 */}
                {weekEvent(
                  calendarDates.firstDateStr as string,
                  1,
                  dataEvent,
                  5,
                ).map((val, index) => {
                  return (
                    <div key={index} className="ht-row flex2">
                      {val}
                    </div>
                  );
                })}
              </div>
            </div>
            {/* ３週目 */}
            <div className="ht-row-monthly possec flex2 date3">
              <div className="ht-row-bg posabs flex2">
                {weekDayBG(
                  calendarDates.firstDateStr as string,
                  2,
                  holidayList,
                )}
              </div>
              <div className="ht-row-container possec2">
                {weekDayFG(
                  calendarDates.firstDateStr as string,
                  2,
                  holidayList,
                )}
                {/* イベント行 */}
                {weekEvent(
                  calendarDates.firstDateStr as string,
                  2,
                  dataEvent,
                  5,
                ).map((val, index) => {
                  return (
                    <div key={index} className="ht-row flex2">
                      {val}
                    </div>
                  );
                })}
              </div>
            </div>
            {/* ４週目 */}
            <div className="ht-row-monthly possec flex2 date3">
              <div className="ht-row-bg posabs flex2">
                {weekDayBG(
                  calendarDates.firstDateStr as string,
                  3,
                  holidayList,
                )}
              </div>
              <div className="ht-row-container possec2">
                {weekDayFG(
                  calendarDates.firstDateStr as string,
                  3,
                  holidayList,
                )}
                {/* イベント行 */}
                {weekEvent(
                  calendarDates.firstDateStr as string,
                  3,
                  dataEvent,
                  5,
                ).map((val, index) => {
                  return (
                    <div key={index} className="ht-row flex2">
                      {val}
                    </div>
                  );
                })}
              </div>
            </div>
            {/* ５週目 */}
            <div className="ht-row-monthly possec flex2 date3">
              <div className="ht-row-bg posabs flex2">
                {weekDayBG(
                  calendarDates.firstDateStr as string,
                  4,
                  holidayList,
                )}
              </div>
              <div className="ht-row-container possec2">
                {weekDayFG(
                  calendarDates.firstDateStr as string,
                  4,
                  holidayList,
                )}
                {/* イベント行 */}
                {weekEvent(
                  calendarDates.firstDateStr as string,
                  4,
                  dataEvent,
                  5,
                ).map((val, index) => {
                  return (
                    <div key={index} className="ht-row flex2">
                      {val}
                    </div>
                  );
                })}
              </div>
            </div>
            {/* ６週目 */}
            <div className="ht-row-monthly possec flex2 date3">
              <div className="ht-row-bg posabs flex2">
                {weekDayBG(
                  calendarDates.firstDateStr as string,
                  5,
                  holidayList,
                )}
              </div>
              <div className="ht-row-container possec2">
                {weekDayFG(
                  calendarDates.firstDateStr as string,
                  5,
                  holidayList,
                )}
                {/* イベント行 */}
                {weekEvent(
                  calendarDates.firstDateStr as string,
                  5,
                  dataEvent,
                  5,
                ).map((val, index) => {
                  return (
                    <div key={index} className="ht-row flex2">
                      {val}
                    </div>
                  );
                })}
              </div>
            </div>
            {/* ７週目 */}
            <div className="ht-row-monthly possec flex2 date3">
              <div className="ht-row-bg posabs flex2">
                {weekDayBG(
                  calendarDates.firstDateStr as string,
                  6,
                  holidayList,
                )}
              </div>
              <div className="ht-row-container possec2">
                {weekDayFG(
                  calendarDates.firstDateStr as string,
                  6,
                  holidayList,
                )}
                {/* イベント行 */}
                {weekEvent(
                  calendarDates.firstDateStr as string,
                  6,
                  dataEvent,
                  5,
                ).map((val, index) => {
                  return (
                    <div key={index} className="ht-row flex2">
                      {val}
                    </div>
                  );
                })}
              </div>
            </div>
            {/* ８週目 */}
            <div className="ht-row-monthly possec flex2 date3">
              <div className="ht-row-bg posabs flex2">
                {weekDayBG(
                  calendarDates.firstDateStr as string,
                  7,
                  holidayList,
                )}
              </div>
              <div className="ht-row-container possec2">
                {weekDayFG(
                  calendarDates.firstDateStr as string,
                  7,
                  holidayList,
                )}
                {/* イベント行 */}
                {weekEvent(
                  calendarDates.firstDateStr as string,
                  7,
                  dataEvent,
                  5,
                ).map((val, index) => {
                  return (
                    <div key={index} className="ht-row flex2">
                      {val}
                    </div>
                  );
                })}
              </div>
            </div>
            {/* End */}
          </div>
        </div>
      </div>
    </>
  );
};
