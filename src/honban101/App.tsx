import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Root from './Routes/Root';
import Home from './pages/Home';
import About from './pages/About';
import NotFound from './pages/NotFound';
import Login from './pages/Login';
import { Calendar } from './pages/Calendar';
import './App.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    // errorElement:<div>404 NotFund</div>
    errorElement: <NotFound />,
    children: [
      //Rootのoutlet 部分
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'calendar',
        element: <Calendar />,
      },
      {
        path: 'About',
        element: <About />,
      },

    ],
  },
  {
    path: 'login',
    element: <Login />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
