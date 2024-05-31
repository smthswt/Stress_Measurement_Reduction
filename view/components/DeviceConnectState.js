import React, {useContext, useEffect, useState} from 'react';
import {useBLE} from "../module/BLEProvider";
import {Actionsheet, Box, Button, Center, HStack, Image, Text, useDisclose, View, VStack} from "native-base";
import firestore from "@react-native-firebase/firestore";
import {UserContext} from "../module/UserProvider";
import {useSelector} from "react-redux";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import StressResultsImage from "../images/AllStress.png";
import DeviceFirstImage from "../images/deviceConnectFirst.png";
import {useNavigation} from "@react-navigation/native";


/**
 * Represents the state of the device connection.
 * @typedef {Object} DeviceConnectState
 */
export const DeviceConnectState = () => {
    const {isOpen, onOpen, onClose} = useDisclose();
    const [reportExist, setReportExist] = useState(true)
    const [shouldOpenActionsheet, setShouldOpenActionsheet] = useState(false);
    const [bleConnectState, setBleConnectState] = useState(true);

    /**
     * Represents the connected device.
     */
    const {connectedDevice, disconnectFromDevice, findDevice, connectAndSubscribe, isConnected} = useBLE();
    const {userId} = useContext(UserContext)
    const connectStatus = useSelector(state => state.device.isConnected);
    console.log("deviceconnectState :", connectStatus)
    const navigation = useNavigation()

    const getReportData = async () => {
        try {
            const userRef = firestore().collection("Users").doc(userId);
            const bleRef = userRef.collection("Ble_Device");
            const reportRef = userRef.collection("Report");

            const bleSnapshot = await bleRef.get();
            const reportSnapshot = await reportRef.get();
            console.log("test")
            setBleConnectState(connectStatus)

            if (!connectStatus && bleSnapshot.empty) {
                setShouldOpenActionsheet(true);
                console.log("BLE device not found, opening actionsheet");
            } else if (reportSnapshot.empty && bleSnapshot.empty) {
                setReportExist(false);
                setShouldOpenActionsheet(true);
                console.log("Report and BLE device not found, opening actionsheet");
            } else if (!reportSnapshot.empty && !bleSnapshot.empty) {
                console.log("Report and BLE device found");
            }
        } catch (error) {
            console.error("Error fetching data from Firestore:", error);
        }
    };


    useEffect(() => {
        getReportData();
    }, []);

    useEffect(() => {
        if (shouldOpenActionsheet && !isConnected) {
            onOpen();
        }
    }, [shouldOpenActionsheet]);


    const DeviceFirstImage = require('../images/deviceConnectFirst.png')

    const handleDeviceEnroll = () => {
        onClose()
        navigation.navigate("SettingScreens", {screen:"Device"})
        console.log("디바이스 등록하기 버튼 클릭")
    }

    return (
        <>
            {!reportExist ? (
                <Actionsheet onClose={onClose} isOpen={isOpen} hideDragIndicator>
                    <Actionsheet.Content paddingBottom={5} paddingTop={4} justifyContent={"center"}
                                         alignItems={"center"}>
                        <>
                            <Box w="100%" h={60} marginTop={0.5} marginBottom={5} justifyContent="center"
                                 alignItems={"center"}>
                                <Text fontSize={20} color="black" fontWeight={"bold"} lineHeight={32}>
                                    디바이스를 확인해주세요!
                                </Text>
                                <Text fontSize={14} color="#616161">
                                    디바이스와의 연결이 끊어졌어요!
                                </Text>
                            </Box>
                            <Image source={DeviceFirstImage} alt={"first-visit-ble"}></Image>
                            <Center width={"100%"} mb={2} mt={4}>
                                <Box width={"92%"}>
                                    <Button bg={"#2785F4"} onPress={handleDeviceEnroll}>
                                        <Text fontWeight={600} fontSize={18} color={"white"}>디바이스 등록하기</Text>
                                    </Button>
                                </Box>
                            </Center>
                        </>
                    </Actionsheet.Content>
                </Actionsheet>
            ) : (
                isConnected ? (
                    <>
                    </>
                    ) : (
                        <Actionsheet onClose={onClose} isOpen={isOpen} hideDragIndicator>
                            <Actionsheet.Content paddingBottom={5} paddingTop={4} justifyContent={"center"}
                                                 alignItems={"center"}>
                                <>
                                    <Box w="100%" h={60} marginTop={0.5} marginBottom={5} justifyContent="center"
                                         alignItems={"center"}>
                                        <Text fontSize={20} color="black" fontWeight={"bold"} lineHeight={32}>
                                            처음이신가요?
                                        </Text>
                                        <Text fontSize={14} color="#616161">
                                            원활한 이용을 위해서 디바이스를 등록해야 해요!
                                        </Text>
                                    </Box>
                                    <Image source={DeviceFirstImage} alt={"first-visit-ble"}></Image>
                                    <Center width={"100%"} mb={2} mt={4}>
                                        <Box width={"92%"}>
                                            <Button bg={"#2785F4"} onPress={handleDeviceEnroll}>
                                                <Text fontWeight={600} fontSize={18} color={"white"}>디바이스 등록하기</Text>
                                            </Button>
                                        </Box>
                                    </Center>
                                </>
                            </Actionsheet.Content>
                        </Actionsheet>
                    )
            )}
        </>
    );
};
