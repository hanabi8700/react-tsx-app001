import { Link, Outlet } from 'react-router-dom';
const Root = () => {
  return (
    <>
      <header>
        <ul className="nav-list">
          <li className="nav-list-item headline">はなまる日付けプロトタイプ</li>
          <li className="nav-list-item">
            <Link to="/">ホーム</Link>
          </li>
          <li className="nav-list-item">
            <Link to="calendar">カレンダー</Link>
          </li>
          <li className="nav-list-item">
            <Link to="about">About</Link>
          </li>
        </ul>
      </header>

      <Outlet />
      {/* //これがなければLinkの表示のみ、推移しない */}
      {/* <!-- footer --> */}
      <footer>
        <ul className="footer-menu">
          <li>home ｜</li>
          <li>about ｜</li>
          <li>service ｜</li>
          <li>Contact Us</li>
        </ul>
        <p>© All rights reserved by hanabimedia.</p>
      </footer>
    </>
  );
};
export default Root;
