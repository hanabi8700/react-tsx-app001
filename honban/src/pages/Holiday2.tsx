// import React from 'react'

import { HolidayList } from './Rokuyo';
import * as calc from '~/CalenderLib';
import { CalledCalc300 } from '../../../public/CalledCalc300';
import { CalledCalc400 } from '../../../public/CalledCalc400';

export type Result1 = {
  type: number;
  date: Date[];
  data010: number;
};
interface obj1 {
  [prop: string]: any;
}
const debug9 = false;
const debug8 = false;

export const Holiday2 = (
  specialHolidayTxt: string,
  calendarDateStr: string,
  dSAinFlag = false, //春秋分の日取り込まい
): HolidayList[] => {
  // const calendarDate = new Date(calendarDateStr);
  // const CYear = calendarDate.getFullYear();

  const nextMonth = calc.getFirstLastDayOfMouth(calendarDateStr);
  const nextMonthStr = calc.getDateWithString(nextMonth[3]);
  const prevMonthStr = calc.getDateWithString(nextMonth[2]);

  //先月
  const holidayArrayPrev = Holiday21(
    specialHolidayTxt,
    prevMonthStr,
    dSAinFlag,
  );
  //来月
  const holidayArrayNext = Holiday21(
    specialHolidayTxt,
    nextMonthStr,
    dSAinFlag,
  );
  //今月
  const holidayArray = Holiday21(specialHolidayTxt, calendarDateStr, dSAinFlag);
  const checkA = holidayArrayNext.concat(holidayArrayPrev, holidayArray);
  //マージ重複削除
  const arrayB = calc.objMarge(checkA);
  const result = arrayB as HolidayList[];
  return result;
};

