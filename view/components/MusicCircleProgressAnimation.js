import {Dimensions, View} from 'react-native';
import {Box, Text, VStack} from 'native-base';
import React, { useEffect, useRef } from "react";
import Svg, {Circle} from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedProps,
  useSharedValue, withRepeat,
  withTiming,
} from 'react-native-reanimated';
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
const circleLength = 650;
const R = circleLength / (2 * Math.PI);

const backgroundStrokeColor = '#E8E9ED';
const strokeColor = '#2785F4';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const AnimatedEllipse = Animated.createAnimatedComponent(Circle);

export const MusicCircleProgressAnimation = ({startAnimationRef, seconds}) => {
  const progress = useSharedValue(0);
  const animationStarted = useRef(false);
  const scaleValue =  useSharedValue(0.8)

  const duration = (seconds * 1000) + 5000

  const startAnimation = () => {
    if (!animationStarted.current) {
      progress.value = withTiming(1, { duration: duration });
      scaleValue.value = withRepeat(withTiming(2, {duration:1300, easing:Easing.linear}), -1)
      animationStarted.current = true;
    }
  };

  // Assign the startAnimation function to the provided ref
  if (startAnimationRef) {
    startAnimationRef.current = startAnimation;
  }

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: circleLength * (1 - progress.value),
    };
  });

  const animated2Props = useAnimatedProps(() => {
    return {
      r: 40 * scaleValue.value,
    };
  });

  const animated3Props = useAnimatedProps(() => {
    return {
      r: 20 * scaleValue.value,
    }
  });

  return (
    <VStack flex={1} alignItems={'center'} justifyItems={'center'}>
      <Svg style={{position: 'absolute'}}>
        <Circle
          cx={width/2-20}
          cy={height / 4}
          r={R * 1.3}
          stroke={'rgba(89,188,255,0.5)'}
          strokeWidth={4}
          strokeDasharray={2}
        />
        <Circle
          cx={width / 2-20}
          cy={height / 4}
          r={R}
          stroke={backgroundStrokeColor}
          strokeWidth={30}
        />
        <AnimatedCircle
          cx={width / 2 -20}
          cy={height / 4}
          r={R}
          stroke={strokeColor}
          strokeWidth={30}
          strokeDasharray={circleLength}
          animatedProps={animatedProps}
        />
        <AnimatedEllipse cx={width/2-20}
                         cy={height/4}
                         fill={'rgba(39, 133, 244, 0.1)'}
                         animatedProps={animated2Props}
        />
        <AnimatedEllipse cx={width/2-20}
                         cy={height/4}
                         fill={'rgba(39, 133, 244, 0.2)'}
                         animatedProps={animated3Props}
        />
      </Svg>
      <Box top={height/4 -20} style={{position: 'absolute'}} width={"100%"} alignItems={"center"}>
        <Ionicons name={'heart'} size={40} color={'#2785F4'} />
      </Box>
    </VStack>
  );
};
