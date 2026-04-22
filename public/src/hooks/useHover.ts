import type { RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';

const useHover = <Element extends HTMLElement>(): [RefObject<Element>, boolean] => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseOver = (): void => setIsHovered(true);
  const handleMouseOut = (): void => setIsHovered(false);

  const ref = useRef<Element>(null);

  useEffect(() => {
    const element = ref.current;
    if (element) {
      element.addEventListener('mouseover', handleMouseOver);
      element.addEventListener('mouseout', handleMouseOut);

      return (): void => {
        element.removeEventListener('mouseover', handleMouseOver);
        element.removeEventListener('mouseout', handleMouseOut);
      };
    }
  }, []);

  return [ref, isHovered];
};

export default useHover;
