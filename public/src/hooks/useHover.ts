import { RefObject, useCallback, useEffect, useRef, useState } from 'react';

const useHover = <Element extends HTMLElement>(): [RefObject<Element>, boolean] => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseOver = useCallback((): void => setIsHovered(true), []);
  const handleMouseOut = useCallback((): void => setIsHovered(false), []);

  const ref = useRef<Element>(null);

  useEffect(() => {
    const node = ref.current;
    if (node) {
      node.addEventListener('mouseover', handleMouseOver);
      node.addEventListener('mouseout', handleMouseOut);

      return (): void => {
        node.removeEventListener('mouseover', handleMouseOver);
        node.removeEventListener('mouseout', handleMouseOut);
      };
    }
  }, [handleMouseOver, handleMouseOut]);

  return [ref, isHovered];
};

export default useHover;
