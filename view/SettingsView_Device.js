import {Box, HStack, Image, Pressable, Text, View, VStack} from "native-base";
import React, { useEffect } from "react";
import {TouchableOpacity} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import {useSelector} from "react-redux";


/**
 * React component for displaying a calendar view.
 *
 * @component
 * @param {object} navigation - Navigation object used for navigating between screens.
 * @returns {ReactElement} - The rendered component.
 */

export const SettingsView_Device = ({ navigation }) => {
    const connectDevice = useSelector(state => state.device.connectDevice);
    const connectedStatus = useSelector(state => state.device.isConnected);
    console.log("setting connectDevice info id:", connectDevice);
    console.log("setting device connection info :", connectedStatus)

    const deviceImage = require('./images/deviceImage.png')

    const handleEnrollingDevice = () => {
        navigation.navigate("DeviceSettingScreens", {screen:"Enroll"})
    };

    const handleDeviceList = () => {
        navigation.navigate("DeviceSettingScreens", {screen:"Devicelist"})
    };

    return (
        <VStack flex={1}>
            <HStack alignitems={"center"} justifyContent={"flex-start"} bgColor={"white"} padding={5}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => {navigation.goBack()}}>
                    <Ionicons name={"arrow-back"} color={'#222222'} size={25} />
                </TouchableOpacity>
                <Text bold fontSize={18} marginLeft={3}>디바이스 설정</Text>
            </HStack>

            <VStack flex={1} bg={"white"} justifyContent={"center"} alignItems={"center"}>
                <VStack space={3} alignItems={"center"} p={4}>
                <Box alignItems={"center"}>
                    <Image source={deviceImage} size={240} alt={"device Image"}/>
                </Box>
                <HStack space={3} alignItems={"center"} marginTop={4}>
                    <AntDesign name={"checkcircle"} size={15} color={"#3DC061"} />
                <Text fontSize={15} color={"#3DC061"}>디바이스가 연결 되어 있어요.</Text>
                </HStack>
                </VStack>
            </VStack>

            <View flex={1.3} >
                <VStack margin={5} space={4}>
                    <Pressable onPress={handleEnrollingDevice}>
                <HStack backgroundColor={"white"} p={4} shadow={2} justifyContent={"space-between"} alignItems={"center"}>
                    <VStack space={2.5}>
                        <Text fontSize={"md"} fontWeight={"bold"}>디바이스 등록하기</Text>
                        <Text fontSize={"xs"}>디바이스를 연결시켜 드릴게요.</Text>
                    </VStack>
                    <Ionicons name={"chevron-forward"} size={25} color={"black"}/>
                </HStack>
                    </Pressable>
                    <Pressable onPress={handleDeviceList}>
                    <HStack backgroundColor={"white"} p={4} shadow={2} justifyContent={"space-between"} alignItems={"center"}>
                        <VStack space={2.5}>
                            <Text fontSize={"md"} fontWeight={"bold"}>디바이스 목록</Text>
                            <Text fontSize={"xs"}>등록한 디바이스를 관리할 수 있어요.</Text>
                        </VStack>
                        <Ionicons name={"chevron-forward"} size={25} color={"black"}/>
                    </HStack>
                    </Pressable>
                </VStack>
            </View>

        </VStack>
    );
};







