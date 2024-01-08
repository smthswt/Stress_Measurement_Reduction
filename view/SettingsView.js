import {View} from "react-native";
import {Box, Button, Divider, HStack, Pressable, Text, VStack} from "native-base";
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";

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

    const handleLogout = () => {
        console.log("로그아웃 버튼이 클릭 되었습니다.")
    }

    const handleQuitAccount = () => {
        console.log("서비스 탈퇴가 클릭 되었습니다.")
    }


    return (
        <VStack style={{flex: 1}}>
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

        </View>
        </VStack>
    );
}
