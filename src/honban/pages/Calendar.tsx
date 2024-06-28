//import React from 'react';
import { useCallback, useState } from 'react';
// import * as calc from '../../../public/CalenderLib';
import * as calc from '~/CalenderLib';
import './Calendar.css';

type holidayList = {
  date: string;
  name: string;
  holiday: boolean;
  order: number;
}[];
// １週間のバックグラウンド関数
const weekDayBG = (ctDate: string, weeksNum: number, dataset: holidayList) => {
  const weekdayArray = calc.getWeekDay7(ctDate, weeksNum);
  //today.format="2024/06/05"
  // const newDataset = dataset.findIndex((data) => data.name === 'bbb');

  let newDataset = -1;
  return weekdayArray.map((d, index) => {
    let cName = 'day flex1 ';
    newDataset = dataset.findIndex(
      (data) => data.date === d.date && data.holiday,
    );
    cName += newDataset > 0 ? 'holiday ' : '';
    cName += d.date === dataset[0].date ? 'today ' : '';
    cName += d.inMonth ? 'dayly ' : 'outmonth ';
    return <div key={index} className={cName}></div>;
  });
};
// 1週間のフォアグラウンド関数
const weekDayFG = (ctDate: string, weeksNum: number, dataset: holidayList) => {
  const weekdayArray = calc.getWeekDay7(ctDate, weeksNum);
  //today.format="2024/06/05"
  // let newDataset:string[];
  const output2List = weekdayArray.map((d, index) => {
    const bt = <button type="button">{d.dateOnData}</button>;
    //newDataset = dataset.findIndex((data) => data === d.date);
    let newDataset = dataset.filter((data, index) => {
      return data.date === d.date && index != 0 && data.order < 100;
      //12節句
    });
    const array1 = calc.joinList(newDataset);
    //
    newDataset = dataset.filter((data) => {
      return data.date === d.date && data.holiday && data.order >= 100;
      //祝日
    });
    const array2 = calc.joinList(newDataset);
    const newArray = array1.concat(array2);

    const sp = <span>{newArray.join()}</span>;
    // <span>友引 芒種</span>
    return (
      <div key={index} className="day flex1">
        {bt}
        {sp}
      </div>
    );
  });
  const output = (
    <div className="ht-row flex2">
      {output2List.map((d) => {
        return d;
      })}
    </div>
  );
  return output;
};
// 月、年、今日ボタン処理
export const useCounter = (initialValue = 0) => {
  const [countx, setCount] = useState(initialValue);

  const incrementM = useCallback(() => setCount((x) => x + 1), []);
  const decrementM = useCallback(() => setCount((x) => x - 1), []);
  const incrementY = useCallback(() => setCount((x) => x + 12), []);
  const decrementY = useCallback(() => setCount((x) => x - 12), []);

  const reset = useCallback(() => setCount(initialValue), [initialValue]);

  return { countx, incrementM, decrementM, incrementY, decrementY, reset };
};

