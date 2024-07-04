//=========================================================================
//
// 旧暦計算サンプルプログラム  $Revision:   1.1  $
//     Coded by H.Takano (C)1993,1994
//     http://www.vector.co.jp/soft/dos/personal/se016093.html
//
//     Arranged for ECMAScript(ECMA-262) by Nagano Yutaka (C)1999
//
//     このスクリプトの計算結果は無保証です。
//     このスクリプトの再利用は自由に行ってかまいませんが、再配布の際は、
//     必ず出典元である上記の高野氏のドキュメントにアクセスできるように
//     してください。
//
//  使用例：
//    var date = new Date(); //Tue Feb 01 2022 00:00:00 GMT+0900 (日本標準時)
//    var kr = new kyureki(date.getJD());
//   とすることで現在時刻の旧暦を kr に計算します。計算結果は：
//       kr.year    : 旧暦年（数値）
//       kr.uruu    : 平月／閏月 flag （ブール値 平月:false 閏月:true）
//       kr.month   : 旧暦月（数値）
//       kr.day     : 旧暦日（数値）
//       kr.rokuyo  : 六曜名（文字列）
//       kr.moon    : 月齢 (modified by kikuchisan 2000.07.15)
//   に入っています。
//   上の例において、１行目を
//    var date = new Date(2002,5,3);
//   とすると、西暦2002年6月3日の旧暦を求めます。
//
//=========================================================================
export type KyurekiType = {
  year: number;
  uruu: number;
  month: number;
  day: number;
  rokuyo: string;
  moon: number;
  [index: string]: number | string;
};
// グローバル変数
const k = Math.PI / 180;
const ndt = new Date(); //IE3、NN3でエラーのため修正(modified by kikuchisan 2000.07.15)
const tz = ndt.getTimezoneOffset() / 1440; // タイムゾーンオフセット
let rm_sun0 = 0; // 太陽黄経
const mcont: number = 0;

// プロトタイプ宣言 - Dateオブジェクトにユリウス日(JST)を扱うメソッドを追加
// Date.prototype.getJD = Date_getJD;
// Date.prototype.setJD = Date_setJD;
//--------------------------------------
//協定世界時のシリアル値：ExcelTimeUTC ＝ UnixTime / 86400 + 25569
//日本標準時のシリアル値：ExcelTimeJST ＝ (UnixTime + 32400) / 86400 + 25569
//+32400秒 / 86400秒 = 0.375 (tz) or ndt.getTimezoneOffset()= 540分 / 1440分 =0.375;
//GetTime()を秒に変換 /1000=秒 date.getTime() / 864e5
//協定世界時(UTC)1970年1月1日00:00:00からの経過時間を表すDateオブジェクトのミリ秒単位
//１日の秒数：24時間×60分×60秒 ＝ 86400秒
//UTC に対する JST の時差：+9時間 ＝ +32400秒
//UNIX Time の基準時刻 (1970/01/01(木) 00:00:00 UTC) に相当するシリアル値：25569
//UNIX Time ＝ (JD － 2440587.5) * 86400
//---------------------------------------
export function Date_getJD(date: Date) {
  //UtC世界標準時をtimestamp返す
  return 2440587 + date.getTime() / 864e5 - tz;
}

