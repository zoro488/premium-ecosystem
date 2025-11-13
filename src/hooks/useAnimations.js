import { useEffect, useRef, useState } from 'react';

import { useMotionValue, useSpring } from 'framer-motion';

/**
 * 🎨 SISTEMA DE ANIMACIONES PREMIUM AAA
 *
 * Hook ultra-avanzado con microanimaciones, transiciones fluidas,
 * efectos de cursor, parallax, morphing y más
 */

// ============================================
// 1. CURSOR TRACKING & MAGNETIC EFFECTS
// ============================================

export const useMagneticCursor = (strength = 0.3) => {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const magnetX = useSpring(x, springConfig);
  const magnetY = useSpring(y, springConfig);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distanceX = (e.clientX - centerX) * strength;
      const distanceY = (e.clientY - centerY) * strength;

      x.set(distanceX);
      y.set(distanceY);
    };

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => {
      setIsHovered(false);
      x.set(0);
      y.set(0);
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength, x, y]);

  return {
    ref,
    style: {
      x: magnetX,
      y: magnetY,
    },
    isHovered,
  };
};

// ============================================
// 2. PARALLAX SCROLL EFFECTS
// ============================================

export const useParallax = (speed = 0.5) => {
  const ref = useRef(null);
  const y = useMotionValue(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
      y.set(scrollProgress * speed * 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, y]);

  return { ref, y };
};

// ============================================
// 3. MORPHING & SHAPE ANIMATIONS
// ============================================

export const useMorphing = () => {
  const [shape, setShape] = useState('circle');

  const morphVariants = {
    circle: {
      borderRadius: '50%',
      rotate: 0,
      scale: 1,
    },
    square: {
      borderRadius: '0%',
      rotate: 0,
      scale: 1,
    },
    rounded: {
      borderRadius: '30%',
      rotate: 45,
      scale: 1.1,
    },
    diamond: {
      borderRadius: '0%',
      rotate: 45,
      scale: 1.1,
    },
  };

  const transition = {
    type: 'spring',
    damping: 15,
    stiffness: 200,
    mass: 0.8,
  };

  return {
    shape,
    setShape,
    variants: morphVariants,
    transition,
  };
};

// ============================================
// 4. RIPPLE EFFECT (Material Design)
// ============================================

export const useRipple = () => {
  const [ripples, setRipples] = useState([]);

  const addRipple = (e) => {
    const rippleContainer = e.currentTarget.getBoundingClientRect();
    const size = Math.max(rippleContainer.width, rippleContainer.height);
    const x = e.clientX - rippleContainer.left - size / 2;
    const y = e.clientY - rippleContainer.top - size / 2;

    const newRipple = {
      x,
      y,
      size,
      id: Date.now(),
    };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  return { ripples, addRipple };
};

// ============================================
// 5. FLOATING ANIMATION
// ============================================

export const useFloating = (duration = 3) => {
  const y = useMotionValue(0);
  const ySpring = useSpring(y, { stiffness: 50, damping: 10 });

  useEffect(() => {
    let animationFrameId;
    let time = 0;

    const animate = () => {
      time += 0.016; // ~60fps
      const offset = Math.sin((time * Math.PI) / duration) * 10;
      y.set(offset);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [duration, y]);

  return { y: ySpring };
};

// ============================================
// 6. GLASS MORPHISM BLUR
// ============================================

export const useGlassMorphism = (intensity = 10) => {
  const [isVisible, setIsVisible] = useState(false);

  const style = {
    backdropFilter: `blur(${intensity}px) saturate(180%)`,
    WebkitBackdropFilter: `blur(${intensity}px) saturate(180%)`,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  };

  return { style, isVisible, setIsVisible };
};

// ============================================
// 7. STAGGER CHILDREN ANIMATION
// ============================================

export const useStaggerChildren = (staggerDelay = 0.1) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        damping: 15,
        stiffness: 200,
      },
    },
  };

  return { containerVariants, itemVariants };
};

// ============================================
// 8. ELASTIC SCALE ON HOVER
// ============================================

export const useElasticHover = () => {
  const scale = useMotionValue(1);
  const scaleSpring = useSpring(scale, {
    stiffness: 300,
    damping: 10,
    mass: 0.5,
  });

  const handleMouseEnter = () => scale.set(1.05);
  const handleMouseLeave = () => scale.set(1);
  const handleMouseDown = () => scale.set(0.95);
  const handleMouseUp = () => scale.set(1.05);

  return {
    scale: scaleSpring,
    handlers: {
      onMouseEnter: handleMouseEnter,
      onMouseLeave: handleMouseLeave,
      onMouseDown: handleMouseDown,
      onMouseUp: handleMouseUp,
    },
  };
};

// ============================================
// 9. GRADIENT ANIMATION
// ============================================

export const useAnimatedGradient = (colors = ['#667eea', '#764ba2', '#f093fb']) => {
  const [gradientIndex, setGradientIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setGradientIndex((prev) => (prev + 1) % colors.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [colors.length]);

  const currentColor = colors[gradientIndex];
  const nextColor = colors[(gradientIndex + 1) % colors.length];

  return {
    background: `linear-gradient(135deg, ${currentColor}, ${nextColor})`,
    animate: {
      background: [
        `linear-gradient(135deg, ${currentColor}, ${nextColor})`,
        `linear-gradient(135deg, ${nextColor}, ${currentColor})`,
      ],
    },
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: 'reverse',
    },
  };
};

// ============================================
// 10. TYPING ANIMATION
// ============================================