//-------------------
// カレンダー本体
//-------------------
export const Calendar = () => {
  const { countx, incrementM, decrementM, incrementY, decrementY, reset } =
    useCounter();
  //dayOfWeeks 日月～土
  const weekDays = calc.getWeekday() as string[];

  const date5 = new Date();
  const calendarDate = calc.getDateWithString(
    calc.getAddMonthDate2(calc.getDateWithString(date5), countx, true) as Date,
  );

  const calendarDates = calc.CalenderLib(calendarDate);
  const ddYear = calendarDates.currentYear as number;
  const ddMonth = calendarDates.currentMonth as number;
  const ddWareki = calc.JapaneseCalendar(calendarDates.firstDate as Date);

  // index 0:きょう  1~n:祝日
  const holidayList = [
    {
      date: calc.getDateWithString(calendarDates.today as Date),
      name: 'today',
      holiday: false,
      order: 0,
    },
    {
      date: '2024/06/20',
      name: '友引',
      holiday: false,
      order: 10,
    },
    {
      date: '2024/06/20',
      name: '芒種',
      holiday: false,
      order: 10,
    },
    {
      date: '2024/06/13',
      name: '祝日',
      holiday: true,
      order: 401,
    },
  ];

  // -----------------------------Display-Calendar-------------------------------------
  return (
    <>
      {/* {console.log("fee")} */}
      <div className="calendar-wrappe">
        <div className="bt_hedder">
          <form action="" className="nav-calendar" name="nav-calendar">
            <button className="bt_preyear" type="button" onClick={decrementY}>
              前年
            </button>
            <button
              className="bt_prmonth"
              type="button"
              onClick={decrementM}
              // onClick={() => handleOnClick('prevMonth')}
            >
              前月
            </button>
            <span className="bt_ddyear">{ddYear}</span>
            <span className="bt_ddmonth">{ddMonth}月</span>
            <span className="bt_ddwareki">({ddWareki})</span>
            <span>{countx}</span>
            <button
              className="bt_postmonth"
              type="button"
              // onClick={() => handleOnClick('nextMonth')}
              onClick={incrementM}
            >
              次月
            </button>
            <button
              className="bt_postyear"
              type="button"
              onClick={incrementY}
              // onClick={() => handleOnClick('nextYear')}
            >
              次年
            </button>
            <button
              className="bt_posttoday"
              type="button"
              onClick={reset}
              // onClick={() => handleOnClick('nextYear')}
            >
              今日
            </button>
            <input className="bt_today" type="date" name="birth" />
            <button className="bt_idou" type="button">
              移動
            </button>
            {/* <!-- 直前のページに戻る --> */}
            {/* <input type="button" onClick={history.back()} value="戻る" /> */}
          </form>
        </div>
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
            <div className="ht-row-monthly possec flex2 date3">
              <div className="ht-row-bg posabs flex2">
                {/* 背景色 */}
                {weekDayBG(calendarDates.firstDate as string, 0, holidayList)}
                {/* <div className="day flex1 holiday today"></div> */}
              </div>
              <div className="ht-row-container possec2">
                {weekDayFG(calendarDates.firstDate as string, 0, holidayList)}

                {/* <div className="ht-row flex2">
                  <div className="day flex1">
                    <button type="button">1</button>
                    <button type="submit" id="huge" name="huge">
                      huge
                    </button>
                  </div>
                  <div className="day flex1">
                    <button type="button">2</button>
                  </div>
                  <div className="day flex1">
                    <button type="button">3</button>
                  </div>
                  <div className="day flex1">
                    <button type="button">4</button>
                    <span>友引 芒種</span>
                  </div>
                  <div className="day flex1">
                    <button type="button">5</button>
                  </div>
                  <div className="day flex1">
                    <button type="button">6</button>
                  </div>
                  <div className="day flex1">
                    <button type="button">7</button>
                  </div>
                </div>
                <div className="ht-row flex2">
                  <div
                    className="ht-row-segment"
                    style={{ flexBasis: '14%' }}
                  ></div>
                  <div
                    className="ht-row-segment calendar-event3"
                    style={{
                      backgroundColor: '#4a794a',
                      overflow: 'hidden',
                      flexBasis: '28%',
                    }}
                  >
                    運動公園 Flex 123456789
                  </div>
                  <div className="ht-row-segment"></div>
                </div>
                <div className="ht-row segment flex2">
                  <div
                    className="ht-row-segment"
                    style={{ flexBasis: '29%' }}
                  ></div>

                  <div
                    className="calendar-event3"
                    style={{
                      backgroundColor: '#7c25ee',
                      overflow: 'hidden',
                      flexBasis: '54%',
                    }}
                  >
                    案内ウェブサイト~オンラインショップ
                  </div>
                </div> */}
              </div>
            </div>
            <div className="ht-row-monthly possec flex2 date3">
              <div className="ht-row-bg posabs flex2">
                {weekDayBG(calendarDates.firstDate as string, 1, holidayList)}
              </div>
              <div className="ht-row-container possec2">
                {weekDayFG(calendarDates.firstDate as string, 1, holidayList)}
              </div>
            </div>
            <div className="ht-row-monthly possec flex2 date3">
              <div className="ht-row-bg posabs flex2">
                {weekDayBG(calendarDates.firstDate as string, 2, holidayList)}
              </div>
              <div className="ht-row-container possec2">
                {weekDayFG(calendarDates.firstDate as string, 2, holidayList)}
              </div>
            </div>
            <div className="ht-row-monthly possec flex2 date3">
              <div className="ht-row-bg posabs flex2">
                {weekDayBG(calendarDates.firstDate as string, 3, holidayList)}
              </div>
              <div className="ht-row-container possec2">
                {weekDayFG(calendarDates.firstDate as string, 3, holidayList)}
              </div>
            </div>
            <div className="ht-row-monthly possec flex2 date3">
              <div className="ht-row-bg posabs flex2">
                {weekDayBG(calendarDates.firstDate as string, 4, holidayList)}
              </div>
              <div className="ht-row-container possec2">
                {weekDayFG(calendarDates.firstDate as string, 4, holidayList)}
              </div>
            </div>
            <div className="ht-row-monthly possec flex2 date3">
              <div className="ht-row-bg posabs flex2">
                {weekDayBG(calendarDates.firstDate as string, 5, holidayList)}
              </div>
              <div className="ht-row-container possec2">
                {weekDayFG(calendarDates.firstDate as string, 5, holidayList)}
              </div>
            </div>
            <div className="ht-row-monthly possec flex2 date3">
              <div className="ht-row-bg posabs flex2">
                {weekDayBG(calendarDates.firstDate as string, 6, holidayList)}
              </div>
              <div className="ht-row-container possec2">
                {weekDayFG(calendarDates.firstDate as string, 6, holidayList)}
              </div>
            </div>
            <div className="ht-row-monthly possec flex2 date3">
              <div className="ht-row-bg posabs flex2">
                {weekDayBG(calendarDates.firstDate as string, 7, holidayList)}
              </div>
              <div className="ht-row-container possec2">
                {weekDayFG(calendarDates.firstDate as string, 7, holidayList)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
