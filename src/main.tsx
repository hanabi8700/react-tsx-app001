import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
// import './index.css';
import Root from './routes/root';
import Index from './routes/index';
import Contact from './routes/contact';
import About from './routes/about';
import Access from './routes/access';
import Honban from './routes/honban';

const router = createBrowserRouter([
  {
    // path: '/', ////http://hostname/path/...
    path: import.meta.env.BASE_URL, //build時にbaseの値

    element: <Root />,
    children: [
      { index: true, element: <Index /> },
      { path: 'contact', element: <Contact /> },
      { path: 'about', element: <About /> },
      { path: 'access', element: <Access /> },
      { path: 'honban', element: <Honban /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
