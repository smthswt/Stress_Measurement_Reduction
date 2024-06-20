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
import DeviceConnectWarn from "../images/deviceConnectWarn.png";


/**
 * Represents the state of the device connection.
 * @typedef {Object} DeviceConnectState
 */
export const DeviceConnectState = () => {
    const {isOpen, onOpen, onClose} = useDisclose();
    const [reportExist, setReportExist] = useState(true)
    const [shouldOpenActionsheet, setShouldOpenActionsheet] = useState(false);
    const [bleConnectState, setBleConnectState] = useState(true);
    const [dataloaded, setDataLoaded] = useState(false);
    const [firstVisit, setFirstVisit] = useState(false)
    const [noConnection, setNoConnection] = useState(false)

    /**
     * Represents the connected device.
     */
    const {connectedDevice, disconnectFromDevice, findDevice, connectAndSubscribe, isConnected} = useBLE();
    const {userId} = useContext(UserContext)
    // Redux store에서 디바이스 정보 가져오기
    const connectDevice = useSelector(state => state.device.connectDevice);
    const connectStatus = useSelector(state => state.device.isConnected);
    // console.log("deviceconnectStatee :", connectStatus, connectedDevice)
    const navigation = useNavigation()

    const getReportData = async () => {
        try {
            const userRef = firestore().collection("Users").doc(userId);
            const bleRef = userRef.collection("Ble_Devices");

            // Ble_Device 컬렉션에서 문서 가져오기
            const bleSnapshot = await bleRef.get();
            const bleDocuments = [];

            bleSnapshot.forEach(doc => {
                const data = doc.data();
                bleDocuments.push({id: data.id, isConnect: data.isConnect});
            });

            console.log("bleSnapshot size:", bleSnapshot.size);
            // console.log("bleDocuments:", bleDocuments[0].isConnect);

            // setBleConnectState(connectStatus)

            // 디바이스 등록이 없으면, 처음이신가요?, 디바이스 등록은 있으나 연결 상태가 false일 경우 noConnection
            if (bleSnapshot.empty || bleDocuments.length === 0) {
                setFirstVisit(true)
                setShouldOpenActionsheet(true);
                console.log("BLE 등록 없음, 첫 방문 opening actionsheet");
            } else if (bleDocuments.length > 0 && bleDocuments[0].isConnect === false) {
                setNoConnection(true)
                setShouldOpenActionsheet(true);
                console.log("등록된 BLE device는 있으나 연결된 상태가 아님, opening actionsheet");
            } else if (bleDocuments.length > 0 && bleDocuments[0].isConnect === true) {
                console.log("BLE 연결된 상태임.");
            }
        } catch (error) {
            console.error("Error fetching data from Firestore:", error);
        } finally {
            setDataLoaded(true) //데이터 로딩 완료
        }
    };


    useEffect(() => {
        getReportData();
    }, []);

    useEffect(() => {
        if (shouldOpenActionsheet && dataloaded) {
            onOpen();
        }
    }, [dataloaded]);


    const DeviceFirstImage = require('../images/deviceConnectFirst.png')
    const DeviceConnectWarn = require("../images/deviceConnectWarn.png")

    const handleDeviceEnroll = () => {
        onClose()
        navigation.navigate("SettingScreens", {screen: "Device"})
        console.log("디바이스 등록하기 버튼 클릭")
    }

    return (
        <>
            {noConnection ? (
                <Actionsheet onClose={onClose} isOpen={isOpen} hideDragIndicator>
                    <Actionsheet.Content paddingBottom={5} paddingTop={4} justifyContent={"center"}
                                         alignItems={"center"}>
                        <Box w="100%" h={60} marginTop={0.5} marginBottom={5} justifyContent="center"
                             alignItems={"center"}>
                            <Text fontSize={20} color="black" fontWeight={"bold"} lineHeight={32}>
                                디바이스를 확인해주세요!
                            </Text>
                            <Text fontSize={14} color="#616161">
                                디바이스와의 연결이 끊어졌어요!
                            </Text>
                        </Box>
                        <Image source={DeviceConnectWarn} alt={"no-connection-ble"}/>

                        <Center width={"100%"} mb={2} mt={4}>
                            <Box width={"92%"}>
                                <Button bg={"#2785F4"} onPress={handleDeviceEnroll}>
                                    <Text fontWeight={600} fontSize={18} color={"white"}>디바이스 등록하기</Text>
                                </Button>
                            </Box>
                        </Center>
                    </Actionsheet.Content>
                </Actionsheet>
            ) : firstVisit ? (
                <Actionsheet onClose={onClose} isOpen={isOpen} hideDragIndicator>
                    <Actionsheet.Content paddingBottom={5} paddingTop={4} justifyContent={"center"}
                                         alignItems={"center"}>
                        <Box w="100%" h={60} marginTop={0.5} marginBottom={5} justifyContent="center"
                             alignItems={"center"}>
                            <Text fontSize={20} color="black" fontWeight={"bold"} lineHeight={32}>
                                처음이신가요?
                            </Text>
                            <Text fontSize={14} color="#616161">
                                원활한 이용을 위해서 디바이스를 등록해야 해요!
                            </Text>
                        </Box>
                        <Image source={DeviceFirstImage} alt={"first-visit-ble"}/>
                        <Center width={"100%"} mb={2} mt={4}>
                            <Box width={"92%"}>
                                <Button bg={"#2785F4"} onPress={handleDeviceEnroll}>
                                    <Text fontWeight={600} fontSize={18} color={"white"}>디바이스 등록하기</Text>
                                </Button>
                            </Box>
                        </Center>
                    </Actionsheet.Content>
                </Actionsheet>
            ) : null}
        </>
    );
};