//-----------------------------------------------------
// 祝日計算（国民の休日、振替休日、特別記念日、イベント情報）
//-----------------------------------------------------
// specialHolidayTxtは、monthlyitem の内容と yearly3 の内容
// 202,1,0,正月,302,1から1,12,12,12月寒冷の候（師走）,350,4まで
// specialHolidayTxt:"11,200605,,創立記念日(%N周年),300,1,2022"など
// calendarDateStr:"2025/01/10"
// dSAinFlag:default=false:春秋分の日は取り込まい
// ------------------------------------
export const Holiday21 = (
  specialHolidayTxt: string,
  calendarDateStr: string,
  dSAinFlag = false, //春秋分の日取り込まい
): HolidayList[] => {
  // const calendarDate = new Date(calendarDateStr);
  const calendarDateOne = calc.initDate(calendarDateStr); //1日
  const resultYear = calendarDateOne.getFullYear();
  debug9 && console.log('カレンダー:', calendarDateOne.toLocaleDateString());

  const result2: HolidayList[] = [];
  // 文字列形式で取得するので改行文字で区切って 配列[10]から始まるに変換
  let resultObj = calc.stringToObjectArray(specialHolidayTxt);
  const dSA = getSpringAtumday(resultYear); //春分の日3月、秋分の日9月
  resultObj = dSAinFlag ? resultObj.concat(dSA) : resultObj; //結合
  // debug9 && console.log('Result:', resultObj);
  //   {//形式 ResultObj  xF -> F:振替コード
  //   date: '2024/08/16', string ->日付
  //   name: '祝日4',   string
  //   holiday: true,   boolean--->祝日判断
  //   order: 1101,     number---->30xF,40xF,3400,3405
  //   type: 'holiday', string
  //   option: 0,       number---->回数xxxnn
  //   duration: 4,     number
  //   backgroundColor: 'None', string-->バックグラウンド
  // },

  for (let i = 0; i < resultObj.length; i++) {
    const data = resultObj[i];
    (debug8 || debug9) && console.log('data>>Stat', data, i);

    //施工年チェック
    const status = checkStartEndYear(data, resultYear);
    if (status) {
      //終年or除外年
      debug8 && console.log('終年or除外年');
    } else if (
      data[10][0] !== undefined &&
      data[10][0] !== '#' &&
      data[10][0] !== '0'
    ) {
      if (data[14][0] === '3') {
        // #拡張形式１（日,始年月,加算月,拡張内容,休平日+300+振替コード,種別色,終年,除外年01,除外年02,除外年03,）
        // 15,194801,12,成人の日,301,0,1999
        // 31,1006,1,国民健康保険料(第%-N/10期),310,3
        // debug9 && console.log('F300:', data[13]);
        const result = CalledCalc300(
          data[10], //日にち
          data[11], //始まり年月、回数月
          Number(data[12]), //か月毎
          calendarDateOne,
        );
        //result.type == 302 && data010>=1は年越えの回数あり
        debug9 && console.log('F300_kekka', data, result);
        const holi = data[14][2] != '0' ? true : false;
        // const [num9, year9, month] = calc.getNamYearMonth(data[11]);
        const array1 = calc.getNamYearMonth(data[11]);
        // resultの計算結果をresult2へ追加
        result.date.forEach((date, index) => {
          result2.push({
            date: calc.getDateWithString(date),
            name: data[13],
            holiday: holi,
            order: result.type * 10 + Number(data[14][1]), //(3xx)
            type: 'Holiday',
            option:
              array1[0] || result.type == 302
                ? result.data010 * 100 + (index % (array1[0] ? array1[0] : 100))
                : result.data010 + index * 100,
            option1: Number(data[14]),
            duration: 1,
            backgroundColor: 'None',
          });
        });
      } else if (data[14][0] === '4') {
        // #拡張形式２（週,始年月,曜日,拡張内容,休平日+400+振替コード,種別色,終年,除外年01,除外年02,除外年03,）
        // 2,200001,1,成人の日,401,//1月の第2月曜日
        // 2,202010,1,スポーツのの日,401,,,2020,2021//10月の第2月曜日

        const result = CalledCalc400(
          data[10], //週間
          data[11], //始年月
          data[12], //曜日
          calendarDateOne,
        );
        debug9 && console.log('data400', data, result);
        const holi = data[14][2] != '0' ? true : false;
        // resultの計算結果をresult2へ追加
        result.date.forEach((date) => {
          result2.push({
            date: calc.getDateWithString(date),
            name: data[13],
            holiday: holi,
            order: result.type * 10 + Number(data[14][1]), //(4xx)
            type: 'Holiday',
            option: result.data010,
            option1: Number(data[14]),
            duration: 1,
            backgroundColor: 'None',
          });
        });
      }
    }
  }
  //振替休日,国民の休日チェック
  const result3 = frikaeHoliday(result2); //order:3400
  const result4 = kokuminHoliday(result2, result3); //order:3405
  const holidayArray = result2.concat(result3, result4); //配列結合シャローコピー

  //result2:成人の日から大晦日,result3:振替休日,result4:国民の休日
  debug9 && console.log('解析結果2', result2); //order:3xxx,4xxx
  debug9 && console.log('解析振替3', result3);
  debug9 && console.log('解析国民4', result4);

  // %Y%M%Nの変換
  holidayArray.filter((v) => {
    debug8 && console.log(v.name, v.date, v.option);
    // const sing = /%-N/.test(v.name);
    const aa = v.date.split('/'); //2024/01/20
    const opt1: obj1 = {};
    opt1['Y'] = aa[0];
    opt1['M'] = aa[1];
    opt1['-M'] = Number(aa[1]) - 1 === 0 ? 12 : Number(aa[1]) - 1;
    opt1['N'] = v.option % 100;
    opt1['-N'] = (v.option % 100) + 1;
    const name2 = calc.replaceMMM(v.name, opt1);
    //console.log(name2);
    v.name = name2;
    debug8 && console.log('replaceMMM', name2);
  });

  return holidayArray;
};

//---------------------------
//施工年終了年除外年チェック
//---------------------------
const checkStartEndYear = (
  data: { [x: string]: string }, //祝日リスト配列
  resultYear: number, //カレンダー日付年
) => {
  //始年月
  const [num9, year9, month] = calc.getNamYearMonth(data[11]);
  (debug9 || debug8) &&
    console.log('getNamYearMonth', data[11], data[13], '>', num9, year9, month);
  const stat3 = Number(year9 ? year9 : 0) > resultYear;
  //終年
  const stat1 = Number(data[16] ? data[16] : 9999) < resultYear;
  let stat2 = false;
  for (let i = 0, j = 17; i < 4; i++, j++) {
    stat2 = Number(data[j] ? data[j] : 9999) === resultYear;
    if (stat2) break; //除外年;
  }
  (debug9 || debug8) &&
    console.log('stat:', resultYear, data[16], stat1, stat2, stat3);
  const status = stat1 || stat2 || stat3;
  return status;
};

