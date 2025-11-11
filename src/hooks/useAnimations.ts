import { useSpring, useTrail, useChain, useSpringRef } from '@react-spring/web';
import { useInView } from 'react-intersection-observer';

export const useAnimations = () => {
  const fadeInSpring = useSpring({
    from: { opacity: 0, transform: 'translateY(20px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
    config: { tension: 280, friction: 60 }
  });

  const scaleSpring = useSpring({
    from: { transform: 'scale(0.9)' },
    to: { transform: 'scale(1)' },
    config: { tension: 300, friction: 30 }
  });

  return { fadeInSpring, scaleSpring };
};

export const useScrollAnimation = () => {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true
  });

  const animation = useSpring({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(50px)',
    config: { mass: 1, tension: 280, friction: 60 }
  });

  return { ref, animation };
};

export const useStaggerAnimation = (count: number) => {
  const trails = useTrail(count, {
    from: { opacity: 0, transform: 'translateX(-20px)' },
    to: { opacity: 1, transform: 'translateX(0px)' },
    config: { mass: 1, tension: 280, friction: 60 }
  });

  return trails;
};

export const useMicroInteraction = () => {
  const [isHovered, setIsHovered] = useState(false);
  
  const spring = useSpring({
    transform: isHovered ? 'scale(1.05)' : 'scale(1)',
    boxShadow: isHovered 
      ? '0 20px 40px rgba(0, 0, 0, 0.2)' 
      : '0 10px 20px rgba(0, 0, 0, 0.1)',
    config: { tension: 300, friction: 20 }
  });

  return { spring, setIsHovered };
};
