import {Alert, View} from "react-native";
import {AlertDialog, Box, Button, Center, Divider, HStack, Pressable, ScrollView, Text, VStack} from "native-base";
import React, {useEffect, useState} from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import {useDispatch, useSelector} from "react-redux";
import {getConnectedDevices} from "../data/RealmDatabase";
import {fetchReports, setConnectDevice, setConnectionStatus} from "../data/store";
import {useBLE} from "./module/BLEProvider";

/**
 * Component for displaying settings view.
 *
 * @param {object} navigation - The navigation object from React Navigation.
 * @returns {JSX.Element} The rendered settings view.
 */
export const SettingsView = ({navigation}) => {
    const handleDeviceSettings = () => {
        navigation.navigate("SettingScreens", {screen:"Device"})
    }

    const handleRegularSettings = () => {
        navigation.navigate("SettingScreens", {screen:"Regular"})
    }

    const handleManualSettings = () => {
        navigation.navigate("SettingScreens", {screen:"Manual"})
    }

    const handlePrivacyPolicy = () => {
        navigation.navigate("SettingScreens", {screen:'Privacy'})
    }

    const [isLogoutOpen, setLogOutOpen] = useState(false)

    const handleLogout = () => {
        setLogOutOpen(true)
    };

    const handleLogoutConfirm = () => {
        navigation.navigate("LoginScreens", {screen:"Login"})
        setLogOutOpen(false)
    };

    const handleLogoutCancel = () => {
        setLogOutOpen(false)
    };

    const handleQuitAccount = () => {
        navigation.navigate("서비스 탈퇴")
    }


    const {connectAndSubscribe} = useBLE();

    const isConnected = useSelector(state => state.device.isConnected);
    const dispatch = useDispatch();

    useEffect(() => {
        console.log("Home useEffect");

        async function deviceConnect() {
            let device = await getConnectedDevices();
            if (device) {
                console.log(`connecting to device: ${device.id}`);

                let success = await connectAndSubscribe(device.id);
                if (success) {
                    dispatch(setConnectDevice(device.id));
                    dispatch(setConnectionStatus(true));
                } else {
                    // 연결 불안정 플래그 처리 하거나 연결 해제 상태를 기록
                }
            }
        }

        deviceConnect();
        dispatch(fetchReports());

    }, []);


    return (
        <VStack style={{flex: 1}}>
            <ScrollView>
            <VStack alignitems={"flex-start"} bgColor={"white"} padding={5}>
                <Text bold fontSize={18}>설정</Text>
            </VStack>

        <View flex={1} style={{alignItems: 'center', justifyContent: 'space-between'}}>
        <VStack p={5} space={5} width={"100%"}>
            <Pressable onPress={handleDeviceSettings}>
                <HStack bgColor={"white"} p={3} justifyContent={"space-between"} alignItems={"center"} shadow={2}>
                    <VStack space={3}>
                        <Text bold fontSize={"md"}>디바이스 설정</Text>
                        <Text fontSize={"xs"}>디바이스 설정을 자세하게 설정할 수 있어요.</Text>
                    </VStack>
                    <Ionicons name={"chevron-forward"} size={25} color={"black"}/>
                </HStack>
            </Pressable>

            <Pressable onPress={handleRegularSettings}>
                <HStack bgColor={"white"} p={3} justifyContent={"space-between"} alignItems={"center"} shadow={2}>
                    <VStack space={3}>
                        <Text bold fontSize={"md"}>일반 설정</Text>
                        <Text fontSize={"xs"}>기본적인 설정값을 변경할 수 있어요.</Text>
                    </VStack>
                    <Ionicons name={"chevron-forward"} size={25} color={"black"}/>
                </HStack>
            </Pressable>

            <Pressable onPress={handleManualSettings}>
                <HStack bgColor={"white"} p={3} justifyContent={"space-between"} alignItems={"center"} shadow={2}>
                    <VStack space={3}>
                        <Text bold fontSize={"md"}>메뉴얼 설정</Text>
                        <Text fontSize={"xs"}>메뉴얼 설정값을 변경할 수 있어요.</Text>
                    </VStack>
                    <Ionicons name={"chevron-forward"} size={25} color={"black"}/>
                </HStack>
            </Pressable>
            <VStack bgColor={"white"} p={3} shadow={2}>
                <Pressable onPress={handlePrivacyPolicy}>
                    <HStack justifyContent={"space-between"} alignItems={"center"}>
                        <Text>개인정보 처리방침</Text>
                        <Ionicons name={"chevron-forward"} size={25} color={"black"}/>
                    </HStack>
                </Pressable>
                <Divider mt={3} mb={3}/>
                <Pressable onPress={handleLogout}>
                    <HStack justifyContent={"space-between"} alignItems={"center"}>
                        <Text>로그아웃</Text>
                        <Ionicons name={"chevron-forward"} size={25} color={"black"}/>
                    </HStack>
                </Pressable>
            </VStack>
        </VStack>

            <Button variant={'unstyled'} marginBottom={10} onPress={handleQuitAccount}>
            <Text underline color={"red.500"} fontWeight={500}>서비스 탈퇴</Text>
            </Button>

            <AlertDialog isOpen={isLogoutOpen}>
                <AlertDialog.Content p={'2'}>
                    <AlertDialog.CloseButton />
                    <AlertDialog.Header>
                        <Center>
                            <Text bold>로그아웃</Text>
                        </Center>
                    </AlertDialog.Header>
                    <AlertDialog.Body>
                        <Center>
                            <Text color={'#EB5147'}>로그아웃 하시겠습니까?</Text>
                        </Center>
                    </AlertDialog.Body>
                    <HStack width={'100%'} p={3} space={5}>
                        <Button
                            flex={1}
                            colorScheme="danger"
                            variant={'outline'}
                            onPress={handleLogoutCancel}>
                            취소
                        </Button>
                        <Button flex={1} colorScheme="danger" onPress={handleLogoutConfirm}>
                            확인
                        </Button>
                    </HStack>
                </AlertDialog.Content>
            </AlertDialog>

        </View>
            </ScrollView>
        </VStack>
    );
}
