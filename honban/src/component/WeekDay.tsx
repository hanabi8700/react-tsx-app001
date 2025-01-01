// import * as calc from '~/CalenderLib';
import { HolidayList } from '../pages/Rokuyo';
import WeekEvent2 from './WeekEvent2';
import WeekDayFg from './WeekDayFg';
import WeekDayBg from './WeekDayBg';
import { stockedDaysType } from '~/CalenderStack';
//rsf
interface Props {
  ctDate: string;
  weeksNum: number;
  dataEvent: [];
  holidayArray: HolidayList[];
  stockedDays: stockedDaysType[];
}
//-----------------------------------------------------
//1週間のカレンダー表示
//ctDate,カレンダーの日曜日から始まる日付
//weekNumber,カレンダーの週間番号（0,1,...7）
//holidayArray,六曜、祝祭日のデーター
//dataEvent,ダウンロードしたイベントデーター
//-----------------------------------------------------
////六曜（ろくよう、りくよう）dataset 1Day  (order:10=>29)
////祝日 dataset 1Day (order:=>999)
//-----------------------------------------------------
export default function WeekDay({
  ctDate,
  weeksNum,
  dataEvent,
  holidayArray,
  stockedDays,
}: Props) {
  return (
    <div className="ht-row-monthly possec flex2 date3">
      <div className="ht-row-bg posabs flex2">
        {/* 背景色 */}
        <WeekDayBg
          ctDate={ctDate}
          weeksNum={weeksNum}
          dataset={holidayArray} //土日祝背景色つける
        ></WeekDayBg>
      </div>
      <div className="ht-row-container possec2">
        {/* 日付行 */}
        <WeekDayFg
          ctDate={ctDate}
          weeksNum={weeksNum}
          dataset={holidayArray} //六曜、24節気文字つける
        ></WeekDayFg>
        {/* イベント行 */}
        <WeekEvent2
          ctDate={ctDate}
          weekNumber={weeksNum}
          dataEvent={dataEvent} //イベントデーター
          dataHoliday={holidayArray} //祝祭日
          stockedDays={stockedDays} //枠内並び
          rowMax={5} //最大項目数（行数）
        ></WeekEvent2>
      </div>
    </div>
  );
}
