export default class HanalibC01 {
  // ロード：import hanaLibC01 from '../../../hanalib/hanalibC01.js';
  // 起動：let hanaFunc = new hanalibC01();
  // 起動：this.hanaFunc = new hanaLibC01();
  // 呼び出し let abs = this.hanaFunc.eightNumStringToDate(20220505);
  constructor() {
    // this.init();
  }
  hasProperty(obj, key) {
    return !!obj && Object.prototype.hasOwnProperty.call(obj, key);
  }
  /**
   * @param  {int} begin
   * @param  {int} end
   * @param  {int} interval=1
   */
  *range(begin, end, interval = 1) {
    for (let i = begin; i < end; i += interval) {
      yield i;
    }
  }
  /**
   * 等差数列のn回のリスト（配列）返す
   * @param  {int} a1  初項
   * @param  {int} n  回数
   * @param  {int} d  公差
   * @param  {int} offset  =0 n-offsetの値（if used）
   * @param  {int} a0   =30 の場合、a30を初項(a1)とします
   * @return {array} 配列を返す
   */
  nProgressList(a1, n, d, offset = 0, a0 = 0) {
    // 等差数列のn回のリスト（配列）返す
    //   初項(a1),回数(n),公差(d)
    //   a1 + (n - 1)d
    // arithmetical progression
    // a0 = 30 の場合、a30を初項(a1)とします
    //let ans_range = this.hanaFunc.nProgressList(0, 5, 9, 0, 30);
    //ans_range (5) [261, 270, 279, 288, 297]
    // let ans_range = this.hanaFunc.nProgressList((30 - 1) * 9, 5, 9);
    // ans_range (5) [261, 270, 279, 288, 297]
    // let ans_range = this.hanaFunc.nProgressList((1 - 1) * 9, 5, 9);
    // ans_range (5) [0, 9, 18, 27, 36]

    let ans_range = [];
    d = d > 0 ? d : 1;
    a1 = a0 ? (a0 - 1) * d : a1;
    for (let i of this.range(a1, a1 + n * d + offset, d)) {
      ans_range.push(i);
    }
    return ans_range;
  }

  // ------------------------------
  // カレンダー関連
  // ------------------------------

