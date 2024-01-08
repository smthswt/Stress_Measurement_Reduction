import React, {useEffect} from "react";
import {Text, VStack, View, ScrollView,} from "native-base";
import {Dimensions, } from "react-native";

import {MusicList} from "./components/MusicList";


const { width: SCREEN_WIDTH } = Dimensions.get("screen");
const { height: SCREEN_HEIGHT } = Dimensions.get("screen");



/**
 * Represents a view for the Music page.
 *
 * @param {Object} navigation - The navigation object used for navigating between screens.
 *
 * @returns {JSX.Element} The rendered MusicView component.
 */
export const MusicView = ({ navigation }) => {


    return (
        <VStack style={{flex: 1}}>
            <VStack alignitems={"flex-start"} bgColor={"white"} padding={5}>
                <Text bold fontSize={18}>음원 설정</Text>
                <Text fontSize={14} color={"#616151"} mt={2}>나에게 맞는 음악을 설정해보세요.</Text>
            </VStack>

            <MusicList />

        </VStack>
    );
};