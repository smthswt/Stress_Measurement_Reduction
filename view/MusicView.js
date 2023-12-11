import {View} from "react-native";
import {Text} from "native-base";
import React from "react";

/**
 * Represents a view for the Music page.
 *
 * @param {Object} navigation - The navigation object used for navigating between screens.
 *
 * @returns {JSX.Element} The rendered MusicView component.
 */
export const MusicView = ({ navigation }) => (
    <View>
        <Text>Music</Text>
        <Text>이 페이지는 아직 준비 중 입니다.</Text>
    </View>
);