export function Date_setJD(jd: number) {
  //JST日本標準時をDate返す
  const date = new Date();
  date.setTime((jd + tz - 2440587) * 864e5);
  return date;
}
//=========================================================================
// 新暦に対応する、旧暦オブジェクトを作成する。（コンストラクタ）kyureki
//
// 呼び出し時にセットする変数：
//	 tm : 計算する日付（JSTユリウス日）
// 戻り値：以下のプロパティに値をセットする
//	 this.year	: 旧暦年
//	 this.uruu	: 平月／閏月 flag .... 平月:false 閏月:true
//	 this.month : 旧暦月
//	 this.day	: 旧暦日
//	 this.rokuyo: 六曜名
//	 this.moon	: 月齢 (modified by kikuchisan 2000.07.15)
//=========================================================================
// const Qreki = function() {
//     // コンストラクター
//     if (!(this instanceof Qreki)) {
//         return new Qreki();
//     }
//     // this.isQDate = ndt; //{tm:tm}
// };
export default function Qreki(tm: number) {
  let i, lap, state;
  const chu = new Array(4);
  const saku = new Array(5);
  const m = new Array(5);
  const [mm, dd, yy] = [ndt.getMonth(), ndt.getDate(), ndt.getFullYear()];
  const kyu: KyurekiType = {
    uruu: 0,
    month: 0,
    day: 0,
    moon: 0,
    year: 0,
    rokuyo: '',
  };

  for (i = 0; i < 5; i++) m[i] = new Object();
  //-----------------------------------------------------------------------
  // 計算対象の直前にあたる二分二至の時刻を求める
  //-----------------------------------------------------------------------
  chu[0] = calc_chu(tm, 90);
  //-----------------------------------------------------------------------
  // 上で求めた二分二至の時の太陽黄経をもとに朔日行列の先頭に月名をセット
  //-----------------------------------------------------------------------
  m[0].month = Math.floor(rm_sun0 / 30) + 2;
  //-----------------------------------------------------------------------
  // 中気の時刻を計算（４回計算する）
  // chu[i]:中気の時刻
  //-----------------------------------------------------------------------
  for (i = 1; i < 4; i++) {
    chu[i] = calc_chu(chu[i - 1] + 32, 30);
  }
  //-----------------------------------------------------------------------
  //	計算対象の直前にあたる二分二至の直前の朔の時刻を求める
  //-----------------------------------------------------------------------
  saku[0] = calc_saku(chu[0]);
  //-----------------------------------------------------------------------
  // 朔の時刻を求める
  //-----------------------------------------------------------------------
  for (i = 1; i < 5; i++) {
    saku[i] = calc_saku(saku[i - 1] + 30);
    // 前と同じ時刻を計算した場合（両者の差が26日以内）には、初期値を
    // +33日にして再実行させる。
    if (Math.abs(Math.floor(saku[i - 1]) - Math.floor(saku[i])) <= 26) {
      saku[i] = calc_saku(saku[i - 1] + 35);
    }
  }
  //-----------------------------------------------------------------------
  // saku[1]が二分二至の時刻以前になってしまった場合には、朔をさかのぼり過ぎ
  // たと考えて、朔の時刻を繰り下げて修正する。
  // その際、計算もれ（saku[4]）になっている部分を補うため、朔の時刻を計算
  // する。（近日点通過の近辺で朔があると起こる事があるようだ...？）
  //-----------------------------------------------------------------------
  if (Math.floor(saku[1]) <= Math.floor(chu[0])) {
    for (i = 0; i < 4; i++) {
      saku[i] = saku[i + 1];
    }
    saku[4] = calc_saku(saku[3] + 35);
  }
  //-----------------------------------------------------------------------
  // saku[0]が二分二至の時刻以後になってしまった場合には、朔をさかのぼり足
  // りないと見て、朔の時刻を繰り上げて修正する。
  // その際、計算もれ（saku[0]）になっている部分を補うため、朔の時刻を計算
  // する。（春分点の近辺で朔があると起こる事があるようだ...？）
  //-----------------------------------------------------------------------
  else if (Math.floor(saku[0]) > Math.floor(chu[0])) {
    for (i = 4; i > 0; i--) saku[i] = saku[i - 1];
    saku[0] = calc_saku(saku[0] - 27);
  }
  //-----------------------------------------------------------------------
  // 閏月検索Ｆｌａｇセット
  // （節月で４ヶ月の間に朔が５回あると、閏月がある可能性がある。）
  // lap=false:平月  lap=true:閏月
  //-----------------------------------------------------------------------
  lap = Math.floor(saku[4]) <= Math.floor(chu[3]);
  //-----------------------------------------------------------------------
  // 朔日行列の作成
  // m[i].month ... 月名（1:正月 2:２月 3:３月 ....）
  // m[i].uruu .... 閏フラグ（false:平月 true:閏月）
  // m[i].jd ...... 朔日のjd
  //-----------------------------------------------------------------------
  // m[0].month はこの関数の始めの方ですでに設定済み
  m[0].uruu = false;
  m[0].jd = Math.floor(saku[0]);
  for (i = 1; i < 5; i++) {
    if (lap && i > 1) {
      if (
        chu[i - 1] <= Math.floor(saku[i - 1]) ||
        chu[i - 1] >= Math.floor(saku[i])
      ) {
        m[i - 1].month = m[i - 2].month;
        m[i - 1].uruu = true;
        m[i - 1].jd = Math.floor(saku[i - 1]);
        lap = false;
      }
    }
    m[i].month = m[i - 1].month + 1;
    if (m[i].month > 12) m[i].month -= 12;
    m[i].jd = Math.floor(saku[i]);
    m[i].uruu = false;
  }
  //-----------------------------------------------------------------------
  // 朔日行列から旧暦を求める。
  //-----------------------------------------------------------------------
  state = 0;
  for (i = 0; i < 5; i++) {
    if (Math.floor(tm) < Math.floor(m[i].jd)) {
      state = 1;
      break;
    } else if (Math.floor(tm) == Math.floor(m[i].jd)) {
      state = 2;
      break;
    }
  }
  if (state == 0 || state == 1) i--;
  kyu.uruu = m[i].uruu;
  kyu.month = m[i].month;
  kyu.day = Math.floor(tm) - Math.floor(m[i].jd) + 1;
  //月齢計算追加 by kikuchisan(2000.07.15)
  if (mcont == 1) {
    const tm12 = new Date(yy, mm - 1, dd, 12); //当日の正午をセット
    const tm13 = Date_getJD(tm12); //tm12.getJD();
    kyu.moon = Math.round((tm13 - calc_saku(tm)) * 10.0) / 10.0; //12時の月齢
  } else {
    kyu.moon = Math.round((tm - calc_saku(tm)) * 10.0) / 10.0; //現在時刻の月齢
  }
  if (kyu.moon >= 29.9) {
    kyu.moon -= 29.8;
  } //朔望月の最大値は29.8
  if (kyu.moon < 0.0) {
    kyu.moon = 29.3;
  } //朔望月の最小値は29.3
  kyu.moon = Math.round(kyu.moon * 10) / 10;
  //ここまで
  //-----------------------------------------------------------------------
  // 旧暦年の計算
  // （旧暦月が10以上でかつ新暦月より大きい場合には、
  //	 まだ年を越していないはず...）
  //-----------------------------------------------------------------------
  // a.setJD(tm);
  const a = Date_setJD(tm);
  //	kyu.year = a.getFullYear(); //IE3、NN3はFullYear不可のため変更(modified by kikuchisan 2000.07.15)
  kyu.year = a.getFullYear();
  if (kyu.year < 2000) kyu.year += 1900;
  if (kyu.month > 9 && kyu.month > a.getMonth() + 1) kyu.year--;
  //-----------------------------------------------------------------------
  // 六曜を求める
  //-----------------------------------------------------------------------
  //	var rokuyo = new Array("先勝","友引","先負","仏滅","大安","赤口");
  //表示色変更(modified by kikuchisan 2000.07.15)
  // var rokuyo = new Array('先勝', '友引', '先負', '仏滅', '<font color=magenta>大安</font>', '赤口');
  const rokuyo = ['先勝', '友引', '先負', '仏滅', '大安', '赤口'];
  kyu.rokuyo = rokuyo[(kyu.month + kyu.day - 2) % 6];
  //for(i=0;i<5;i++)document.writeln(m[i].month,"\t",m[i].uruu,"\t",m[i].jd);
  //for(i=0;i<4;i++)document.writeln(chu[i]);
  return kyu;
}