//
//-----------------------------------------------------
//振替休日チェック(前日が日曜日かつ祝日)月曜日
//1973年4月以降に適用します。
//単純に日曜日に祝日があると、翌日以降の祝日でない日を振替休日とします。
//2006年以前の振替休日は厳密には、祝日が日曜なら翌日が休みとなりますが、
//2007年以降の計算方法でも問題ありません。
//-----------------------------------------------------
const frikaeHoliday = (holidayLists: HolidayList[]) => {
  const result3: HolidayList[] = [];
  holidayLists.forEach((el) => {
    const stat1 =
      el.holiday == false || calc.getDateDiff('1973/04/01', el.date) < 0;
    const stat2 = calc.stringToDate(el.date).getDay() != 0;
    if (stat1 || stat2) {
      //
    } else {
      //祝日&&日曜日
      //const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      let dtStr0 = el.date;
      for (let i = 0; i < 7; i++) {
        const dt1 = calc.stringToDate(el.date, i + 1);
        const dtStr1 = calc.getDateWithString(dt1);
        const index1 = holidayLists.findIndex((data) => data.date === dtStr1);
        dtStr0 = index1 > -1 ? dtStr0 : dtStr1;
        if (index1 === -1) break;
      }
      if (dtStr0) {
        result3.push({
          date: dtStr0,
          name: '振替休日',
          order: 3400, //(34xx)
          type: 'Holiday',
          holiday: true,
          option: 0,
          duration: 1,
          backgroundColor: 'None',
        });
      }
    }
  });
  return result3;
};

//
//-----------------------------------------------------
//国民の休日
//1986年以降に適用します。
//特定の日について、前日が祝日で、翌日が祝日で、
//当日が日曜日でも祝日でもない場合、その日は国民の休日です。
//-----------------------------------------------------
const kokuminHoliday = (
  holidayLists: HolidayList[],
  holidayLists0: HolidayList[],
) => {
  const result4: HolidayList[] = [];
  const holidayArray2 = holidayLists0.concat(holidayLists);
  debug9 && console.log('Holidaylist', holidayArray2);
  holidayArray2.forEach((el) => {
    const stat1 =
      el.holiday == false && calc.getDateDiff('1986/04/01', el.date) >= 0;
    if (stat1) {
      //検査日が祝日でない
      //
    } else {
      //検査日+1が祝日リストにある、祝日である>=0
      const dt1 = calc.stringToDate(el.date, 1); //検査日+1
      const dtStr1 = calc.getDateWithString(dt1);
      const notSun1 = dt1.getDay() != 0; //日曜日以外
      const index1 = holidayArray2.findIndex(
        (data) => data.date === dtStr1 && data.holiday === true,
      );
      //検査日+2が祝日リストにある,祝日である>=0
      const dt2 = calc.stringToDate(el.date, 2); //検査日+2が祝日か
      const dtStr2 = calc.getDateWithString(dt2);
      const index2 = holidayArray2.findIndex(
        (data) => data.date === dtStr2 && data.holiday == true,
      );
      //検査結果例
      //date_koku: 2019/05/01 2019/05/02 2019/05/03
      //Date->index 2019/05/01 -1 7 true   =>ok
      //date_koku: 2019/05/03 2019/05/04 2019/05/05
      //Date->index 2019/05/03 12 8 true   =>ng
      //date_koku: 2019/05/05 2019/05/06 2019/05/07
      //Date->index 2019/05/05 -1 -1 true  =>ng
      //date_koku: 2019/05/04 2019/05/05 2019/05/06
      //Date->index 2019/05/04 8 -1 false  =>ng
      //date_koku: 2019/04/29 2019/04/30 2019/05/01
      //Date->index 2019/04/29 -1 4 true   =>ok
      //199805check
      debug9 && console.log('date_koku:', el.date, dtStr1, dtStr2);
      debug9 && console.log('Date->index', el.date, index1, index2, notSun1);
      if (index2 > -1 && notSun1 && index1 === -1) {
        result4.push({
          date: calc.getDateWithString(dt1),
          name: '国民の休日',
          holiday: true,
          order: 3405, //(34xx)
          type: 'Holiday',
          option: 0,
          duration: 1,
          backgroundColor: 'None',
        });
      }
    }
  });
  return result4;
};
//-----------------------------------------------------
//春分の日3月、秋分の日9月について
// 10: 'n', 11: '3', 12: '12', 13: '春分の日', 14: '300'
// 10: 'm', 11: '9', 12: '12', 13: '秋分の日', 14: '300'
//-----------------------------------------------------
const getSpringAtumday = (resultYear: number) => {
  const dtNum = calc.sprinAutomDay(resultYear);
  let text1 = String(dtNum[0]) + ',3,12,春分の日,301\n';
  text1 = text1 + String(dtNum[1]) + ',9,12,秋分の日,301';
  const resultObj = calc.stringToObjectArray(text1);
  // console.log(dtNum, resultObj);
  return resultObj;
};

