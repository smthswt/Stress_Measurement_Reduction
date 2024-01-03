import {HStack, Text, VStack} from "native-base";
import React, { useEffect } from "react";
import { BackHandler, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";


/**
 * React component for displaying a calendar view.
 *
 * @component
 * @param {object} navigation - Navigation object used for navigating between screens.
 * @returns {ReactElement} - The rendered component.
 */

export const SettingsView_Device = ({ navigation }) => {

    return (
        <VStack flex={1}>
            <HStack alignitems={"center"} justifyContent={"flex-start"} bgColor={"white"} padding={5}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => {navigation.goBack()}}>
                    <Ionicons name={"arrow-back"} color={'#222222'} size={25} />
                </TouchableOpacity>
                <Text bold fontSize={18} marginLeft={3}>디바이스 설정</Text>
            </HStack>

            <VStack flex={1} bg={"lightBlue.50"}>
                <Text>Device Image</Text>
                <Text>디바이스가 연결되어 있어요.</Text>
            </VStack>
            <VStack flex={1} bg={"red.100"}>
                <Text>디바이스 등록하기</Text>
                <Text>디바이스 목록</Text>
            </VStack>


        </VStack>
    );
};







