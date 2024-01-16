import {RefreshControl, TouchableOpacity, View} from "react-native";
import {
    Actionsheet,
    Box,
    Button,
    Center,
    HStack,
    Image,
    Pressable,
    ScrollView,
    Text,
    useDisclose,
    VStack
} from "native-base";
import React, {useEffect, useState} from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import {BPM} from "./components/BPM";
import {StressLevel} from "./components/StressLevel";
import Ionicons from "react-native-vector-icons/Ionicons";
import CalendarList_Actionsheet from "./components/CalendarList_Actionsheet";
import SemiCircleProgress from "./components/SemiCirle";

/**
 * React component for displaying a calendar view.
 *
 * @component
 * @param {object} navigation - Navigation object used for navigating between screens.
 * @returns {ReactElement} - The rendered component.
 */

const todayDate = () => {
    const date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let dateOfMonth = date.getDate();

    return `${year}-${month}-${dateOfMonth}`
};
console.log("--------------------")
console.log("오늘 날짜", todayDate())

export const CalendarView = ({ navigation,}) => {
    const {isOpen, onOpen, onClose } = useDisclose();
    const [dateRange, setDateRange] = useState([todayDate()]);
    const [selected, setSelected] = useState();
    const [clickCount, setClickCount] = useState(0);

    const getDayOfWeek = (dateString) => {
        const week = ["일", '월', '화', '수', '목', '금', '토'];
        const date = new Date(dateString);
        return week[date.getDay()];
    };

    const DateRanges = (newDateRange) => {
        setDateRange(newDateRange);
    };
    console.log("DateRanges :", dateRange);

    const formattedDateRange = dateRange.map(dateString => {
        const date = new Date(dateString);
        const month = date.getMonth() + 1; // 월은 0부터 시작하므로 1을 더함.
        const day = date.getDate();

        return `${month}/${day}`;
    });
    console.log("formattedDates :", formattedDateRange);


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


    const dateRangeMapping = () => {
        return formattedDateRange.map((date, index) => (
            <Pressable key={index} onPress={() => handleSelected(index)}>
            <Center h="55px" w="55px" rounded="sm" borderWidth={1}
                    borderColor={selected === index ? "none" : "#CFD0D2"} backgroundColor={selected === index ? "#2785F4" : "white"}>
                <Text textAlign={'center'} color={selected === index ? "white" : "black"}>{getDayOfWeek(dateRange[index])}</Text>
                <Text textAlign={'center'} fontWeight={'bold'} color={selected === index ? "white" : "black"}>{date}</Text>
            </Center>
            </Pressable>
        ))
    };

    const handleSelected = (index) => {
        console.log("측정 날짜가 선택됌.")
        console.log(index)
        if (clickCount === 0) {
            setSelected(index)
            setClickCount(1)
        } else {
            setSelected(undefined)
            setClickCount(0)
        }
    };

    const handleOnOpen = () => {
        console.log("ActionSheet가 열렸습니다.");
        onOpen();
    };

    const handleOnClose = () => {
        console.log("날짜 선택 없이 ActionSheet가 닫혔습니다. dateRange :", dateRange )
        onClose();
    };

return (
    <VStack style={{flex: 1}}>
    <VStack space={2} bgColor={"white"} padding={5}>
        <HStack alignitems={"flex-start"} justifyContent={'space-between'}>
            <Text fontWeight={900} fontSize={18}>달력</Text>
            <TouchableOpacity activeOpacity={0.7} onPress={handleOnOpen} >
            <AntDesign name={"calendar"} size={22} color={"black"}/>

                <Actionsheet isOpen={isOpen} onClose={handleOnClose} hideDragIndicator>
                    <Actionsheet.Content backgroundColor={'white'} justifyContent={"center"} alignItems={"center"}>
                        <CalendarList_Actionsheet isOpen={isOpen} onClose={handleOnClose} dateRanges={DateRanges} />
                    </Actionsheet.Content>
                </Actionsheet>

            </TouchableOpacity>

        </HStack>

        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <HStack space={3} justifyContent={"flex-start"} mt={2.5} >
                {dateRangeMapping()}

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