  /**
   * カレンダーの一月分を配列にして返す [ 0:[{date:Date_Object}, ...{}], ... n:[] ]
   * @param  {} dateObject 作りたい月のDate()を与える
   */
  getArrayCalendar(dateObject) {
    // カレンダーの一月分を配列にして返す [ 0:[{date:Date_Object}, ...{}], ... n:[] ]
    const cdDays = this.calendarMonthlyDays(dateObject);
    // console.log('calendarMonthlyDays', cdDays);
    const diffDays = cdDays.diffDays;
    const calendarFirstDay = cdDays.calendarFirstDay;

    let dayNumber = new Date(calendarFirstDay.getTime()); // 複写(DeepCopy)
    const weekRowNumber = Math.ceil(diffDays / 7); //箱の行数
    const calendars = [];

    for (let index = 0; index < weekRowNumber; index++) {
      let weekRow = [];
      //foreachは速い
      [...Array(7)].forEach(() => {
        weekRow.push({
          date: new Date(dayNumber.getTime()),
        });
        dayNumber.setDate(dayNumber.getDate() + 1);
      });
      calendars.push(weekRow);
    }
    return calendars;
  }
  /**
   * ひと月のカレンダーで表示する第1枠と第42枠の日付を返す
   * @param  {} dateObject 作りたい月のDate()を与える
   */
  calendarMonthlyDays(dateObject) {
    // For DateObject
    // > new Date(2022,4,1).toLocaleDateString()//'2022/5/1'
    // > new Date(2022,5,0).toLocaleDateString()//'2022/5/31'
    const date = new Date(dateObject.getTime()); // その月の日時複写
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const firstDate = new Date(year, month - 1, 1); //month月の1日
    const monthLastDate = new Date(year, month, 0); // month月の最終日
    //日枠6行の最終日
    const lastDate = new Date(firstDate.getFullYear(), firstDate.getMonth(), 36);

    const calendarFirstDay = new Date(firstDate.getTime()); // 複写
    const calendarLastDay = new Date(lastDate.getTime()); // 複写
    const firstDay = calendarFirstDay.getDay(); //first day of the week(曜日)
    const lastDay = calendarLastDay.getDay(); //last day of the week(曜日)

    calendarFirstDay.setDate(calendarFirstDay.getDate() - firstDay); //最初の日
    calendarLastDay.setDate(calendarLastDay.getDate() + (6 - lastDay)); //最後の日
    const differenceMilliseconds = calendarLastDay - calendarFirstDay;
    const diffDays = parseInt(differenceMilliseconds / 1000 / 60 / 60 / 24); //初日含まず

    const obj = {
      calendarFirstDay: calendarFirstDay,
      calendarLastDay: calendarLastDay,
      firstDate: firstDate,
      monthLastDate: monthLastDate,
      lastDate: lastDate,
      diffDays: diffDays,
    };
    return obj;
  }
  // ------------------------------
  // エレメント関連
  // ------------------------------
  // elements.classList.add(‘className’)	要素にクラスを追加する
  // elements.classList.remove(‘className’)	要素からクラスを削除する
  // elements.classList.toggle(‘className’)	要素が持っている特定のクラスを切り替える
  // elements.classList.contains(‘className’)	クラスを持っているかを確認する
  // ------------------------------
  queryAppendChildElementArray(element, className, elementArray = []) {
    //element[className]に対してelementArrayを上書追加する
    // this.childAppendElement(el, 'header-right', this.bottomListArray());
    let el = element.querySelector('.' + className);
    if (!el) {
      el = this.createElement('div', className);
    }
    elementArray.forEach((e) => el.appendChild(e));
    return el;
  }
  /**
   * 子エレメント削除
   * @param  {} parentEl
   * @param  {} className
   * this.hanaFunc.queryAllRemoveElement(parent.parentElement, 'appendEvent');
   */
  queryAllRemoveElement(parentEl, className) {
    //削除子エレメント（親クラス名付き）
    let removeElementArray = document.querySelectorAll('.' + className);
    removeElementArray.forEach((item) => parentEl.removeChild(item));
  }
  parentRemoveAllChild(searchElString) {
    //削除子エレメント
    const parent = document.querySelector(searchElString);
    if (parent) {
      while (parent.lastChild) {
        parent.removeChild(parent.lastChild);
      }
    }
  }

  createElement(tagName, className, innerText, typeName, idName) {
    // elementの作成（タグ名、クラス名、テキスト、タイプ名）
    // this.createElement('button', 'btn todayBtn', '今日', 'button')
    const element = document.createElement(tagName);
    if (className) {
      element.className = className;
    }
    if (innerText) {
      // element.innerText = element.textContent = innerText;
      element.appendChild(document.createTextNode(innerText));
    }
    if (typeName) {
      element.type = typeName;
    }
    if (idName) {
      element.setAttribute('id', idName); // 要素にidを設定
    }
    return element;
  }

  createList(textArray, className, tagName, typeName) {
    //箇条書き生成
    tagName = typeof tagName === 'string' ? tagName : 'ul';
    const listView = this.createElement(tagName, className, '', typeName);
    for (const s of textArray) {
      if (s) {
        const listViewItem = this.createElement('li');
        if (typeof s === 'string') {
          listViewItem.appendChild(document.createTextNode(s));
        }
        if (typeof s === 'object' && typeof s.text === 'string') {
          listViewItem.appendChild(document.createTextNode(s.text));
          listViewItem.style.color = s.color ? s.color : '';
          listViewItem.style.backgroundColor = s.backgroundColor ? s.backgroundColor : '';
          listViewItem.style.fontWeight = s.fontWeight ? s.fontWeight : '';
          listViewItem.style.cssText = s.cssText ? s.cssText : '';
        }
        listView.appendChild(listViewItem);
      }
    }
    return listView;
  }

  // ------------------------------
  // 日付関連（Date()関連）
  // ------------------------------
  sortedObjectDate(ObjectDate) {
    // JavaScriptでアイテムの配列を日付値で並べ替える(元オブジェクト維持)
    // [{date: Date_object}]
    return ObjectDate.slice().sort((a, b) => b.date - a.date);
  }