//=========================================================================
// 直前の二分二至／中気の時刻を求める
//
// パラメータ
//	 tm ............ 計算基準となる時刻（JSTユリウス日）
//	 longitude ..... 求める対象（90:二分二至,30:中気））
// 戻り値
//	 求めた時刻（JSTユリウス日）を返す。
//	 グローバル変数 rm_sun0 に、その時の太陽黄経をセットする。
//
// ※ 引数、戻り値ともユリウス日で表し、時分秒は日の小数で表す。
//	  力学時とユリウス日との補正時刻=0.0secと仮定
//=========================================================================
function calc_chu(tm:number, longitude:number) {
  let tm1, tm2, t, rm_sun, delta_rm;
  //-----------------------------------------------------------------------
  // 時刻引数を小数部と整数部とに分解する（精度を上げるため）
  //-----------------------------------------------------------------------
  tm1 = Math.floor(tm);
  tm2 = tm - tm1 + tz; // JST -> UTC
  //-----------------------------------------------------------------------
  // 直前の二分二至の黄経 λsun0 を求める
  //-----------------------------------------------------------------------
  t = (tm2 + 0.5) / 36525 + (tm1 - 2451545) / 36525;
  rm_sun = LONGITUDE_SUN(t);
  rm_sun0 = longitude * Math.floor(rm_sun / longitude);
  //-----------------------------------------------------------------------
  // 繰り返し計算によって直前の二分二至の時刻を計算する
  // （誤差が±1.0 sec以内になったら打ち切る。）
  //-----------------------------------------------------------------------
  let delta_t1 = 0,
    delta_t2 = 1;
  for (; Math.abs(delta_t1 + delta_t2) > 1 / 86400; ) {
    //-------------------------------------------------------------------
    // λsun(t) を計算
    //	 t = (tm + .5 - 2451545) / 36525;
    //-------------------------------------------------------------------
    t = (tm2 + 0.5) / 36525 + (tm1 - 2451545) / 36525;
    rm_sun = LONGITUDE_SUN(t);
    //-------------------------------------------------------------------
    // 黄経差 Δλ＝λsun －λsun0
    //-------------------------------------------------------------------
    delta_rm = rm_sun - rm_sun0;
    //-------------------------------------------------------------------
    // Δλの引き込み範囲（±180°）を逸脱した場合には、補正を行う
    //-------------------------------------------------------------------
    if (delta_rm > 180) {
      delta_rm -= 360;
    } else if (delta_rm < -180) {
      delta_rm += 360;
    }
    //-------------------------------------------------------------------
    // 時刻引数の補正値 Δt
    // delta_t = delta_rm * 365.2 / 360;
    //-------------------------------------------------------------------
    delta_t1 = Math.floor((delta_rm * 365.2) / 360);
    delta_t2 = (delta_rm * 365.2) / 360 - delta_t1;
    //-------------------------------------------------------------------
    // 時刻引数の補正
    // tm -= delta_t;
    //-------------------------------------------------------------------
    tm1 = tm1 - delta_t1;
    tm2 = tm2 - delta_t2;
    if (tm2 < 0) {
      tm1 -= 1;
      tm2 += 1;
    }
  }
  //-----------------------------------------------------------------------
  // 戻り値の作成
  //	 時刻引数を合成し、戻り値（JSTユリウス日）とする
  //-----------------------------------------------------------------------
  return tm2 + tm1 - tz;
}

