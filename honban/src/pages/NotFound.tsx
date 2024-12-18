import { Link, useRouteError } from 'react-router-dom';

const NotFound = () => {
  const error = useRouteError();
  console.error(error);
  return (
    <main>
      <h1>404</h1>
      <h1>存在しないページです calendar3</h1>
      {/* <p>{error.statusText || error.message}</p> */}
      <Link to="./">Home</Link>
    </main>
  );
};

export default NotFound;
