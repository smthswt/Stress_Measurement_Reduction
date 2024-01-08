import {Dimensions, View} from 'react-native';
import {Box, Text, VStack} from 'native-base';
import React, { useEffect, useRef } from "react";
import Svg, {Circle} from 'react-native-svg';
import Animated, {
  useAnimatedProps,
  useSharedValue,
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

export const MusicCircleProgressAnimation = ({startAnimationRef}) => {
  const progress = useSharedValue(0);
  const animationStarted = useRef(false);

  const startAnimation = () => {
    if (!animationStarted.current) {
      progress.value = withTiming(1, { duration: 100000 });
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

  return (
    <VStack flex={1} alignItems={'center'} justifyItems={'center'}>
      <Box top={140}>
        <Ionicons name={'heart'} size={50} color={'#2785F4'} />
      </Box>
      <Svg style={{position: 'absolute'}}>
        <Circle
          cx={width / 2.25}
          cy={height / 4}
          r={R * 1.3}
          stroke={"#59BCFF"}
          strokeWidth={3}
          strokeDasharray={2}
        />
        <Circle
          cx={width / 2.25}
          cy={height / 4}
          r={R}
          stroke={backgroundStrokeColor}
          strokeWidth={30}
        />
        <AnimatedCircle
          cx={width / 2.25}
          cy={height / 4}
          r={R}
          stroke={strokeColor}
          strokeWidth={30}
          strokeDasharray={circleLength}
          animatedProps={animatedProps}
        />
      </Svg>
    </VStack>
  );
};
