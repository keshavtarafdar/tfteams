import React, { useState, useEffect, useRef } from 'react';

const useSprite = ({ sprite, jsonData, frameRate = 60 }) => {
  const [frame, setFrame] = useState(0);

  /**
   * A hook function that requires a trigger to run, useful for rendering some kind
   * of change that's dependent on external data (e.g. waiting to format the
   * results of a GET request)
   */
  useEffect(() => {
    if (!jsonData || !jsonData.frames) return;

    const frameCount = Object.keys(jsonData.frames).length;

    const interval = setInterval(() => {
      setFrame(prevFrame => (prevFrame + 1) % frameCount);
    }, frameRate);

    return () => clearInterval(interval);
  }, [jsonData, frameRate]);

  return frame;
};

const SpriteAnimation = () => {
  const spriteSheetPath = '../assets/poro-loading.png';
  const jsonPath = '../assets/poro-loading.json';

  const [jsonData, setJsonData] = useState(null);

  useEffect(() => {
    fetch(jsonDataUrl)
    .then(res=> res.json())
    .then(setJsonData)
    .catch(console.error);
  }, [jsonDataUrl]);

  const frameIndex = useSprite({ spriteSheetPath, jsonData });
  const frameName = Object.keys(jsonData.frames)[frameIndex];
  const frameData = jsonData.frames[frameName].frame;

  const style = {
    backgroundImage: `url(${spriteSheetPath})`,
    backgroundPosition: `-${frameData.x}px -${frameData.y}px`,
    width: `${frameData.w}px`,
    height: `${frameData.h}px`,
    zoom: 2,
  }

  return <div style={style} />
}

export default SpriteAnimation;