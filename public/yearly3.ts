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
// #----------------第何何月曜日に変わった
15,194801,12,成人の日,301,0,1999
2,200001,1,成人の日,401,
10,196610,12,体育の日,301,0,1999
2,200010,1,体育の日,401,0,2019
2,202010,1,スポーツの日,401,,,2020,2021
20,199607,12,海の日,301,0,2002
3,200307,1,海の日,401,0,,2020,2021
15,196609,12,敬老の日,301,0,2002
3,200309,1,敬老の日,401,
//#----------------その日のみ
1,201905,12,天皇即位の日,301,0,2019
22,201910,12,即位礼正殿の日,301,0,2019
10,202008,12,山の日(OrinPia),301,0,2020
23,202007,12,海の日(OrinPia),301,0,2020
24,202007,12,スポーツの日(OrinPia),301,0,2020
8,202108,12,山の日(OrinPia),301,0,2021
22,202107,12,海の日(OrinPia),301,0,2021
23,202107,12,スポーツの日(OrinPia),301,0,2021
// #---------------毎年の定例祝日
1,1,12,元旦,301
11,2,12,建国記念の日,301
23,202002,12,天皇誕生日,301
29,192704,12,天皇誕生日,301,0,1988
29,198904,12,昭和の日,301
3,5,12,憲法記念日,301
4,5,12,みどりの日,301
5,5,12,こどもの日,301
11,201608,12,山の日,301,,,2020,2021
3,11,12,文化の日,301
23,11,12,勤労感謝の日,301
23,198912,12,天皇誕生日,301,0,2018
// #---------------
24,12,12,クリスマスイブ,300
25,12,12,クリスマス,300
31,12,12,大晦日,300
// #---------------
3,2,12,節分,300
14,2,12,聖バレンタインデー,300
3,3,12,ひな祭り,300
7,7,12,七夕,300
// #---------------