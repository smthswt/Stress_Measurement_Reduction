import {View} from "react-native";
import {Button, Text, VStack} from "native-base";
import React from "react";
import Ionicons from "react-native-vector-icons/Ionicons";

/**
 * React component for displaying a calendar view.
 *
 * @component
 * @param {object} navigation - Navigation object used for navigating between screens.
 * @returns {ReactElement} - The rendered component.
 */


export const RegisterSuccessView = ({ navigation, route }) => {

    const params = route.params
    console.log(params)
    const handleStart = () => {
        navigation.navigate("TabScreens", {screen:"Home", params:{name:params.name}})
    }

    return (
        <VStack height={"100%"} p={5} bg={"white"}>
            <VStack flex={10} space={5} justifyContent={"center"} alignItems={"center"}>
                <Ionicons name={"checkmark-circle-outline"} size={100} color={"#59BCFF"}/>
                <Text textAlign={"center"} bold fontSize={"2xl"}>{params.name}님,{"\n"}회원가입이 완료되었습니다.</Text>
                <Text textAlign={"center"} color={"#616161"}>RENST에서 편리하게 검사해볼까요?</Text>
            </VStack>
            <VStack flex={1} justifyContent={"flex-end"}>
                <Button bg={"#2785F4"} height={55} onPress={handleStart}>
                    <Text bold color={"white"} fontSize={"lg"}>시작하기</Text>
                </Button>
            </VStack>
        </VStack>
    );
}
