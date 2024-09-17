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

//サーバー専用

type Props = {};

function FsPromiss({}: Props) {
  return "<div>FsPromiss</div>;"
}
//ファイルを読み込む
// loadFile('./public/yearly3.ts');
export async function loadFile(path): Promise<void> {
  try {
    const data: string = await readFile(path, 'utf8');
    console.log(data);
  } catch (error) {
    console.error('ファイルの読み込みに失敗しました:', error);
  }
}

//ファイルを書き込む
async function saveFile(): Promise<void> {
  const data = 'こんにちは、TypeScript!';
  try {
    await writeFile('./path/to/file/sample.txt', data, 'utf8');
    console.log('ファイルが正常に書き込まれました。');
  } catch (error) {
    console.error('ファイルの書き込みに失敗しました:', error);
  }
}

//ファイルを削除する
async function deleteFile(): Promise<void> {
  try {
    await unlink('./path/to/file/sample.txt');
    console.log('ファイルが正常に削除されました。');
  } catch (error) {
    console.error('ファイルの削除に失敗しました:', error);
  }
}

//ファイルの名前を変更する
async function renameFile(): Promise<void> {
  try {
    await rename('./path/to/file/oldFile.txt', './path/to/file/newFile.txt');
    console.log('ファイル名が正常に変更されました。');
  } catch (error) {
    console.error('ファイル名の変更に失敗しました:', error);
  }
}

//ファイルの存在チェックする
async function checkFileExists(): Promise<void> {
  try {
    await access('./path/to/file/sample.txt');
    console.log('ファイルは存在します。');
  } catch {
    console.log('ファイルは存在しません。');
  }
}

//ディレクトリを作成する
async function createDirectory(): Promise<void> {
  try {
    await mkdir('./path/to/new/directory', { recursive: true });
    console.log('ディレクトリが正常に作成されました。');
  } catch (error) {
    console.error('ディレクトリの作成に失敗しました:', error);
  }
}

//ディレクトリの内容を読み取る
async function listDirectoryContents(): Promise<void> {
  try {
    const files: string[] = await readdir('./path/to/file');
    files.forEach((x) => console.log('ディレクトリの内容:', x));
  } catch (error) {
    console.error('ディレクトリの読み取りに失敗しました:', error);
  }
}

//ファイルの状態を取得する
async function getFileStatus(): Promise<void> {
  try {
    const stats = await stat('./path/to/file/sample.txt');
    console.log('ファイルサイズ:', stats.size);
    console.log('作成時間:', stats.birthtime);
    console.log('最終アクセス時間:', stats.atime);
    console.log('最終変更時間:', stats.mtime);
  } catch (error) {
    console.error('ファイル状態の取得に失敗しました:', error);
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
export default FsPromiss;