//=========================================================================
// 直前の朔の時刻を求める
//
// 呼び出し時にセットする変数
//	 tm ........ 計算基準の時刻（JSTユリウス日）
// 戻り値
//	 朔の時刻
//
// ※ 引数、戻り値ともJSTユリウス日で表し、時分秒は日の小数で表す。
//	  力学時とユリウス日との補正時刻=0.0secと仮定
//=========================================================================
function calc_saku(tm:number) {
  let lc, t, tm1, tm2, rm_sun, rm_moon, delta_rm;
  //-----------------------------------------------------------------------
  // ループカウンタのセット
  //-----------------------------------------------------------------------
  lc = 1;
  //-----------------------------------------------------------------------
  // 時刻引数を小数部と整数部とに分解する（精度を上げるため）
  //-----------------------------------------------------------------------
  tm1 = Math.floor(tm);
  tm2 = tm - tm1 + tz; // JST -> UTC
  //-----------------------------------------------------------------------
  // 繰り返し計算によって朔の時刻を計算する
  // （誤差が±1.0 sec以内になったら打ち切る。）
  //-----------------------------------------------------------------------
  let delta_t1 = 0,
    delta_t2 = 1;
  for (; Math.abs(delta_t1 + delta_t2) > 1 / 86400; lc++) {
    //-------------------------------------------------------------------
    // 太陽の黄経λsun(t) ,月の黄経λmoon(t) を計算
    //	 t = (tm + .5 - 2451545) / 36525;
    //-------------------------------------------------------------------
    t = (tm2 + 0.5) / 36525 + (tm1 - 2451545) / 36525;
    rm_sun = LONGITUDE_SUN(t);
    rm_moon = LONGITUDE_MOON(t);
    //-------------------------------------------------------------------
    // 月と太陽の黄経差Δλ
    // Δλ＝λmoon－λsun
    //-------------------------------------------------------------------
    delta_rm = rm_moon - rm_sun;
    //-------------------------------------------------------------------
    // ループの１回目（lc=1）で delta_rm < 0 の場合には引き込み範囲に
    // 入るように補正する
    //-------------------------------------------------------------------
    if (lc == 1 && delta_rm < 0) {
      delta_rm = NORMALIZATION_ANGLE(delta_rm);
    }
    //-------------------------------------------------------------------
    //	 春分の近くで朔がある場合（0 ≦λsun≦ 20）で、
    //	 月の黄経λmoon≧300 の場合には、
    //	 Δλ＝ 360 － Δλ と計算して補正する
    //-------------------------------------------------------------------
    else if (rm_sun >= 0 && rm_sun <= 20 && rm_moon >= 300) {
      delta_rm = NORMALIZATION_ANGLE(delta_rm);
      delta_rm = 360 - delta_rm;
    }
    //-------------------------------------------------------------------
    // Δλの引き込み範囲（±40°）を逸脱した場合には、補正を行う
    //-------------------------------------------------------------------
    else if (Math.abs(delta_rm) > 40) {
      delta_rm = NORMALIZATION_ANGLE(delta_rm);
    }
    //-------------------------------------------------------------------
    // 時刻引数の補正値 Δt
    // delta_t = delta_rm * 29.530589 / 360;
    //-------------------------------------------------------------------
    delta_t1 = Math.floor((delta_rm * 29.530589) / 360);
    delta_t2 = (delta_rm * 29.530589) / 360 - delta_t1;
    //-------------------------------------------------------------------
    // 時刻引数の補正
    // tm -= delta_t;
    //-------------------------------------------------------------------
    tm1 = tm1 - delta_t1;
    tm2 = tm2 - delta_t2;
    if (tm2 < 0) {
      tm1 -= 1;
      tm2 += 1;
    }
    //-------------------------------------------------------------------
    // ループ回数が15回になったら、初期値 tm を tm-26 とする。
    //-------------------------------------------------------------------
    if (lc == 15 && Math.abs(delta_t1 + delta_t2) > 1 / 86400) {
      tm1 = Math.floor(tm - 26);
      tm2 = 0;
    }
    //-------------------------------------------------------------------
    // 初期値を補正したにも関わらず、振動を続ける場合には初期値を答えとし
    // て返して強制的にループを抜け出して異常終了させる。
    //-------------------------------------------------------------------
    else if (lc > 30 && Math.abs(delta_t1 + delta_t2) > 1 / 86400) {
      tm1 = tm;
      tm2 = 0;
      break;
    }
  }
  //-----------------------------------------------------------------------
  // 戻り値の作成
  //	 時刻引数を合成し、戻り値（ユリウス日）とする
  //-----------------------------------------------------------------------
  return tm2 + tm1 - tz;
}

