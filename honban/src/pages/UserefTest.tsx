import { useState, useRef } from 'react';

export default function UserefTest() {
  const [countState, setCountState] = useState(0);
  const countRef = useRef(0);
  const handleStateClick = () => setCountState(countState + 1);
  const handleRefClick = () => countRef.current++;

  console.log('レンダリング！', countState, countRef.current);

  return (
    <div className="App">
      <p>{countState}</p>
      <button onClick={handleStateClick}>state +1</button>

      <p>{countRef.current}</p>
      <button onClick={handleRefClick}>ref +1</button>
    </div>
  );
}
