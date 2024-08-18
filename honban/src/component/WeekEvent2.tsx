import * as calc from '~/CalenderLib';
import { holidayList } from '../pages/Rokuyo';
import { stockedDaysType } from '~/CalenderStack';
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
  id?: number;
}
interface EventType2 extends EventType {
  name?: string;
  date?: string;
}
interface holidayList2 extends holidayList {
  title?: string;
}
const debug9 = true;

// 1 ~ 9 までの乱数を生成関数
// const numRandom = () => Math.floor(Math.random() * 1000) + 1;

//-----------------------------------------------------
//同じ日付を配列ごとに集める...週間ごと
//datalist[[{Date0a},{Date0b}...{Date0e}],[{Date1a}],...[{Date7a}]]
//datalist=[[日],[月],[火],[水],[木],[金],[土]] =
//[Array(0), Array(1), Array(2), Array(3), Array(0), Array(0), Array(1)]
//----------------------------------------------------
//表示する１週間にまとめる

export const WeekEvent3 = (
  weekdayArray: {
    id: number;
    dateOnData: number;
    date: string;
    inMonth: number;
  }[],
  stockedDays: stockedDaysType[],
) => {
  // debug9 && console.log('WeekEvent', weekdayArray[0]);

  // const datalist: EventType[][] = []; //Array[行][列]
  // weekdayArray_obj1{id: 0, dateOnData: 25, date: '2024/08/25', inMonth: 1}
  const oneWeekData: number[][] = [];
  const oneWeekDataStack: number[][] = [];
  for (const obj1 of weekdayArray) {
    //obj1.dateでまとめる
    const dobj = stockedDays.find((d) => d.date === obj1.date);
    oneWeekDataStack.push(dobj ? (dobj?.stack as []) : []);
    oneWeekData.push(dobj ? (dobj?.state as []) : []);
  }
  //oneWeekData:[un,un,un,un,409101,725401,un]
  // debug9 && console.log('datalist', oneWeekData, oneWeekDataStack);
  return [oneWeekData, oneWeekDataStack];
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
  dataEvent: EventType2[],
  dataHoliday: holidayList2[],
  stockedDays: stockedDaysType[],
  count = 1, //行数
) => {
  // let stockedDays: stockedDaysType[] = []; //各日のイベント専有状態
  //stockedDays = [{ date: '2022-03-12', stack: Array(4), stat: Array(4), width: 95 },];
  const weekdayArray = calc.getWeekDay7(ctDate, weeksNum);
  // const datalist: EventType[][] = []; //Array[行][列]
  //5行7列Array=[[行１],[],...[[列１],[],...[]]]
  //同じ日付を配列ごとに集める  datalist[[{Date0a},{Date0b}...{Date0e}][{Date1a}]...[{Date7a}]]
  const [oneWeekData, oneWeekDataStack] = WeekEvent3(weekdayArray, stockedDays);
  // dataHoliday,
  //oneWeekData=[[日],[月],[火],[水],[木],[金],[土]] =↓
  //[Array(2), Array(0), Array(0), Array(1), Array(2), Array(1), Array(0)]
  //1行目に祝日あり？

  const output: JSX.Element[][] = [];

  //datalist=[[日1,...日n],[月1,...月n],...[土1,...土n]]
  debug9 && console.log('WeeklyEvent...Start', weekdayArray[0]);
  debug9 && console.log('datalist', oneWeekData, oneWeekDataStack);
  for (let i = 0; i < count; i++) {
    let output3: JSX.Element[] = [];

    //１行分aa=[日i,月i,火i,水i,木i,金i,土i]*count
    const oneRowData: number[] = calc.getRow2DimArray(oneWeekData, i);
    const oneRowDataStack: number[] = calc.getRow2DimArray(oneWeekDataStack, i);
    //
    const aa = oneRowData.map((d, index) => {
      debug9 && console.log('行番号', i, d, oneRowDataStack[index]);
      if (d === undefined) return d;
      const tt = Math.floor(d / 100);
      const aa1 = dataEvent.find((v) => v.id === tt);
      const aa2 = dataHoliday.find((v) => v.id === tt);
      const aa3 = aa1 ? aa1 : aa2 ? aa2 : undefined;
      // debug9 && console.log('index:', weekdayArray[index].date, aa3);
      return aa3;
    });

    //------------------------------------------------------------------
    const bb = aa.map((d, index) => {
      if (d && d.backgroundColor === 'None') {
        d.backgroundColor = 'rgba(0, 0, 128, 0.3)';
      } else if (d === undefined) {
        d = {
          //定義されていません、作成する
          duration: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          title: 'd',
          date: weekdayArray[index].date,
        };
      }
      //-------------------------------------------------
      d.duration = d.duration ? d.duration : 1;
      if (d.date === weekdayArray[index].date) return d;
      return undefined;
    });
    debug9 && console.log(' bb:', bb);

    for (let i = 0; i < bb.length; i++) {
      if (bb[i] !== undefined) {
        const d = bb[i] as EventType2 | holidayList2;
        d.duration = d.duration ? d.duration : 1;
        const title = d.title ? d.title : d.name;
        const lengthOut = 'calc(' + (100 / 7) * d.duration + '%)';
        const output2 = (
          <div
            // key={index}
            className="calendar-event3"
            style={{
              backgroundColor: d.backgroundColor,
              overflow: 'hidden',
              flexBasis: lengthOut,
            }}
          >
            {title}
          </div>
        );
        output3 = output3.concat(output2);
      }
    }
    //7日分1行 outpuy3:[0 =(7) [{…}, {…}, {…}, {…}, {…}, {…}, {…}]....]
    output.push(output3); //５行分集める
  }
  //output:(5) [Array(5), Array(6), Array(3), Array(7), Array(7)

  debug9 && console.log('WeeklyEvent...End');

  return output;
};

type Props = {
  ctDate: string; //カレンダー月のはじめ
  weekNumber: number; //カレンダー週番号
  dataEvent: [];
  dataHoliday: holidayList2[];
  stockedDays: stockedDaysType[]; //並び
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
      props.ctDate,
      props.weekNumber,
      props.dataEvent,
      props.dataHoliday,
      props.stockedDays,
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
