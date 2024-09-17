import * as calc from '~/CalenderLib';
import { HolidayList } from '../pages/Rokuyo';
interface Props {
  ctDate: string;
  weeksNum: number;
  dataset: HolidayList[];
}
//-----------------------------------------------------
// １週間のバックグラウンド関数
// ctDate:"日付",weeksNum:週番号,dataset:休日オブジェクト
/* <div className="day flex1 holiday today"></div> */
//-----------------------------------------------------
export default function WeekDayBg({ ctDate, weeksNum, dataset }: Props) {
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
}
