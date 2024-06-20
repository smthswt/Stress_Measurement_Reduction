import {Dimensions} from 'react-native';
import {Box, VStack} from 'native-base';
import React, {useEffect, useState} from 'react';
import Svg, {Circle} from 'react-native-svg';
import Animated, {Easing, useAnimatedProps, useSharedValue, withRepeat, withTiming,} from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';

/**
 * React component for displaying a calendar view.
 *
 * @component
 * @param {object} navigation - Navigation object used for navigating between screens.
 * @returns {ReactElement} - The rendered component.
 */
const {width, height} = Dimensions.get('window');
console.log(width);
console.log(height);
const circleLength = 700;
const R = circleLength / (2 * Math.PI);

const backgroundStrokeColor = 'rgba(173, 174, 179, 0.6)';
const strokeColor = '#FFFFFF';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const AnimatedEllipse = Animated.createAnimatedComponent(Circle);

export const CircleProgressAnimation = ({navigation, seconds}) => {
  const [isAnimationStarted, setIsAnimationStarted] = useState(false);
  const progress = useSharedValue(0);
  const scaleValue =  useSharedValue(0.8)

  const duration = seconds * 1000;

  useEffect(() => {
    if (!isNaN(duration) && duration > 0) {
      const timer = setTimeout(() => {
        setIsAnimationStarted(true);
      }, 200); // 200밀리초 지연
      return () => clearTimeout(timer);
    }
  }, [duration]);

  useEffect(() => {
    if (isAnimationStarted) {
      console.log("duration start", duration);
      // 애니메이션 duration 밀리초
      progress.value = withTiming(1, {duration: duration});
      scaleValue.value = withRepeat(withTiming(2, {duration: 1300, easing: Easing.linear}), -1);
    }
  }, [isAnimationStarted]);

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: circleLength * (1 - progress.value),
    };
  });

  const animated2Props = useAnimatedProps(() => {
    return {
      r: 50 * scaleValue.value,
    };
  });

  const animated3Props = useAnimatedProps(() => {
    return {
      r: 30 * scaleValue.value,
    }
  });

  return (
    <VStack flex={1} alignItems={'center'} justifyItems={'center'} justifyContent={"center"}>
      <Svg>
        <Circle
          cx={width/2}
          cy={height / 4}
          r={R * 1.3}
          stroke={'rgba(255,255,255,0.5)'}
          strokeWidth={4}
          strokeDasharray={2}
        />
        <Circle
          cx={width/2}
          cy={height / 4}
          r={R}
          stroke={backgroundStrokeColor}
          strokeWidth={30}
        />
        <AnimatedCircle
          cx={width/2}
          cy={height / 4}
          r={R}
          stroke={strokeColor}
          strokeWidth={30}
          strokeDasharray={circleLength}
          animatedProps={animatedProps}
        />
        <AnimatedEllipse cx={width/2}
                         cy={height/4}
                         fill={'rgba(255, 255, 255, 0.1)'}
                         animatedProps={animated2Props}
        />
        <AnimatedEllipse cx={width/2}
                         cy={height/4}
                         fill={'rgba(255, 255, 255, 0.2)'}
                         animatedProps={animated3Props}
        />
      </Svg>
      <Box top={height/4.5} style={{position: 'absolute'}} width={"100%"} alignItems={"center"}>
        <Ionicons name={'heart'} size={50} color={'#FFFFFF'}/>
      </Box>
    </VStack>
  );
};
