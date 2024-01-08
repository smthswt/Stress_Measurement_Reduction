import {Dimensions, View} from 'react-native';
import {Box, Text, VStack} from 'native-base';
import React, {useEffect} from 'react';
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
const circleLength = 700;
const R = circleLength / (2 * Math.PI);

const backgroundStrokeColor = '#707488';
const strokeColor = '#FFFFFF';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

export const CircleProgressAnimation = ({navigation}) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(1, {duration: 100000});
  }, []);

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: circleLength * (1 - progress.value),
    };
  });

  return (
    <VStack flex={1} alignItems={'center'} justifyItems={'center'}>
      <Box top={140}>
        <Ionicons name={'heart'} size={50} color={'#FFFFFF'} />
      </Box>
      <Svg style={{position: 'absolute'}}>
        <Circle
          cx={width / 2.25}
          cy={height / 4}
          r={R * 1.2}
          stroke={strokeColor}
          strokeWidth={2}
          strokeDasharray={10}
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
