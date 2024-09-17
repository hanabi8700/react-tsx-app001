export const get8NumToDate = (dateString: string | number) => {
  const dateString2 = String(dateString).replace(/[^\d]/g, ''); //数字のみ
  const dl = dateString2.length;
  let a, b, c, c1, b1;
  if (dl === 4) {
    a = Number(dateString2.slice(0, 4));
    b = 1;
    c = 0;
    b1 = 1;
    c1 = 1;
  } else if (dl > 4 && dl <= 6) {
    a = Number(dateString2.slice(0, 4));
    b = Number(dateString2.slice(4, 6));
    c = Number(dateString2.slice(6));
    b1 = 1;
    c1 = 1;
  } else if (dl > 6) {
    a = Number(dateString2.slice(0, 4));
    b = Number(dateString2.slice(4, 6));
    c = Number(dateString2.slice(6));
    b1 = 1;
    c1 = 0;
  } else {
    a = new Date().getFullYear();
    b = Number(dateString2.slice(-2));
    c = 0;
    b1 = 1;
    c1 = 1;
  }
  const dt = new Date(a, b - b1, c + c1, 0, 0, 0);
  // console.log(dl, a, b, c, dt);
  return dt;
};
export const Slice3Num = (
  num: number,
  targetLength: number,
  charact = '*',
): string => {
  const len = String(num).length;
  return num
    .toString()
    .slice(targetLength * -1)
    .padStart(len, charact);
};

const date2 = new Date(2022, 5 - 1, 5, 6, 35, 20, 333);
console.log(date2.toLocaleDateString(), date2.toLocaleTimeString());
console.log(date2.toISOString());
const date3 = Number(34686753762).toString().padStart(15, '*');

const date = '2024年06月21日';
console.log(get8NumToDate(date).toLocaleDateString(), date3);
console.log(Slice3Num(1675467789, 4));
