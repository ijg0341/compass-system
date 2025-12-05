
import { useEffect, createContext, useContext, useState, useCallback, useMemo } from 'react';
import Lenis from 'lenis';

type LenisContextType = {
  lenis: Lenis | null;
  stop: () => void;
  start: () => void;
};

const LenisContext = createContext<LenisContextType>({
  lenis: null,
  stop: () => {},
  start: () => {},
});

// eslint-disable-next-line react-refresh/only-export-components
export const useLenis = () => useContext(LenisContext);

export default function LenisScroll() {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);

  const stop = useCallback(() => {
    if (lenisInstance) {
      lenisInstance.stop();
    }
  }, [lenisInstance]);

  const start = useCallback(() => {
    if (lenisInstance) {
      lenisInstance.start();
    }
  }, [lenisInstance]);

  const contextValue = useMemo(() => ({
    lenis: lenisInstance,
    stop,
    start,
  }), [lenisInstance, stop, start]);

  useEffect(() => {
    // 클라이언트 사이드에서만 Lenis 초기화
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLenisInstance(lenis);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // 전역 Lenis 인스턴스 설정
    (window as { lenis?: Lenis }).lenis = lenis;

    return () => {
      lenis.destroy();
      setLenisInstance(null);
      (window as { lenis?: Lenis }).lenis = undefined;
    };
  }, []);

  return (
    <LenisContext.Provider value={contextValue}>
      {null}
    </LenisContext.Provider>
  );
}

export { LenisContext };