  replaceDateByFormatTo(format = 'YYYY-MM-DD', date = new Date()) {
    // 'YYYY-MM-DD', new Date('2020-04-10') => "2020-04-10"
    // 'YYYY-m-d', new Date('2020-04-10')  => "2020-4-10"
    // 'YYYY年m月d日', new Date('2020-04-10')  => "2020年4月10日"
    // 引数省略 本日の日付（ISODate）
    //replace 全部関数なめてから正規表現チェック、Formatを検査してからではない
    date = typeof date !== 'object' ? new Date() : date;
    format = format.replace(/YYYY/, date.getFullYear());
    format = format.replace(/M?M/, this.zeroPadding(date.getMonth() + 1, 2));
    format = format.replace(/m?m/, this.zeroPadding(date.getMonth() + 1));
    format = format.replace(/D?D/, this.zeroPadding(date.getDate(), 2));
    format = format.replace(/d?d/, this.zeroPadding(date.getDate()));
    // format = format.replace(/D?D/, date.getDate());

    return format;
  }
  zeroPadding(num, len) {
    //頭に0付与
    if (!len) {
      return num;
    }
    return (Array(len).join('0') + num).slice(-len);
  }
  eightNumStringToDate(s) {
    // "20200410" -> Fri Apr 10 2020 00:00:00 GMT+0900 (日本標準時)
    // new Date(0,0,36525)->Sat Jan 01 2000 00:00:00 GMT+0900 (日本標準時)

    let ans;
    if (s === undefined) {
      ans = new Date();
    } else if (s.toString().length <= 5) {
      let d = s % 100000;
      ans = new Date(0, 0, d);
    } else if (typeof s == 'number') {
      // parseIntは小数点以下切り捨て
      let y = parseInt(s / 10000);
      let m = parseInt(s / 100) % 100;
      let d = s % 100;
      ans = new Date(y, m - 1, d);
    } else if (typeof s == 'string') {
      //8桁文字列を日付に変換
      let y = s.slice(0, 4); // YYYY
      let m = s.slice(4, 6); // MM
      let d = s.slice(6, 8); // DD
      ans = new Date(+y, +m - 1, d);
    }
    return ans;
  }

  getElementArray(dt, isoDate, durations = 0, dataString = 'dateBody') {
    //elCountArray:[2,0,0]は初日(2)二日目(0)三日目(0)の個数で占めている
    //max=true:[2,0,0]の場合2を返す。
    //この場合3番目が空いている
    // const dt = luxon.DateTime;

    let elArray = Array(0);
    let elCountArray = Array(0);
    let date3 = this.dateObjectToDateTime(dt, isoDate);
    for (let index = 0; index < durations + 1; index++) {
      let kdt = date3.plus({ days: index }); // 日にち進める
      const searchElData = `[data-${dataString}="${kdt.toISODate()}"]`;
      const assEl = document.querySelector(searchElData);
      if (assEl) {
        elArray.push(assEl);
        elCountArray.push(assEl.childElementCount);
      }
    }
    return { elArray, elCountArray, dataString, isoDate };
  }

