import React, {useState} from "react";
import {Box, Button, Center, HStack, Image, Pressable, Text, useDisclose, View, VStack} from "native-base";
import {TouchableOpacity} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import deviceImagewithBlueBack from "./images/DevaiceImagewithBlue.png";
import AntDesign from "react-native-vector-icons/AntDesign";
import DeviceListActionSheet from "./components/DeviceListActionSheet";

const DeviceListView = ({navigation}) => {
    const {isOpen, onOpen, onClose} = useDisclose();
    const [selectedDevice, setSelectedDevice] = useState();

    const deviceImageBlueBack = require('./images/DevaiceImagewithBlue.png')

    const handleCancelConnect = () => {
        console.log("연결해제 버튼 클릭 됌.")
    };

    const deviceData = [{
        name: "kim's device",
        date: "2024/01/11",
        connectState: true,
    }, {
        name: "lee's device",
        date: "2024/01/10",
        connectState: false,
    }
    ];

    const handleOnOpen = (device) => {
        console.log("actionsheet open")
        onOpen();
    };

    return(
        <View flex={1}>
            <HStack alignitems={"center"} justifyContent={"flex-start"} bgColor={"white"} padding={5}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => {navigation.goBack()}}>
                    <Ionicons name={"arrow-back"} color={'#222222'} size={25} />
                </TouchableOpacity>
                <Text bold fontSize={18} marginLeft={3}>디바이스 목록</Text>
            </HStack>

            <VStack flex={1} margin={5} space={4}>
                {deviceData.map((device, index) => (
                <HStack backgroundColor={"white"} p={4} shadow={2} justifyContent={"space-between"} alignItems={"center"}>
                    <VStack space={6} justifyContent={"space-between"} pb={1}>
                        <VStack space={1.5} pt={1}>
                        <Text fontSize={16} fontWeight={"bold"}>{device.name}</Text>
                        <HStack space={2} alignItems={"center"}>
                            <Text color={"#ADADAD"} fontSize={12}>등록 날짜</Text>
                            <Box borderWidth={0.5} height={2} borderColor={"#ADADAD"} />
                            <Text color={'#ADADAD'} fontSize={12}>{device.date}</Text>
                        </HStack>
                        <HStack space={2} alignItems={"center"}>
                            <AntDesign name={device.connectState ? "checkcircle" : "exclamationcircle"} size={13} color={device.connectState ? "#3DC061" : "#EB5147"} />
                            <Text color={device.connectState ? "#3DC061" : "#EB5147"} fontSize={12}>{device.connectState ? "연결" : "연결 오류"}</Text>
                        </HStack>
                        </VStack>
                        <Pressable onPress={handleOnOpen} borderWidth={1} alignItems={"center"} justifyContent={"center"}
                                   borderRadius={3} width={81} borderColor={"#2785F4"} py={1.5}>
                            <Text color={"#2785F4"} fontSize={12}>연결 해제</Text>
                            <DeviceListActionSheet isOpen={isOpen} onOpen={onOpen} onClose={onClose} />
                        </Pressable>
                    </VStack>
                    <Box>
                        <Image source={deviceImageBlueBack} alt={"Device Image"}></Image>
                    </Box>
                </HStack>
                ))}


            </VStack>
        </View>
    )
};

export default DeviceListView;