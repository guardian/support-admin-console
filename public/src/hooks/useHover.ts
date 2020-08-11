import { useState, useRef, useEffect, RefObject } from "react";

const useHover = <Element extends HTMLElement>(): [
  RefObject<Element>,
  boolean
] => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseOver = () => setIsHovered(true);
  const handleMouseOut = () => setIsHovered(false);

  const ref = useRef<Element>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener("mouseover", handleMouseOver);
      ref.current.addEventListener("mouseout", handleMouseOut);

      return () => {
        if (ref.current) {
          ref.current.removeEventListener("mouseover", handleMouseOver);
          ref.current.removeEventListener("mouseout", handleMouseOut);
        }
      };
    }
  }, [ref.current]);

  return [ref, isHovered];
};

export default useHover;
