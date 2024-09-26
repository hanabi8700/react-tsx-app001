import * as calc from './CalenderLib';

type dataset = {
  date: string;
  order: number;
  duration?: number;
  id?: number;
};
export type stockedDaysType = {
  date: string;
  stack: number[];
  state: number[];
  // duration: number[];
};
const debug9 = false;
export const CalenderStack = (
  dataset: dataset[],
  stockedDays: stockedDaysType[],
  initial = false,
  initial2 = false,
) => {
  initial ? (stockedDays = []) : null;
  // const numRandom = () => Math.floor(Math.random() * 1000) + 1;
  !initial2 && debug9 ? console.log('EventInsert to stockedDays....') : null;
  for (const obj1 of dataset) {
    // const k = numRandom();
    if (obj1.order > 29) {
      for (let i = 0, j = obj1.duration ? obj1.duration : 1; i < j; i++) {
        const date3 = calc.getDateWithString(calc.stringToDate(obj1.date, i));
        const kvStack = stockedDays.find((data) => data.date === date3);

        if (!kvStack) {
          stockedDays.push({
            date: date3, //Date
            stack: [i + 1], //Duration
            state: [(obj1.id as number) * 100 + j], //SerialID
            // duration: [j],
          });
        } else {
          if (initial2) {
            kvStack.stack.unshift(i + 1);
            kvStack.state.unshift((obj1.id as number) * 100 + j);
            // kvStack.duration.unshift(j);
          } else {
            // kvStack.stack.push(i + 1);
            // kvStack.duration.push(j);
            const findindex = kvStack.state.findIndex((d) => d === undefined);
            const d = (obj1.id as number) * 100 + j;
            findindex === -1
              ? kvStack.state.push(d)
              : (kvStack.state[findindex] = d);
            findindex === -1
              ? kvStack.stack.push(i + 1)
              : (kvStack.stack[findindex] = i + 1);
            debug9 &&
              console.log(
                '-1:push,N:Insert>>',
                kvStack.state,
                findindex,
                kvStack.date,
              );
            //
          }
        }
      }
    }
  }
  CalenderStack1(stockedDays); //破壊的配置換え
  return stockedDays;
};

//並び替え stockedDaysの並び替え（破壊的）stockedDays[].state
const CalenderStack1 = (stockedDays: stockedDaysType[]) => {
  debug9 && console.log('stockedDaysの並び替え....');
  const memory: number[] = [];
  for (let stockIndex = 0; stockIndex < stockedDays.length; stockIndex++) {
    const obj1 = stockedDays[stockIndex];
    for (let i = 0, max = 0; i < obj1.state.length; i++) {
      const start = obj1.state[i];
      const memoryIndex = memory.findIndex((data) => data === start);
      //ターゲットstate番号ですでに振り替えたなら下のifは実行しない
      if (start && memoryIndex === -1) {
        memory.push(start);
        //ターゲットstate番号の位置のmax値を探す
        for (let j = stockIndex + 1; j < stockedDays.length; j++) {
          // console.log('>>>', stockIndex, j, stockedDays[j].state);
          const index = stockedDays[j].state.findIndex(
            (value) => value === start,
          );
          if (index == -1) break;
          //ターゲットstate番号の位置のmax値を記憶
          max = index <= max ? max : index;
        }
        ////ターゲットstate番号の位置のmax値を基に位置を入れ替える
        for (let j = stockIndex; j < stockedDays.length; j++) {
          const index = stockedDays[j].state.findIndex(
            (value) => value === start,
          );
          // console.log(
          //   '>>>',
          //   start,
          //   stockIndex,
          //   j,
          //   stockedDays[j].state,
          //   index,
          //   max,
          // );
          debug9 && console.log('irekae', index,">", max, stockedDays[j].state);
          if (index == -1 || index > max) break;
          stockedDays[j].state = calc.replaceArrayElements(
            stockedDays[j].state,
            index,
            max,
          );
          stockedDays[j].stack = calc.replaceArrayElements(
            stockedDays[j].stack,
            index,
            max,
          );
          debug9 &&
            console.log(
              'irekaeGO',
              stockedDays[j].state,
              index,
              max,
              stockedDays[j],
            );
        }
        i = -1;
      }
    }
  }
  // console.log("stokedDays-->",stockedDays);
  return;
};
