import * as calc from '~/CalenderLib';
import { holidayList } from '../pages/Rokuyo';
// import { useState } from 'react';

export interface EventType {
  backgroundColor: string;
  title: string;
  shuitem?: string;
  start?: string; //日時
  allDay?: boolean;
  description?: string;
  stime_s?: string;
  catitem?: string;
  duration?: number; //連続日数
}

// 1 ~ 9 までの乱数を生成関数
// const numRandom = () => Math.floor(Math.random() * 1000) + 1;

//-----------------------------------------------------
//同じ日付を配列ごとに集める
//datalist[[{Date0a},{Date0b}...{Date0e}],[{Date1a}],...[{Date7a}]]
//datalist=[[日],[月],[火],[水],[木],[金],[土]] =
//[Array(0), Array(1), Array(2), Array(3), Array(0), Array(0), Array(1)]
//----------------------------------------------------
//
const debug9 = false;
export const WeekEvent3 = (
  weekdayArray: {
    id: number;
    dateOnData: number;
    date: string;
    inMonth: number;
  }[],
  dataEvent: EventType[],
  dataHoliday: holidayList[],
  // stockedDays: stockedDaysType[],
) => {
  debug9 && console.log('WeekEvent', weekdayArray[0]);

  const datalist: EventType[][] = []; //Array[行][列]
  // weekdayArray_obj1{id: 0, dateOnData: 25, date: '2024/08/25', inMonth: 1}
  for (const obj1 of weekdayArray) {
    //obj1.dateでまとめる
    //祝祭日(>29)-------------------------------------
    let result3: EventType[] = [];
    const result1 = dataHoliday
      .filter((d) => {
        if (d === undefined) return false;
        return (
          calc.getDateWithString(new Date(d.date as string)) === obj1.date &&
          d.order > 29
        );
      })
      .map((_): EventType => {
        return {
          backgroundColor: 'None',
          title: _.name,
          start: obj1.date,
        };
      });

    //result1:[{backgroundColor: 'None', title: '土用の丑', start: '2024/08/05'}]

    //EventData処理---------------------------------
    const result2 = dataEvent.filter((d) => {
      if (d === undefined) return false;
      return calc.getDateWithString(new Date(d.start as string)) === obj1.date;
    });
    //空白枠処理とマージ
    result3 = result3.concat(result1, result2); //空白配列除去＆結合
    //1次元配列を2次元配列に
    result1.length + result2.length != 0
      ? datalist.push([...result3])
      : datalist.push([]);
  }
  debug9 && console.log('datalist', datalist);
  return datalist;
};
//-----------------------------------------------------
// ctDate:"日付",weeksNum:週番号,dataHoliday:休日オブジェクト
// 1週間のイベント表示 一行分
// イベント５行分を画面に表示
//----------------------------------------------------
//
// const stockedDays: stockedDaysType[] = []; //各日のイベント専有状態
const weekEvent = (
  ctDate: string,
  weeksNum: number,
  dataEvent: EventType[],
  dataHoliday: holidayList[],
  count = 1, //行数
) => {
  // let stockedDays: stockedDaysType[] = []; //各日のイベント専有状態
  //stockedDays = [{ date: '2022-03-12', stack: Array(4), stat: Array(4), width: 95 },];
  const weekdayArray = calc.getWeekDay7(ctDate, weeksNum);
  // const datalist: EventType[][] = []; //Array[行][列]
  //5行7列Array=[[行１],[],...[[列１],[],...[]]]
  //同じ日付を配列ごとに集める  datalist[[{Date0a},{Date0b}...{Date0e}][{Date1a}]...[{Date7a}]]
  const datalist = WeekEvent3(
    weekdayArray,
    dataEvent,
    dataHoliday,
    // stockedDays,
  );
  //datalist=[[日],[月],[火],[水],[木],[金],[土]] =↓
  //[Array(2), Array(0), Array(0), Array(1), Array(2), Array(1), Array(0)]
  //1行目に祝日あり？

  const output: JSX.Element[] = [];
  //datalist=[[日1,...日n],[月1,...月n],...[土1,...土n]]

  for (let i = 0; i < count; i++) {
    //１行分aa=[日i,月i,火i,水i,木i,金i,土i]*count
    const aa: EventType[] = calc.getRow2DimArray(datalist, i);
    output.push(
      // < className="ht-row flex2">
      <>
        {aa.map((d, index) => {
          if (d && d.backgroundColor === 'None') {
            d.backgroundColor = 'rgba(0, 0, 128, 0.3)';
          }
          if (d === undefined) {
            d = {
              //定義されていません、作成する
              duration: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              title: 'd',
            };
          }

          //-------------------------------------------------
          d.duration = 1;
          const lengthOut = 'calc(' + (100 / 7) * d.duration + '%)';
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

type Props = {
  calendarDates: string;
  weekNumber: number;
  dataEvent: [];
  dataHoliday: holidayList[];
  rowMax: number;
};
//-----------------------------------------------------
//WeekEvent処理
//dataEvent,ダウンロードしたデーター
//calendarDates,カレンダーの日曜日から始まる日付
//weekNumber,カレンダーの週間番号（0,1,...7）
//RowMax,最大行数
//行➔横並びのデータRow
//列➔縦並びのデータColum
//-----------------------------------------------------
//
export default function WeekEvent2(props: Props) {
  let result: JSX.Element[] = [];
  if (props.dataEvent.length != 0) {
    result = weekEvent(
      props.calendarDates,
      props.weekNumber,
      props.dataEvent,
      props.dataHoliday,
      props.rowMax,
    ).map((val, index) => {
      return (
        <div key={index} className="ht-row flex2">
          {val}
        </div>
      );
    });
  }
  return <>{...result}</>;
}

// const event3list: EventType[] = [
//   {
//     allDay: true,
//     backgroundColor: 'Olive',
//     description: 'トヨタ',
//     shuitem: '種別,その他',
//     start: '2024-07-28T00:00:00+09:00',
//     title: 'TS3Card増額申し込み/その他',
//   },
//   {
//     allDay: true,
//     backgroundColor: 'None',
//     description: 'お墓の管理費2000',
//     shuitem: '種別,コール',
//     start: '2024-08-01T00:00:00+09:00',
//     title: '払込取扱票届く/コール',
//   },
//   {
//     allDay: true,
//     backgroundColor: 'Olive',
//     shuitem: '種別,その他',
//     start: '2024-08-01T00:00:00+09:00',
//     title: '関西みらい銀行振り込み先整理/その他',
//   },
//   {
//     backgroundColor: 'blue',
//     description: '門真運転免許',
//     shuitem: '種別,研修会議',
//     start: '2024-07-30T16:45:00+09:00',
//     stime_s: '16:45 >17:10',
//     title: '免許証について電話する/研修会議',
//   },
//   {
//     backgroundColor: 'None',
//     shuitem: '種別,コール',
//     start: '2024-08-19T11:00:00+09:00',
//     stime_s: '11:00 >11:30',
//     title: '?訪問看護/コール',
//   },
//   {
//     allDay: true,
//     backgroundColor: 'Olive',
//     catitem: 'カテゴリ,メンテナンス',
//     description: '南野',
//     shuitem: '種別,その他',
//     start: '2024-08-22T00:00:00+09:00',
//     title: '車庫のシャッター/その他',
//   },
// ];