  getChildElementCount(dt, dtDrawStartDate, durations = 0, dataString = 'dateBody', max = false) {
    //elCountArray:[2,0,0]は初日(2)二日目(0)三日目(0)の個数で占めている
    //max=true:[2,0,0]の場合2を返す。
    //この場合3番目が空いている
    // const dt = luxon.DateTime;

    let oArray = this.getElementArray(dt, dtDrawStartDate, durations, dataString);
    let elCountArray = oArray['elCountArray'];
    let maxValue = Math.max.apply(null, elCountArray);
    maxValue = isFinite(maxValue) ? maxValue : 0;
    // console.log('elCountArray', elCountArray, maxValue);
    return max ? maxValue : elCountArray;
  }
  removeEventOnCalendar(dt, dateString, durationDays, dataString = 'dateBody') {
    // dateString="2022-04-15" から始まる期間durationDaysのイベントエレメントを削除します
    // dataString：datasetの検索文字列です
    // const dt = luxon.DateTime;

    const dtStartDate = this.dateObjectToDateTime(dt, dateString);
    for (let index = 0; index < durationDays + 1; index++) {
      let kdt = dtStartDate.plus({ days: index }); // 日にち進める
      const searchElData = `[data-${dataString}="${kdt.toISODate()}"]`;
      const parent = document.querySelector(searchElData);
      while (parent.lastChild) {
        parent.removeChild(parent.lastChild);
      }
    }
  }
  diffStartOfSundays(dtStartDay, dtEndDay) {
    //初日は0から始まります
    //日曜始まりの日数[ diffFromSunDays ]を返す、（初日含まず）
    // diffDays: 0は始まりと終わりが同日
    // diffFromSunDay: -2 は日曜はじまり(0)からDate2(-2)までの日数、日曜日の二日前
    // diffFromSunDay: 57 は日曜はじまり(0)でdate2(57)までの日数（初日含まず）int(57/7)+1が回数
    // diffToSunDays: 1 はdate1(0)からの最初の日曜日(1)までの日数
    // weekday: data1の曜日
    // sunCount: 0は訪れる日曜日の回数、diffSun>=0のみ有効
    // 返り値：凡例 diffToSunDays: 2 + diffFromSunDays: 5  = diffDays: 7 >>2022-04-08>2022-04-15
    // diffSunObj {diffDays: 7, dtDiffDays: m, diffFromSunDays: 5, diffToSunDays: 2, weekday: 5}
    // StartDayとEndDayは時間に左右されなために深夜時間に統一します

    const diffDays = dtEndDay.startOf('day').diff(dtStartDay.startOf('day'), 'days');
    const weekday = dtStartDay.weekday % 7;
    const diffToFirstSunDays = 7 - weekday;
    const diffSun = diffDays.days - diffToFirstSunDays;
    // console.log('diffDays', diffDays.days);
    // console.log('diffSun', diffSun);
    return {
      diffDays: diffDays.days, //TotalDaysString
      dtDiffDays: diffDays, //dtTotalDays
      diffFromSunDays: diffSun, //日曜はじまりでdate2までの日数(初日含まず)
      //マイナスは日曜の手前の日数
      diffToSunDays: diffToFirstSunDays, //date1から日曜までの日数(初日含む)
      weekday: weekday, //data1の曜日
      sunCount: diffSun < 0 ? 0 : Math.floor((diffSun + 7) / 7), //日曜の回数（プラスのみ）
      //diffSun>=0のみ有効
    };
  }

  checkedRangeMonthly(dt, itv, startDay, endDay, calendars) {
    //イベント(start,end)がカレンダー(calendars)期間内かチェック
    //calendars={calendarFirstDay:"2022-03-03",calendarLastDay:"2022-03-15"}
    //startDay="2022-03-01" ,endDay="2022-03-05"
    // const dt = luxon.DateTime;
    // const itv = luxon.Interval;

    if (typeof startDay != 'string') {
      return false;
    }
    endDay = typeof endDay != 'string' ? startDay : endDay;
    const date1 = dt.fromISO(startDay);
    const date2 = dt.fromISO(endDay);
    const intervalOne = itv.fromDateTimes(date1, date2);
    const date3 =
      Object.prototype.toString.call(calendars.calendarFirstDay) === '[object Date]'
        ? dt.fromJSDate(calendars.calendarFirstDay)
        : dt.fromISO(calendars.calendarFirstDay);
    const date4 =
      Object.prototype.toString.call(calendars.calendarLastDay) === '[object Date]'
        ? dt.fromJSDate(calendars.calendarLastDay)
        : dt.fromISO(calendars.calendarLastDay);
    const intervalTwo = itv.fromDateTimes(date3, date4);
    const diffDays = date2.diff(date1, 'days').days; //イベント1日
    //期間Two内true  date1が含まれているか？期間Oneオーバーラップしているか？
    let ansBool = diffDays == 0 ? intervalTwo.contains(date1) : intervalTwo.overlaps(intervalOne);
    //期間例（2022-03-05->2022-03-10）の場合検査日付2020-03-10は true を返さないため補足
    ansBool = date1.diff(date4, 'days').days == 0 ? true : ansBool;
    return ansBool;
  }
  getDtTimeString(dt, fromISOString) {
    //let timeObj = this.getDtTimeString(dt, eventItem['start']);
    //Iso日付時間を分解して時間文字列timeString["00:00"]を返す
    // var date = new Date(unixTimestamp*1000);//下三桁ミリ秒を加える
    // const dt = luxon.DateTime;
    if (typeof fromISOString === 'undefined') {
      return { fromISOString: typeof fromISOString };
    }
    let ts = dt.fromISO(fromISOString);
    let tsHour = this.zeroPadding(ts.hour, 2);
    tsHour += ':' + this.zeroPadding(ts.minute, 2);
    let tsTime = ts.toISOTime();
    let tsDate = ts.toISODate();
    return {
      ts: ts, //timeStamp,1650812400000,UnixTimeは頭10桁で2022年04月25日（月）00:00:00
      hours: ts.hour, //0
      minutes: ts.minute, //0
      timeString: tsHour, //'00:00'
      isoTime: tsTime, //'00:00:00.000+09:00'
      isoDate: tsDate, //'2022-04-25'
    };
  }
  checkDateEqual(dt, startIsoString, endIsoString) {
    // 始まりと終わりの日時の検査
    const ObjStartTm = this.getDtTimeString(dt, startIsoString);
    const ObjEndTm = this.getDtTimeString(dt, endIsoString ? endIsoString : startIsoString);
    const allDayTimeFlag = ObjEndTm.ts - ObjStartTm.ts ? false : true;
    const allDayFlag = ObjEndTm.isoDate == ObjStartTm.isoDate ? true : false;
    return {
      ObjStartTm: ObjStartTm,
      ObjEndTm: ObjEndTm,
      allDayTimeFlag: allDayTimeFlag, //時間について 同一か否か
      allDayFlag: allDayFlag, //日付について 同一か否か
    };
  }

