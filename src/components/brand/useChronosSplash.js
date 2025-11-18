/**
 * 🎯 Hook para controlar el Splash Screen de CHRONOS
 */
import { useState } from 'react';

export function useChronosSplash() {
  const [showSplash, setShowSplash] = useState(true);

  const hideSplash = () => {
    setShowSplash(false);
  };

  return { showSplash, hideSplash };
}

export default useChronosSplash;
