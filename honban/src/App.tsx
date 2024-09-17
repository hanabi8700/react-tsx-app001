import { createBrowserRouter, Link, RouterProvider } from 'react-router-dom';
import Root from './Routes/Root';
import Home from './pages/Home';
import About from './pages/About';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import { Calendar } from './pages/Calendar';
import './App.css';
// import UserefTest from './pages/UserefTest';
// import Dispatch from './pages/Dispatch';
// import ConfigDataGet from './pages/ConfigDataGet';

// import ConfigDataGet from './pages/ConfigDataGet';

// vite.config.jsのbaseプロパティの値は
// import.meta.env.BASE_URLで取得できる。
const router = createBrowserRouter([
  {
    path: import.meta.env.BASE_URL, //build時にbaseの値
    //vite-env.d.tsをsrcの中に置く
    //path: "/",//必ずルートから
    element: <Root />, //共通Page
    // errorElement:<div>404 NotFund</div>
    errorElement: <NotFound />,
    children: [
      //Rootのoutlet 部分 独立page
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'calendar',
        element: <Calendar />,
      },
      {
        path: 'about',
        element: <About />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'ng',
        element: (
          <div>
            <h1>Hello World</h1>
            <Link to="../about">About Us</Link>
          </div>
        ),
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
