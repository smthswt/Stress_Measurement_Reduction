import {View} from "react-native";
import {Text, VStack, HStack, ScrollView, Image, Box, Pressable} from "native-base";
import React from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import {BPM} from "./components/BPM";
import {StressLevel} from "./components/StressLevel";
import Ionicons from "react-native-vector-icons/Ionicons";
import AllResultsImage from "./images/AllResults.png";
import StressResultsImage from "./images/AllStress.png";

/**
 * React component for displaying a calendar view.
 *
 * @component
 * @param {object} navigation - Navigation object used for navigating between screens.
 * @returns {ReactElement} - The rendered component.
 */
export const CalendarView = ({ navigation }) => {

    const emotions = {
        emotion_happy:  require('../view/images/emotion_happy.png') ,
        emotion_tired:  require('../view/images/emotion_tired.png') ,
        emotion_normal: require('../view/images/emotion_normal.png') ,
        emotion_sad: require('../view/images/emotion_sad.png') ,
        emotion_soso: require('../view/images/emotion_soso.png'),
        emotion_angry: require('../view/images/emotion_angry.png'),
    };

    const EmotionComponent = () => {
        return(
            <VStack bg={"white"} p={4} style={{
                elevation: 2, // For Android
            }}>
                <HStack justifyContent={"space-between"} alignItems={"center"}>
                    <VStack space={0.5}>
                        <HStack alignItems={"center"} space={2}>
                            <Ionicons name={'happy'} color={"#F2B95A"} size={20}></Ionicons>
                            <Text bold>행복해요!</Text>
                        </HStack>
                        <Text>그 날 느꼇던 감정이에요!</Text>
                    </VStack>
                    <View width={49} height={49} borderWidth={2} borderColor={"#2785F4"} borderRadius={25} style={{justifyContent: 'center', alignItems: 'center', paddingRight: 2}}>
                        <Image source={emotions["emotion_happy"]} alt={"happy"}></Image>
                    </View>
                </HStack>
            </VStack>
        );
    };

    const AllResultsImage = require('../view/images/AllResults.png')
    const StressResultsImage = require('../view/images/AllStress.png')
    const StressResults = () => {
        return (
            <HStack>
                <Pressable flex={1}>
                    {({
                          isHovered,
                          isFocused,
                          isPressed
                      }) => {
                        return <VStack alignItems={"center"} justifyContent={"center"} bg={isPressed ? "coolGray.200" : isHovered ? "coolGray.200" : "white"}
                                       style={{
                                           transform: [{
                                               scale: isPressed ? 0.96 : 1
                                           }]
                                       }} shadow={2} pt={5}
                                       pb={5} >
                            <Box h={100} alignContent={"center"}><Image source={StressResultsImage}
                                                                        alt={"view-all-stress"}></Image></Box>
                            <Text bold fontSize={"lg"}>스트레스 정보</Text>
                            <Text fontSize={'xs'} textAlign={"center"}>최근 검사한 스트레스{"\n"}수치를 한눈에 볼 수 있어요.</Text>
                        </VStack>
                    }}
                </Pressable>
            </HStack>
        )
    }


return (
    <VStack style={{flex: 1}}>
    <VStack space={2} bgColor={"white"} padding={5}>
        <HStack alignitems={"flex-start"} justifyContent={'space-between'}>
            <Text bold fontSize={18}>달력</Text>
            <AntDesign name={"calendar"} size={22} color={"black"}/>
        </HStack>
        <HStack>
            <Text>
                //달력 날짜들 + ScrollView
            </Text>
        </HStack>
    </VStack>

        <ScrollView contentContainerStyle={{justifyContent: "center", alignItems: 'center', padding: 20}}>
            <VStack space={5}>

            <BPM></BPM>
            <StressLevel></StressLevel>
                <StressResults/>

                <EmotionComponent></EmotionComponent>

            </VStack>
        </ScrollView>

    </VStack>
);
};