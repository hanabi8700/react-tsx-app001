import { Link, Outlet } from 'react-router-dom';
import pic1 from '../images/search.png';
import pic2 from "../images/menu.png"
import pic3 from '../images/close.png';

const Root = () => {
  // const hamburger:Element | null = document.querySelector('.hamburger');
  // const menus: Element | null = document.querySelector('.menus');
  // // console.log(hamburger);

  // hamburger.addEventListener('click', () => {
  //   hamburger.classList.toggle('show');
  //   menus.classList.toggle('show');
  // });
  return (
    <>
      <header>
        <ul className="headers">
          <li className="logo">
            <a href="">はなまる日付けプロトタイプ</a>
          </li>
          <li className="hamburger">
            <img src={pic2} alt="" className="open" />
            <img src={pic3} alt="" className="close" />
          </li>
          <ul className="menus">
            <li>
              {/* <a href="./">ホーム</a> */}
              <Link to="./">ホーム</Link>
            </li>
            <li>
              <Link to="calendar">カレンダー</Link>
            </li>
            <li>
              <a href="">サービス</a>
            </li>
            <li>
              <a href="">会社概要</a>
            </li>
            <li>
              <a href="">採用情報</a>
            </li>
            <li>
              <a href="">お問い合わせ</a>
            </li>
          </ul>
          <li className="search">
            <input type="search" placeholder="" />
            <label htmlFor="" className="search-icon">
              <img src={pic1} alt="" />
            </label>
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