//=========================================================================
// 角度の正規化を行う。すなわち引数の範囲を ０≦θ＜３６０ にする。
//=========================================================================
function NORMALIZATION_ANGLE(angle:number) {
  return angle - 360 * Math.floor(angle / 360);
}

//=========================================================================
// 太陽の黄経 λsun(t) を計算する（t は力学時）
//=========================================================================
function LONGITUDE_SUN(t:number) {
  let ang, th;
  // const k = this.k;
  // with(Math) {
  //-----------------------------------------------------------------------
  // 摂動項の計算
  //-----------------------------------------------------------------------
  th = 0.0004 * Math.cos(k * NORMALIZATION_ANGLE(31557 * t + 161));
  th += 0.0004 * Math.cos(k * NORMALIZATION_ANGLE(29930 * t + 48));
  th += 0.0005 * Math.cos(k * NORMALIZATION_ANGLE(2281 * t + 221));
  th += 0.0005 * Math.cos(k * NORMALIZATION_ANGLE(155 * t + 118));
  th += 0.0006 * Math.cos(k * NORMALIZATION_ANGLE(33718 * t + 316));
  th += 0.0007 * Math.cos(k * NORMALIZATION_ANGLE(9038 * t + 64));
  th += 0.0007 * Math.cos(k * NORMALIZATION_ANGLE(3035 * t + 110));
  th += 0.0007 * Math.cos(k * NORMALIZATION_ANGLE(65929 * t + 45));
  th += 0.0013 * Math.cos(k * NORMALIZATION_ANGLE(22519 * t + 352));
  th += 0.0015 * Math.cos(k * NORMALIZATION_ANGLE(45038 * t + 254));
  th += 0.0018 * Math.cos(k * NORMALIZATION_ANGLE(445267 * t + 208));
  th += 0.0018 * Math.cos(k * NORMALIZATION_ANGLE(19 * t + 159));
  th += 0.002 * Math.cos(k * NORMALIZATION_ANGLE(32964 * t + 158));
  th += 0.02 * Math.cos(k * NORMALIZATION_ANGLE(71998.1 * t + 265.1));
  ang = NORMALIZATION_ANGLE(35999.05 * t + 267.52);
  th = th - 0.0048 * t * Math.cos(k * ang);
  th += 1.9147 * Math.cos(k * ang);
  //-----------------------------------------------------------------------
  // 比例項の計算
  //-----------------------------------------------------------------------
  ang = NORMALIZATION_ANGLE(36000.7695 * t);
  ang = NORMALIZATION_ANGLE(ang + 280.4659);
  th = NORMALIZATION_ANGLE(th + ang);
  // }
  return th;
}

