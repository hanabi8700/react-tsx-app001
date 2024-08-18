// import * as calc from '~/CalenderLib';
import { holidayList } from '../pages/Rokuyo';
import WeekEvent2 from './WeekEvent2';
import WeekDayFg from './WeekDayFg';
import WeekDayBg from './WeekDayBg';
import { stockedDaysType } from '~/CalenderStack';
//rsf
interface Props {
  ctDate: string;
  weeksNum: number;
  dataEvent: [];
  holidayList: holidayList[];
  stockedDays: stockedDaysType[];
}
//-----------------------------------------------------
//1週間のカレンダー表示
//ctDate,カレンダーの日曜日から始まる日付
//weekNumber,カレンダーの週間番号（0,1,...7）
//holidayList,六曜、祝祭日のデーター
//dataEvent,ダウンロードしたデーター
//-----------------------------------------------------
export default function WeekDay({
  ctDate,
  weeksNum,
  dataEvent,
  holidayList,
  stockedDays,
}: Props) {
  return (
    <div className="ht-row-monthly possec flex2 date3">
      <div className="ht-row-bg posabs flex2">
        {/* 背景色 */}
        <WeekDayBg
          ctDate={ctDate}
          weeksNum={weeksNum}
          dataset={holidayList} //土日祝背景色
        ></WeekDayBg>
      </div>
      <div className="ht-row-container possec2">
        {/* 日付行 */}
        <WeekDayFg
          ctDate={ctDate}
          weeksNum={weeksNum}
          dataset={holidayList} //六曜、24節気
        ></WeekDayFg>
        {/* イベント行 */}
        <WeekEvent2
          ctDate={ctDate}
          weekNumber={weeksNum}
          dataEvent={dataEvent} //イベントデーター
          dataHoliday={holidayList} //祝祭日
          stockedDays={stockedDays} //枠内並び
          rowMax={5}
        ></WeekEvent2>
      </div>
    </div>
  );
}