  // ------------------------------
  // インタネット
  // ------------------------------

  queryAPI(endpoint) {
    //インタネットURL（endpoint）で問い合わせ
    //参考:[https://codesandbox.io/s/wait-for-multiple-javascript-promises-to-settle-with-promiseallsettled-kc1b8?file=/index.js]
    //{status: 'fulfilled', value: Array(19)}
    //{status: 'rejected', reason: Error: Unsuccessful response at error position}
    //fetch（Promise）を戻す。受け取った関数側retValue = getPromise(); Jsonが入っている
    return fetch(endpoint).then((response) => {
      return response.ok
        ? response.json() //Promise.reject(Error('Unsuccessful response'));
        : Promise.reject(Error(`Unsuccessful response,${response.statusText}`));
    });
  }
  getJsonData(urlArray, backFn) {
    // const urls = [
    //     'eventSample.json',
    //     'eventSample0.json',
    //     'https://starwars.egghead.training/vehicles',
    // ];
    let ansArray = [];
    Promise.allSettled(
      // [Calendar.prototype.queryAPI(urls[0]).then((f) => `$ { f.length }films `),]
      urlArray.map((d) => this.queryAPI(d).then((f) => f))
    )
      .then((results) => {
        const statistics = results
          .filter((result) => result.status === 'fulfilled')
          .map((result) => result.value);
        const errorList = results
          .filter((result) => result.status !== 'fulfilled')
          .map((result) => result.reason.message);

        ansArray.push(statistics);
        ansArray.push({ error: errorList });
        if (backFn) {
          backFn(ansArray);
        }
      })
      .catch((error) => {
        //表示:Uncaught (in promise) Error: Unsuccessful response
        console.warn(error);
      });
    //リターンしてもデーターは入りません速攻で戻るので、（データー取得待たずに）
    return ansArray;
  }

  // --------------------------------------------
  // JavaScript関連
  // --------------------------------------------

  //シャローコピー
  shallowClone(obj) {
    return Object.assign({}, obj);
  }

  //ディープコピー（中身がオブジェクトの場合は再帰的にシャローコピーする）
  deepClone(obj) {
    const newObj = this.shallowClone(obj);
    // プロパティがオブジェクト型であるなら、再帰的に複製する
    Object.keys(newObj)
      .filter((k) => typeof newObj[k] === 'object')
      .forEach((k) => (newObj[k] = this.deepClone(newObj[k])));
    return newObj;
  }

  deleteOfObjectKeys(objectArray, deleteKeysArray) {
    // 指定Keyのオブジェクトの削除 deleteKeysArray=["keyName1","keyName2"]
    const res = objectArray.map((el) =>
      Object.fromEntries(Object.entries(el).filter(([key]) => !deleteKeysArray.includes(key)))
    );
    return res;
  }
  deleteOfDuplicateObjectValue(objectArray, keyName) {
    // 重複削除（JSONオブジェクト）e.name と e[keyName] : keyName="name"同じ
    // 最初優先
    objectArray.filter((e, index, array) => {
      return array.findIndex((el) => el[keyName] === e[keyName]) === index;
    });
  }
  deleteOfDuplicateObjectValueBack(objectArray, keyName) {
    // 重複削除（JSONオブジェクト）e.name と e[keyName] : keyName="name"同じ
    // 最初優先
    return [...new Map(objectArray.map((e) => [e[keyName], e])).values()];
  }

