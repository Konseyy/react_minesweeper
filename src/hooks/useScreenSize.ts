import { useEffect, useState } from 'react';
const useWindowWidth = () => {
   const [width, setWidth] = useState<number>(window.innerWidth);
   const [height, setHeight] = useState<number>(window.innerHeight);
   function handleWindowSizeChange() {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
   }
   useEffect(() => {
      window.addEventListener('resize', handleWindowSizeChange);
      return () => {
         window.removeEventListener('resize', handleWindowSizeChange);
      };
   }, []);
   return { width, height };
};

export default useWindowWidth;