//=========================================================================
// 月の黄経 λmoon(t) を計算する（t は力学時）
//=========================================================================
function LONGITUDE_MOON(t:number) {
  let ang, th;
  // const k = this.k;

  // with(Math) {//このブロックの中ではMath.を省略できる
  //-----------------------------------------------------------------------
  // 摂動項の計算
  //-----------------------------------------------------------------------
  th = 0.0003 * Math.cos(k * NORMALIZATION_ANGLE(2322131 * t + 191));
  th += 0.0003 * Math.cos(k * NORMALIZATION_ANGLE(4067 * t + 70));
  th += 0.0003 * Math.cos(k * NORMALIZATION_ANGLE(549197 * t + 220));
  th += 0.0003 * Math.cos(k * NORMALIZATION_ANGLE(1808933 * t + 58));
  th += 0.0003 * Math.cos(k * NORMALIZATION_ANGLE(349472 * t + 337));
  th += 0.0003 * Math.cos(k * NORMALIZATION_ANGLE(381404 * t + 354));
  th += 0.0003 * Math.cos(k * NORMALIZATION_ANGLE(958465 * t + 340));
  th += 0.0004 * Math.cos(k * NORMALIZATION_ANGLE(12006 * t + 187));
  th += 0.0004 * Math.cos(k * NORMALIZATION_ANGLE(39871 * t + 223));
  th += 0.0005 * Math.cos(k * NORMALIZATION_ANGLE(509131 * t + 242));
  th += 0.0005 * Math.cos(k * NORMALIZATION_ANGLE(1745069 * t + 24));
  th += 0.0005 * Math.cos(k * NORMALIZATION_ANGLE(1908795 * t + 90));
  th += 0.0006 * Math.cos(k * NORMALIZATION_ANGLE(2258267 * t + 156));
  th += 0.0006 * Math.cos(k * NORMALIZATION_ANGLE(111869 * t + 38));
  th += 0.0007 * Math.cos(k * NORMALIZATION_ANGLE(27864 * t + 127));
  th += 0.0007 * Math.cos(k * NORMALIZATION_ANGLE(485333 * t + 186));
  th += 0.0007 * Math.cos(k * NORMALIZATION_ANGLE(405201 * t + 50));
  th += 0.0007 * Math.cos(k * NORMALIZATION_ANGLE(790672 * t + 114));
  th += 0.0008 * Math.cos(k * NORMALIZATION_ANGLE(1403732 * t + 98));
  th += 0.0009 * Math.cos(k * NORMALIZATION_ANGLE(858602 * t + 129));
  th += 0.0011 * Math.cos(k * NORMALIZATION_ANGLE(1920802 * t + 186));
  th += 0.0012 * Math.cos(k * NORMALIZATION_ANGLE(1267871 * t + 249));
  th += 0.0016 * Math.cos(k * NORMALIZATION_ANGLE(1856938 * t + 152));
  th += 0.0018 * Math.cos(k * NORMALIZATION_ANGLE(401329 * t + 274));
  th += 0.0021 * Math.cos(k * NORMALIZATION_ANGLE(341337 * t + 16));
  th += 0.0021 * Math.cos(k * NORMALIZATION_ANGLE(71998 * t + 85));
  th += 0.0021 * Math.cos(k * NORMALIZATION_ANGLE(990397 * t + 357));
  th += 0.0022 * Math.cos(k * NORMALIZATION_ANGLE(818536 * t + 151));
  th += 0.0023 * Math.cos(k * NORMALIZATION_ANGLE(922466 * t + 163));
  th += 0.0024 * Math.cos(k * NORMALIZATION_ANGLE(99863 * t + 122));
  th += 0.0026 * Math.cos(k * NORMALIZATION_ANGLE(1379739 * t + 17));
  th += 0.0027 * Math.cos(k * NORMALIZATION_ANGLE(918399 * t + 182));
  th += 0.0028 * Math.cos(k * NORMALIZATION_ANGLE(1934 * t + 145));
  th += 0.0037 * Math.cos(k * NORMALIZATION_ANGLE(541062 * t + 259));
  th += 0.0038 * Math.cos(k * NORMALIZATION_ANGLE(1781068 * t + 21));
  th += 0.004 * Math.cos(k * NORMALIZATION_ANGLE(133 * t + 29));
  th += 0.004 * Math.cos(k * NORMALIZATION_ANGLE(1844932 * t + 56));
  th += 0.004 * Math.cos(k * NORMALIZATION_ANGLE(1331734 * t + 283));
  th += 0.005 * Math.cos(k * NORMALIZATION_ANGLE(481266 * t + 205));
  th += 0.0052 * Math.cos(k * NORMALIZATION_ANGLE(31932 * t + 107));
  th += 0.0068 * Math.cos(k * NORMALIZATION_ANGLE(926533 * t + 323));
  th += 0.0079 * Math.cos(k * NORMALIZATION_ANGLE(449334 * t + 188));
  th += 0.0085 * Math.cos(k * NORMALIZATION_ANGLE(826671 * t + 111));
  th += 0.01 * Math.cos(k * NORMALIZATION_ANGLE(1431597 * t + 315));
  th += 0.0107 * Math.cos(k * NORMALIZATION_ANGLE(1303870 * t + 246));
  th += 0.011 * Math.cos(k * NORMALIZATION_ANGLE(489205 * t + 142));
  th += 0.0125 * Math.cos(k * NORMALIZATION_ANGLE(1443603 * t + 52));
  th += 0.0154 * Math.cos(k * NORMALIZATION_ANGLE(75870 * t + 41));
  th += 0.0304 * Math.cos(k * NORMALIZATION_ANGLE(513197.9 * t + 222.5));
  th += 0.0347 * Math.cos(k * NORMALIZATION_ANGLE(445267.1 * t + 27.9));
  th += 0.0409 * Math.cos(k * NORMALIZATION_ANGLE(441199.8 * t + 47.4));
  th += 0.0458 * Math.cos(k * NORMALIZATION_ANGLE(854535.2 * t + 148.2));
  th += 0.0533 * Math.cos(k * NORMALIZATION_ANGLE(1367733.1 * t + 280.7));
  th += 0.0571 * Math.cos(k * NORMALIZATION_ANGLE(377336.3 * t + 13.2));
  th += 0.0588 * Math.cos(k * NORMALIZATION_ANGLE(63863.5 * t + 124.2));
  th += 0.1144 * Math.cos(k * NORMALIZATION_ANGLE(966404 * t + 276.5));
  th += 0.1851 * Math.cos(k * NORMALIZATION_ANGLE(35999.05 * t + 87.53));
  th += 0.2136 * Math.cos(k * NORMALIZATION_ANGLE(954397.74 * t + 179.93));
  th += 0.6583 * Math.cos(k * NORMALIZATION_ANGLE(890534.22 * t + 145.7));
  th += 1.274 * Math.cos(k * NORMALIZATION_ANGLE(413335.35 * t + 10.74));
  th += 6.2888 * Math.cos(k * NORMALIZATION_ANGLE(477198.868 * t + 44.963));
  //-----------------------------------------------------------------------
  // 比例項の計算
  //-----------------------------------------------------------------------
  ang = NORMALIZATION_ANGLE(481267.8809 * t);
  ang = NORMALIZATION_ANGLE(ang + 218.3162);
  th = NORMALIZATION_ANGLE(th + ang);
  return th;
}
