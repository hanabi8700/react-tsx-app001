//import React from 'react';
import { useCallback, useState } from 'react';
import * as calc from '~/CalenderLib';
import './Calendar.css';
import Holiday from './Holiday';

type holidayList = {
  date: string;
  name: string;
  holiday: boolean;
  order: number;
}[];
// １週間のバックグラウンド関数
// ctDate:"日付",weeksNum:週番号,dataset:休日オブジェクト
const weekDayBG = (ctDate: string, weeksNum: number, dataset: holidayList) => {
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
// 1週間のフォアグラウンド関数
// ctDate:"日付",weeksNum:週番号,dataset:休日オブジェクト
const weekDayFG = (ctDate: string, weeksNum: number, dataset: holidayList) => {
  const weekdayArray = calc.getWeekDay7(ctDate, weeksNum);
  //today.format="2024/06/05"
  // let newDataset:string[];
  const output2List = weekdayArray.map((d, index) => {
    const bt = (
      <button type="button" name={d.date}>
        {d.dateOnData}
      </button>
    ); //日にち
    //newDataset = dataset.findIndex((data) => data === d.date);
    let newDataset = dataset.filter((data) => {
      return data.date === d.date && 9 < data.order && data.order < 100;
      //六曜（ろくよう、りくよう）dataset 1Day
    });
    const array1 = calc.joinList(newDataset); //nameだけ取り出す
    //
    newDataset = dataset.filter((data) => {
      return data.date === d.date && data.holiday && data.order >= 100;
      //祝日 dataset 1Day
    });
    const array2 = calc.joinList(newDataset); //nameだけ取り出す
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

  //--------------------------------------------------------
  // date.toLocaleDateString(); // 2020/5/13
  //--------------------------------------------------------
  const calendarDates = calc.CalenderLib(calendarDate);
  const ddYear = calendarDates.currentYear;
  const ddMonth = calendarDates.currentMonth;
  const ddWareki = calc.JapaneseCalendar(calendarDates.firstDate);

  // index 0:きょう  1~n:祝日、六曜
  let holidayList = [
    {
      date: calc.getDateWithString(calendarDates.today),
      name: 'today',
      holiday: false,
      order: 0,
    },

    // {
    //   date: '2024/07/13',
    //   name: '祝日',
    //   holiday: true,
    //   order: 401,
    // },
  ];

  // ホリデイ祝日、六曜、特別記念日など
  const result2 = Holiday(calendarDate, holidayList);
  holidayList = holidayList.concat(result2); //配列結合


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
                {weekDayFG(
                  calendarDates.firstDateStr as string,
                  0,
                  holidayList,
                )}

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
              </div>
            </div>
            {/* End */}
          </div>
        </div>
      </div>
    </>
  );
};