  keyListOfDuplicateObjectBack(objectArray, keyName) {
    // 重複削除（JSONオブジェクト）e.name と e[keyName] : keyName="name"同じ
    // 最後優先
    return [...new Map(objectArray.map((e) => [e[keyName], e])).keys()];
  }
  dateObjectToDateTime(dt, dateString) {
    // javascriptのDate形式またはIso形式文字列をDateTimeオブジェクトに変換して返す
    const dtDate3 =
      Object.prototype.toString.call(dateString) === '[object Date]'
        ? dt.fromJSDate(dateString)
        : dt.fromISO(dateString);
    return dtDate3;
  }

  elementCreate(elementName, textNode, idName, className = '') {
    //  未使用
    var newElement = document.createElement(elementName); // 要素作成
    if (textNode) {
      var newContent = document.createTextNode(textNode); // テキストノードを作成
      newElement.appendChild(newContent); // 要素にテキストノードを追加
    }
    if (idName) {
      newElement.setAttribute('id', idName); // 要素にidを設定
    }
    if (className) {
      newElement.classList.add(className); // 要素にClassを設定
    }
    return newElement;
  }
  // -----------------------------------------------
  // タイマー機能
  // -----------------------------------------------
  timerInterval(timerNumber, times = 1000, callBackFn = this.timeCallback) {
    // this.hana = this.timerInterval(null);//set
    // this.hana = this.timerInterval(this.hana);//clear
    if (!timerNumber) {
      timerNumber = setInterval(callBackFn, times, times);
    } else {
      clearInterval(timerNumber);
      timerNumber = null;
    }
    return timerNumber;
  }

  timerSetTimeout(timerNumber, times = 1000, callBackFn = this.timeCallback) {
    // setTimeoutメソッドの戻り値は、タイマーを識別する数値を返します。
    // this.timerSetTimeout(null, 3000, () => (btn00.disabled = false));
    if (!timerNumber) {
      // clearTimeout(timerNumber);
      timerNumber = setTimeout(callBackFn, times, times);
    } else {
      clearTimeout(timerNumber);
      timerNumber = null;
    }
    return timerNumber;
  }
  timeCallback(times) {
    // click イベントのイベントリスナーが二回呼び出されたあとに
    // dblclick イベントのイベントリスナが―呼び出されます。
    console.log('hanaFuncTimeOut', times);
  }
  timeCount(thisPt, callBackFn, element, times = 1000) {
    // btn01.addEventListener('click', this.timeCount.bind(null, this, this.preBottom,btn01)(), false);
    // thisPtは(this)です。もう一つのthisはボタン呼び出し元(btn00)示す。Pt:Prototype
    // 多重クリックを吸収してTimeOUT後にCallBackしてからcount=0する
    // 無名関数で処理したい関数を返す（クロージャー）
    let count = 0;
    let timerNumber = 0;
    return (e) => {
      // addEventListenerが呼び出す無名関数、removeEventListener利用できない
      // console.log('DoubleClick', btn00, callBackFn, times);
      count++;
      // if (count < 10) console.log(count + '回目', thisPt, this);
      timerNumber = clearTimeout(timerNumber);
      timerNumber = HanalibC01.prototype.timerSetTimeout(null, times, () => {
        callBackFn.bind(thisPt, count, element)();
        count = 0;
      });
    };
  }
  addListener(target, type, callBackFn, capture = false) {
    // btn04.addEventListener('click', calendarPt.mvBtn, false);の場合
    // addListener(btn04, "click", calendarPt.mvBtn, false)
    target.addEventListener(type, callBackFn, capture);
    const eventStack = {
      target: target,
      type: type,
      callBackFn: callBackFn,
      capture: capture,
    };
    return eventStack;
  }

  removeListener(eventStack) {
    const e = eventStack;
    e.target.removeEventListener(e.type, e.listener, e.capture);
  }
}
