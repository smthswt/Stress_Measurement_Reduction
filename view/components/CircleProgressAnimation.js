import {Animated, Dimensions, View} from "react-native";
import {Text, VStack} from "native-base";
import React, {useEffect} from "react";
import Svg, {Circle} from "react-native-svg";
import {useAnimatedProps, useSharedValue, withTiming} from "react-native-reanimated";

/**
 * React component for displaying a calendar view.
 *
 * @component
 * @param {object} navigation - Navigation object used for navigating between screens.
 * @returns {ReactElement} - The rendered component.
 */
const { width, height } = Dimensions.get('window');
console.log(width)
console.log(height)
const circleLength = 800
const R = circleLength / (2 * Math.PI)

const backgroundStrokeColor = '#ADAEB3'
const strokeColor = '#FFFFFF'

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

export const CircleProgressAnimation = ({ navigation }) => {

    const progress = useSharedValue(0)

    useEffect(() => {
        progress.value = withTiming(1, {duration: 10000})
    }, []);

    const animatedProps = useAnimatedProps(() => {
        return {
            strokeDashoffset: circleLength * progress.value,
        };
    });

    return(
    <VStack flex={1}>
        <Svg>
            <Circle cx={width / 2.25} cy={height / 4} r={R*1.2} stroke={strokeColor} strokeWidth={2} strokeDasharray={10}/>
            <Circle cx={width / 2.25} cy={height / 4} r={R} stroke={backgroundStrokeColor} strokeWidth={30}/>
            <AnimatedCircle
                cx={width / 2.25}
                cy={height / 4}
                r={R}
                stroke={strokeColor}
                strokeWidth={30}
                strokeDasharray={circleLength}
                animatedProps={animatedProps}/>
        </Svg>
    </VStack>
);
}
