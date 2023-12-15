import { useEffect, useRef, RefObject } from "react";

type EventHandler = (event: MouseEvent) => void;

export function useOutsideClick(
  handler: EventHandler,
  listenCapturing = true
): RefObject<HTMLDivElement> {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick: EventHandler = (e) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handler(e);
      }
    };

    document.addEventListener("click", handleClick, listenCapturing);

    return () => {
      document.removeEventListener("click", handleClick, listenCapturing);
    };
  }, [handler, listenCapturing]);

  return ref;
}
