import React from 'react';
import { Link } from 'react-router-dom';
const NotFound = () => {
  return (
    <main>
      <h1>404</h1>
      <h1>存在しないページです calendar3</h1>
      <Link to="./">Home</Link>
    </main>
  );
};

export default NotFound;
