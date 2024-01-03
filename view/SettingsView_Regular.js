import {BackHandler, Touchable, TouchableOpacity, View} from "react-native";
import {Button, HStack, Slider, Text, VStack} from "native-base";
import React, {useEffect} from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {handlePress} from "react-native-paper/lib/typescript/components/RadioButton/utils";
import {useNavigation} from "@react-navigation/native";

/**
 * React component for displaying a calendar view.
 *
 * @component
 * @param {object} navigation - Navigation object used for navigating between screens.
 * @returns {ReactElement} - The rendered component.
 */

// const navigation = useNavigation()
//
// const backButton = () => {
//     return canGoBacck
// };
// console.log("back button is pressed")

// useEffect(() => {
//     BackHandler.addEventListener("hardwareBackPress", backButton)
//     return () => {
//         BackHandler.removeEventListener("hardwareBackPress", backButton)
//     }
// }, [backButton]);

export const SettingsView_Regular = ({ navigation }) => {

return(
    <VStack flex={1}>
        <HStack alignitems={"center"} justifyContent={"flex-start"} bgColor={"white"} padding={5}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => {navigation.goBack()}}>
            <Ionicons name={"arrow-back"} color={'#222222'} size={25} />
            </TouchableOpacity>
            <Text bold fontSize={18} marginLeft={3}>일반 설정</Text>
        </HStack>

    <VStack flex={1} p={6} space={6}>
        <VStack bg={"white"} shadow={2} p={5} space={8}>
            <VStack space={3}>
                <Text bold>음악 소리</Text>
                <HStack justifyContent={"space-between"} alignItems={"center"} >
                    <MaterialCommunityIcons name={"volume-high"} color={"#2785F4"} size={25}/>
                    <Slider width={"88%"} defaultValue={30} minValue={0} maxValue={100} step={2} colorScheme={"light"}>
                        <Slider.Track>
                            <Slider.FilledTrack bgColor={'#2785F4'} />
                        </Slider.Track>
                        <Slider.Thumb bg={"#2785F4"}/>
                    </Slider>
                </HStack>
            </VStack>
            <VStack space={3}>
                <Text bold>진동 세기</Text>
                <HStack justifyContent={"space-between"} alignItems={"center"}>
                    <MaterialCommunityIcons name={"volume-vibrate"} color={"#2785F4"} size={25}/>
                    <Slider width={"88%"} defaultValue={60} minValue={0} maxValue={100} step={2} colorScheme={"light"}>
                        <Slider.Track>
                            <Slider.FilledTrack bg={"#2785F4"}/>
                        </Slider.Track>
                        <Slider.Thumb bg={"#2785F4"}/>
                    </Slider>
                </HStack>
            </VStack>
        </VStack>

        <VStack bg={"white"} shadow={2} p={5} space={10}>
            <VStack space={3}>
                <Text bold>측정 시간</Text>
                <HStack justifyContent={"space-between"} alignItems={"center"}>
                    <MaterialIcons name={"access-time-filled"} color={"#2785F4"} size={25}/>
                    <Slider width={"88%"} defaultValue={3} minValue={1} maxValue={5} step={2} colorScheme={"light"}>
                        <Slider.Track>
                            <Slider.FilledTrack bg={"#2785F4"}/>
                        </Slider.Track>
                        <Slider.Thumb bg={"#2785F4"}/>
                    </Slider>

                </HStack>
            </VStack>
            <VStack space={3}>
                <Text bold>자극 시간</Text>
                <HStack justifyContent={"space-between"} alignItems={"center"}>
                    <MaterialIcons name={"access-time-filled"} color={"#2785F4"} size={25}/>
                    <Slider width={"88%"} defaultValue={15} minValue={10} maxValue={20} step={5} colorScheme={"light"}>
                        <Slider.Track>
                            <Slider.FilledTrack bg={"#2785F4"}/>
                        </Slider.Track>
                        <Slider.Thumb bg={"#2785F4"}/>
                    </Slider>
                </HStack>
            </VStack>
        </VStack>
    </VStack>
    </VStack>

    );
};
