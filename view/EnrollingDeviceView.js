import React, {useEffect, useContext, useState} from "react";
import {Box, Button, Center, HStack, Image, Text, View, VStack} from "native-base";
import {ImageBackground, TouchableOpacity, StyleSheet, Animated} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming} from "react-native-reanimated";
// import {DEVICE_ID, SERVICE_UUID} from "./module/BLEProvider";
// import {BLEContext} from "./module/BLEProvider";
import {useBLE} from "./module/BLEProvider";
import {stat} from "react-native-fs";
import {useDispatch, useSelector} from "react-redux";


const EnrollingDeviceView = ({navigation}) => {


    const connectDevice = useSelector(state => state.device.connectDevice);
    const connectedStatus = useSelector(state => state.device.isConnected);
    console.log("enrolling status :", connectedStatus, connectDevice)


    const deviceImage = require("./images/RenstDevice.png");
    const backgroundImage = require('./images/BackgroundofRenstDevice.png');

    //BLEProvider에서 필요한 메소드 불러와서 쓰기
    const {scanAllDevices} = useBLE();

    const handleSearch = async () => {
        // setState(RegistryState.Finding);

        try {
            console.log("기기 검색 버튼 클릭")
            //scanALlDevice는 BLEProvider.js에 있고 조건은 Device_ID="Renst" = devices.name하고 일치하는지 확인 (즉 해당 기기만 검색됌.)
            let devices = await scanAllDevices();
            console.log("검색한 기기!!! ", devices)

            // 검색이 완료되었을 때만 "Device Found" 로그를 출력하고 이동
            // setState(RegistryState.Found);
            console.log("device:", devices)
            console.log("Device Found")

            // 디바이스 검색 결과 페이지로 이동
            await navigation.navigate("DeviceSettingScreens", {screen: "CompleteEnroll", params: {devices: devices}});

        } catch (error) {
            // BLE 모듈이 없는 경우, 즉 테스트 시 BleError: Device is not authorized to use BluetoothLE 발생
            console.error("검색 중 오류 발생:", error);
        }
    }



    const animatedValue1 = new Animated.Value(0);
    const animatedValue2 = new Animated.Value(0);
    const animatedValue3 = new Animated.Value(0);

    const fadeInOutAnimation = () => {
        const fadeInOut1 = () =>
            Animated.loop(
                Animated.sequence([
                    Animated.timing(animatedValue1, {
                        toValue: 3,
                        duration: 2500,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    }),
                    Animated.delay(1000),
                ])
            ).start();

        const fadeInOut2 = () =>
            Animated.loop(
            Animated.sequence([
                Animated.delay(500), // Adjust the delay time as needed
                Animated.timing(animatedValue2, {
                    toValue: 3,
                    duration: 2500,
                    easing: Easing.linear,
                    useNativeDriver: true,
                }),
                Animated.delay(500),
            ])
    ).start();

        const fadeInOut3 = () =>
            Animated.loop(
                Animated.sequence([
                    Animated.delay(1000), // Adjust the delay time as needed
                    Animated.timing(animatedValue3, {
                        toValue: 3,
                        duration: 2500,
                        easing: Easing.linear,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        fadeInOut1();
        fadeInOut2()
        fadeInOut3()// Start the first loop
    };

    useEffect(() => {
        fadeInOutAnimation();
    }, []);


    return(
    <View flex={1}>
        <HStack alignitems={"center"} justifyContent={"flex-start"} bgColor={"white"} padding={5}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => {navigation.goBack()}}>
                <Ionicons name={"arrow-back"} color={'#222222'} size={25} />
            </TouchableOpacity>
            <Text bold fontSize={18} marginLeft={3}>디바이스 등록하기</Text>
        </HStack>

        <VStack flex={1} justifyContent={"space-between"} bg={"white"}>
            <Center flex={0.72} overflow={"hidden"} py={3}>
                <Box width={"100%"} alignItems={"center"} justifyContent={"center"} style={{position:"absolute"}}>
                    <Animated.View
                        style={{
                            width: 300,
                            height: 300,
                            borderRadius:300,
                            borderWidth:1,
                            borderColor:`rgba(39,122,244,0.5)`,
                            transform: [{ scale: animatedValue1 }]
                        }}
                    />
                </Box>
                <Box width={"100%"} alignItems={"center"} justifyContent={"center"} style={{position:"absolute"}}>
                    <Animated.View
                        style={{
                            width: 300,
                            height: 300,
                            borderRadius:300,
                            borderWidth:1,
                            borderColor:`rgba(39,122,244,0.5)`,
                            transform: [{ scale: animatedValue2 }]
                        }}
                    />
                </Box>
                <Box width={"100%"} alignItems={"center"} justifyContent={"center"} style={{position:"absolute"}}>
                    <Animated.View
                        style={{
                            width: 300,
                            height: 300,
                            borderRadius:300,
                            borderWidth:1,
                            borderColor:`rgba(39,122,244,0.5)`,
                            transform: [{ scale: animatedValue3 }]
                        }}
                    />
                </Box>

                <Image source={deviceImage} alt={"Device Image"} position={"relative"}/>

            </Center>
            <VStack flex={0.28} py={3} justifyContent={"space-between"} alignItems={"center"}>
                <VStack justifyContent={'center'} alignItems={'center'} space={2}>
                    <Text fontSize={17} bold>주변에 있는 디바이스를 찾아드릴게요.</Text>
                    <Text fontSize={14}>블루투스를 이용해서 찾아드릴게요.</Text>
                </VStack>
                <Button onPress={handleSearch} width={"92%"} marginBottom={2} bg={"#2785F4"} size={"lg"}>
                    <Text fontWeight={"bold"} color={"white"} fontSize={18}>검색</Text>
                </Button>
            </VStack>

        </VStack>


    </View>
)
};

export default EnrollingDeviceView;


const styles = StyleSheet.create({
    circular: {
        height: 150, width: 150, borderWidth: 2, borderRadius: 125, borderColor: "#6aa1ff",
        // position: "absolute"
    },
    box: {
        height: 120,
        width: 120,
        backgroundColor: '#b58df1',
        borderRadius: 20,
    },
});