//
// 形式：
// #'''
// #月極固定項目（記念日など）の設定
// #項目毎に改行すること
// #基本形式０（日,,,内容）は機能しません
// #拡張形式１（日,始年月,加算月,拡張内容,休平日+300+振替コード,種別色,終年,除外年01,除外年02,除外年03,）
// #拡張形式２（週,始年月,曜日,拡張内容,休平日+400+振替コード,種別色,終年,除外年01,除外年02,除外年03,）
// #-----------------------------------------------------------------------
// #項目（休平日）休日=1／平日=0の背景色で表示します、注意振替対象ではありません
// #項目（休平日）祝日=2は休日背景色で表示します、振替対象です
// #項目 (日) １００位は、繰り返し期間です
// #項目（日,内容）のほかは、省略できます、その場合0指定と同じ
// #項目（始年月）始年月から拡張内容を表示します、月のみOK,Zero=1、KKMMでKK(回数<12)とMM(月)組み合わせOK
// #項目（加算月）始年月からの幾ヶ月毎を指定します、省略は12ヶ月,Zero=12ごとになります
// #項目（拡張内容）%Y,%Mの年、月の置き換え処理（対象月%-1M[年%-1Y]は、数値+1は+1加算、-1は-1減算した月[年]）
// #項目（拡張内容）%N,%-Nの回数置き換え処理（300,400指定時のみ、加算月毎の回数、%Nは０から数えた回数、%-Nは1から数えた回数を返す）
// #項目（週,月,曜日）その月の第幾週の曜日[0:日曜1:月曜..6:土曜日]が対象になります、月省略か 0は毎月、
// #項目 (週) 週の0指定は第1週、7指定は毎週、8または9指定はそれに続く数値一桁が加算数値になります。8は正の値、9は負の値
// #項目 (週) 週の12345は、7指定の同じ毎週
// #項目（終年）終年以降は、表示しません
// #項目（振替コード:10）指定日が日曜日土曜日祭日ならその次の日の以降の平日に振り替え
// #項目（振替コード:20）指定日が日曜日土曜日祭日ならその前の日の以前の平日に振り替え
// #項目（振替コード:30）指定日が日曜日祭日ならその次の日の以降の土曜日平日に振り替え
// #項目（振替コード:40）指定日が日曜日祭日ならその前の日の以前の土曜日平日に振り替え
// #項目（振替コード:50）カレンダーの今月の一言の項目に内容が表示されます
// #項目（振替コード:60）指定日が日曜日土曜日祭日なら対象外とする（平日のみ）
// #項目（振替コード:70）指定日が祭日ならその次の7日以降の土曜日平日に振り替え、日曜日は振替えない
// #項目（振替コード:80）指定日が祭日ならその前の7日以前の土曜日平日に振り替え、日曜日は振替えない
// #例（10,,,交通費提出締め）毎月10日時間指定なし内容を表示
// #例（11,200605,,創立記念日(%N周年),300）毎年5月11日に日曜祭日振り替えなしで2006年から幾回目かを表示
// #例（6,200605,1,電気代振込%-1M月分,310）毎月6日に前月分表示します、2006年5月前は表示しません
// #例（1,2,12,%-Y年分確定申告の月です(%-12N期),350）毎年2月メッセージ項目に前年の表示
// #例（1,0,2,空き缶空き瓶収集日,400）毎月第1火曜日に表示
// #例（3,0,1,営業会議,410）毎月第3月曜日ですが祭日の場合は次の平日に振替えます
// #例（2,5,0,母の日,400,1）毎年5月第2日曜日
// #例 (6,404,202,会計講座(第%-N/4期),400,3) 毎年4月(04)末週(6)の火曜日(02)とその2ヶ月(2xx)ごとに4回(4xx)まで
// #例 (31,405,2,固定資産税(第%-2N/4期),310,3) 毎年5月(05)末日(31)とその2ヶ月(2)ごとに4回(4xx)まで
// #例 (313,8,0,お盆,300,1) 毎年８月１３日から３日間(3xx)はお盆を表示します,この場合300,400のみで振替コードは無視されます
// #例 (202,1,0,正月,302,1) 毎年１月２日から２日間(3xx)は正月を表示します,この場合300,400のみで振替コードは無視されます
// #例 (7,0,36,ごみ収集日,400) 毎月(0)毎週(7)水土曜(36)にごみ収集日を表示します,この場合300,400のみで振替コードは無視されます
// #例 (13,0,2,缶瓶収集日,400) 毎月(0)第1,3週(13)火曜日(2)に缶瓶収集日を表示します,この場合300,400のみで振替コードは無視されます
// #例 (814,11,4,ブラックフライデー,400) 毎11月(11)第4週(4)木曜日(4)にブラックフライデーを表示します,この場合300,400のみで振替コードは無視されます
// #'''
