import {TouchableOpacity, TouchableOpacityComponent, View} from "react-native";
import {Box, Center, HStack, Image, Pressable, ScrollView, Text, useDisclose, VStack, Actionsheet} from "native-base";
import React from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import {BPM} from "./components/BPM";
import {StressLevel} from "./components/StressLevel";
import Ionicons from "react-native-vector-icons/Ionicons";
import CalendarList from "./components/CalendarListActionsheet";
import CalendarList_ActionSheet from "./components/CalendarListActionsheet";

/**
 * React component for displaying a calendar view.
 *
 * @component
 * @param {object} navigation - Navigation object used for navigating between screens.
 * @returns {ReactElement} - The rendered component.
 */
export const CalendarView = ({ navigation }) => {
    const {isOpen, onOpen, onClose } = useDisclose();

    const date = new Date()
    let month = date.getMonth() + 1;
    let dateOfMonth = date.getDate();
    // let dayOfWeek = date.getDay();

    const getDate = (offset) => {
        const newDate = dateOfMonth + offset;
        return `${month}/${newDate}`
    };

    const getDayOfWeek = (offset) => {
        const week = ["일", '월', '화', '수', '목', '금', '토'];
        return week[new Date().getDay() + offset]
    };

    console.log("오늘 날짜 :", `${month}/${dateOfMonth}`)
    console.log("오늘 요일 :", getDayOfWeek(0))

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
    };



return (
    <VStack style={{flex: 1}}>
    <VStack space={2} bgColor={"white"} padding={5}>
        <HStack alignitems={"flex-start"} justifyContent={'space-between'}>
            <Text fontWeight={900} fontSize={18}>달력</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={onOpen}>
            <AntDesign name={"calendar"} size={22} color={"black"}/>
                <CalendarList_ActionSheet isOpen={isOpen} onClose={onClose}/>
            </TouchableOpacity>
        </HStack>

        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <HStack space={3} justifyContent={"flex-start"} mt={2.5}>
            <Center h="55px" w="55px" rounded="sm" borderWidth={1} borderColor={"#CFD0D2"}>
                <Text textAlign={'center'}>{getDayOfWeek(0)}</Text>
                <Text textAlign={'center'} fontWeight={'bold'}>{getDate(0)}</Text>
            </Center>
            <Center h="55px" w="55px" p={1} rounded="sm" borderWidth={1} borderColor={"#CFD0D2"}>
                <Text textAlign={'center'}>{getDayOfWeek(1)}</Text>
                <Text textAlign={'center'} fontWeight={'bold'}>{getDate(1)}</Text>
            </Center>

            <Center h="55px" w="55px" rounded="sm" borderWidth={1} borderColor={"#CFD0D2"}>
                <Text textAlign={'center'}>{getDayOfWeek(2)}</Text>
                <Text textAlign={'center'} fontWeight={'bold'}>{getDate(2)}</Text>
            </Center>
            <Center h="55px" w="55px" p={1} rounded="sm" borderWidth={1} borderColor={"#CFD0D2"}>
                <Text textAlign={'center'}>{getDayOfWeek(3)}</Text>
                <Text textAlign={'center'} fontWeight={'bold'}>{getDate(3)}</Text>
            </Center>

            <Center h="55px" w="55px" rounded="sm" borderWidth={1} borderColor={"#CFD0D2"}>
                <Text textAlign={'center'}>{getDayOfWeek(4)}</Text>
                <Text textAlign={'center'} fontWeight={'bold'}>{getDate(4)}</Text>
            </Center>
            <Center h="55px" w="55px" p={1} rounded="sm" borderWidth={1} borderColor={"#CFD0D2"}>
                <Text textAlign={'center'}>{getDayOfWeek(5)}</Text>
                <Text textAlign={'center'} fontWeight={'bold'}>{getDate(5)}</Text>
            </Center>

            <Center h="55px" w="55px" rounded="sm" borderWidth={1} borderColor={"#CFD0D2"}>
                <Text textAlign={'center'}>{getDayOfWeek(6)}</Text>
                <Text textAlign={'center'} fontWeight={'bold'}>{getDate(6)}</Text>
            </Center>
            <Center h="55px" w="55px" p={1} rounded="sm" borderWidth={1} borderColor={"#CFD0D2"}>
                <Text textAlign={'center'}>{getDayOfWeek(7)}</Text>
                <Text textAlign={'center'} fontWeight={'bold'}>{getDate(7)}</Text>
            </Center>


        </HStack>
        </ScrollView>
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