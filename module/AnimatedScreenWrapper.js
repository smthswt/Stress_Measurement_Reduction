import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const AnimatedScreenWrapper = ({
                                   screenName,
                                   currentScreen,
                                   children,
                                   animationType = 'fade'
                               }) => {
    const opacity = useRef(new Animated.Value(0)).current;
    const translateX = useRef(new Animated.Value(screenWidth)).current;
    const scale = useRef(new Animated.Value(0.9)).current;

    const animate = () => {
        if (currentScreen === screenName) {
            // 화면이 활성화될 때 애니메이션
            Animated.parallel([
                animationType === 'fade' && Animated.timing(opacity, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                animationType === 'slide' && Animated.timing(translateX, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
                animationType === 'scale' && Animated.timing(scale, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            // 화면이 비활성화될 때 애니메이션
            Animated.parallel([
                animationType === 'fade' && Animated.timing(opacity, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
                animationType === 'slide' && Animated.timing(translateX, {
                    toValue: screenWidth,
                    duration: 500,
                    useNativeDriver: true,
                }),
                animationType === 'scale' && Animated.timing(scale, {
                    toValue: 0.9,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    };

    useEffect(() => {
        animate();
    }, [currentScreen, animationType]);

    return (
        <Animated.View
            style={{
                flex: 1,
                opacity: animationType === 'fade' ? opacity : 1,
                transform: [
                    { translateX: animationType === 'slide' ? translateX : 0 },
                    { scale: animationType === 'scale' ? scale : 1 },
                ],
            }}
        >
            {children}
        </Animated.View>
    );
};

export default AnimatedScreenWrapper;
