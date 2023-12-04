import React from 'react';
import { View, StyleSheet } from 'react-native';

const Stack = ({ children, direction = 'column', ...props }) => {
    return (
        <View style={[styles.stack, { flexDirection: direction }, props.style]}>
            {children}
        </View>
    );
};

const styles = StyleSheet.create({
    stack: {
        // 기본 스타일 지정
    },
});

export default Stack;