export const useTypingAnimation = (text, speed = 50) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    setIsComplete(false);

    const interval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index));
        index++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return { displayedText, isComplete };
};

// ============================================
// 11. PARTICLES BACKGROUND
// ============================================

export const useParticles = (count = 50) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 1,
      duration: Math.random() * 20 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, [count]);

  return { particles };
};

// ============================================
// 12. SHIMMER/SKELETON LOADING
// ============================================

export const useShimmer = () => {
  const shimmerVariants = {
    animate: {
      backgroundPosition: ['0% 0%', '100% 0%'],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  };

  const shimmerStyle = {
    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
    backgroundSize: '200% 100%',
  };

  return { shimmerVariants, shimmerStyle };
};

// ============================================
// 13. SCROLL PROGRESS INDICATOR
// ============================================

export const useScrollProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollProgress = (scrollTop / docHeight) * 100;
      setProgress(scrollProgress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return { progress };
};

// ============================================
// 14. 3D TILT EFFECT (2.5D)
// ============================================

export const use3DTilt = (intensity = 10) => {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;

      const tiltX = (y - 0.5) * intensity;
      const tiltY = (x - 0.5) * -intensity;

      setTilt({ x: tiltX, y: tiltY });
    };

    const handleMouseLeave = () => {
      setTilt({ x: 0, y: 0 });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [intensity]);

  return {
    ref,
    style: {
      transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
      transition: 'transform 0.1s ease-out',
    },
  };
};

// ============================================
// 15. WAVE ANIMATION
// ============================================

export const useWaveAnimation = () => {
  const waveVariants = {
    animate: {
      d: [
        'M0,50 Q25,40 50,50 T100,50 V100 H0 Z',
        'M0,50 Q25,60 50,50 T100,50 V100 H0 Z',
        'M0,50 Q25,40 50,50 T100,50 V100 H0 Z',
      ],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  };

  return { waveVariants };
};

// ============================================
// 16. INTERSECTION OBSERVER (OPTIMIZADO)
// ============================================

export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && !hasIntersected) {
          setHasIntersected(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [options, hasIntersected]);

  return { ref, isIntersecting, hasIntersected };
};

// ============================================
// 17. PREFERS REDUCED MOTION (ACCESIBILIDAD)
// ============================================

export const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// ============================================
// 18. MOUSE POSITION (THROTTLED)
// ============================================

export const useMousePosition = (throttleMs = 50) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const lastUpdate = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const now = Date.now();
      if (now - lastUpdate.current >= throttleMs) {
        setPosition({ x: e.clientX, y: e.clientY });
        lastUpdate.current = now;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [throttleMs]);

  return position;
};

// ============================================
// 19. DEBOUNCE
// ============================================

export const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

// ============================================
// 20. ANIMATION FRAME
// ============================================

export const useAnimationFrame = (callback, dependencies = []) => {
  const requestRef = useRef();
  const previousTimeRef = useRef();

  useEffect(() => {
    const animate = (time) => {
      if (previousTimeRef.current !== undefined) {
        const deltaTime = time - previousTimeRef.current;
        callback(deltaTime);
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, dependencies); // eslint-disable-line react-hooks/exhaustive-deps
};

// ============================================
// 21. ELEMENT SIZE
// ============================================

export const useElementSize = () => {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setSize({ width, height });
      }
    });

    resizeObserver.observe(element);
    return () => resizeObserver.disconnect();
  }, []);

  return { ref, size };
};

// ============================================
// 22. HOVER DETECTION
// ============================================

export const useHover = () => {
  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return { ref, isHovered };
};

// ============================================
// 23. MEDIA QUERY
// ============================================

export const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handleChange = (e) => {
      setMatches(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);

  return matches;
};

// ============================================
// 24. PERFORMANCE MONITOR
// ============================================

export const usePerformanceMonitor = () => {
  const [fps, setFps] = useState(60);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  useEffect(() => {
    let animationFrameId;

    const measureFPS = () => {
      frameCount.current++;
      const currentTime = performance.now();
      const elapsed = currentTime - lastTime.current;

      if (elapsed >= 1000) {
        setFps(Math.round((frameCount.current * 1000) / elapsed));
        frameCount.current = 0;
        lastTime.current = currentTime;
      }

      animationFrameId = requestAnimationFrame(measureFPS);
    };

    animationFrameId = requestAnimationFrame(measureFPS);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return { fps };
};

// ============================================
// 25. LAZY LOAD
// ============================================

export const useLazyLoad = () => {
  const { ref, isIntersecting, hasIntersected } = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
  });

  return { ref, shouldLoad: hasIntersected };
};

// ============================================
// EXPORT ALL
// ============================================

export default {
  // Cursor & Mouse
  useMagneticCursor,
  useMousePosition,
  useHover,

  // Scroll & Parallax
  useParallax,
  useScrollProgress,

  // Morphing & Shapes
  useMorphing,
  use3DTilt,

  // Effects
  useRipple,
  useFloating,
  useGlassMorphism,
  useElasticHover,
  useAnimatedGradient,
  useWaveAnimation,
  useShimmer,
  useParticles,

  // Text & Content
  useTypingAnimation,

  // Layout & Lists
  useStaggerChildren,
  useIntersectionObserver,
  useElementSize,

  // Performance
  usePrefersReducedMotion,
  useDebounce,
  useAnimationFrame,
  usePerformanceMonitor,
  useLazyLoad,
  useMediaQuery,
};
