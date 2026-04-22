import type { RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';

const useHover = <Element extends HTMLElement>(): [RefObject<Element>, boolean] => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseOver = (): void => setIsHovered(true);
  const handleMouseOut = (): void => setIsHovered(false);

  const ref = useRef<Element>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener('mouseover', handleMouseOver);
      ref.current.addEventListener('mouseout', handleMouseOut);

      return (): void => {
        if (ref.current) {
          ref.current.removeEventListener('mouseover', handleMouseOver);
          ref.current.removeEventListener('mouseout', handleMouseOut);
        }
      };
    }
  }, [ref.current]);

  return [ref, isHovered];
};

export default useHover;
