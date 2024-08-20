import * as calc from '~/CalenderLib';
import { holidayList } from '../pages/Rokuyo';

interface Props {
  ctDate: string;
  weeksNum: number;
  dataset: holidayList[];
}

//-----------------------------------------------------
// 1週間のフォアグラウンド関数
// ctDate:"日付",weeksNum:週番号,dataset:休日オブジェクト
//-----------------------------------------------------
export default function WeekDayFg({ ctDate, weeksNum, dataset }: Props) {
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
    const array1 = calc.joinList(newDataset, 'name'); //nameだけ取り出す
    //--------------------------------------
    newDataset = dataset.filter((data) => {
      return data.date === d.date && data.holiday && data.order >= 999;
      //祝日 dataset 1Day
    });
    const array2 = calc.joinList(newDataset, 'name'); //nameだけ取り出す
    const newArray = array1.concat(array2); //結合
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
  return <>{output}</>;
}
