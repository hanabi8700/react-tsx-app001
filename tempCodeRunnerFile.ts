
// import React from 'react'
import {
  access,
  mkdir,
  readdir,
  readFile,
  rename,
  unlink,
  watch,
  writeFile,
} from 'fs/promises';
// type Props = {};

// function FsPromiss({}: Props) {
//   return "<div>FsPr1-omiss</div>;"
// }
//ファイルを読み込む
export async function loadFile(): Promise<void> {
  try {
    const data: string = await readFile("", "utf8");
    console.log(data);
  } catch (error) {
    console.error("ファイルの読み込みに失敗しました:", error);
  }
}
// ファイルを監視する
async function watchFile(): Promise<void> {
  const watcher = watch('./path/to/file/sample.txt');

  for await (const event of watcher) {
    console.log(
      `ファイルに変更がありました: ${event.eventType}(${event.filename})`,
    );
  }
}