// import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export default function Root() {
  return (
    <>
      <h1>株式会社〇〇〇〇</h1>
      <nav>
        <Link to={'./'}>TOP</Link>
        <Link to={'about'}>会社概要</Link>
        <Link to={'access'}>アクセス</Link>
        <Link to={'contact'}>お問い合わせ</Link>
        <Link to={'honban'}>カレンダー</Link>
      </nav>
      <Outlet />
    </>
  );
}
