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
import React, {useContext, useEffect, useState} from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import {BPM} from "./components/BPM";
import {StressLevel} from "./components/StressLevel";
import Ionicons from "react-native-vector-icons/Ionicons";
import CalendarList_Actionsheet from "./components/CalendarList_Actionsheet";
import SemiCircleProgress from "./components/SemiCirle";
import {StressSemiCircle} from "./components/StressSemiCircle";
import {CalendarBPM} from "./components/CalendarBPM";
import {CalendarStressLevel} from "./components/CalendarStressLevel";
import firestore from "@react-native-firebase/firestore";
import {UserContext} from "./module/UserProvider";
import {EmotionComponent} from "./components/CalendarEmotion";

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
    const [selected, setSelected] = useState(todayDate()); // 기본값으로 오늘 날짜 설정
    const [selectedDate, setSelectedDate] = useState();
    const [clickCount, setClickCount] = useState(0);
    const [bpm, setbpm] = useState(0)
    const [bpm2, setbpm2] = useState(0)
    const [bpm3, setbpm3] = useState(0)
    const [bpm4, setbpm4] = useState(0)
    const [createAt1, setCreateAt1] = useState("");
    const [createAt2, setCreateAt2] = useState("");
    const {userId} = useContext(UserContext)

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

    // const EmotionComponent = () => {
    //     return(
    //         <VStack bg={"white"} p={4} style={{
    //             elevation: 2, // For Android
    //         }}>
    //             <HStack justifyContent={"space-between"} alignItems={"center"}>
    //                 <VStack space={0.5}>
    //                     <HStack alignItems={"center"} space={2}>
    //                         <Ionicons name={'happy'} color={"#F2B95A"} size={20}></Ionicons>
    //                         <Text bold>행복해요!</Text>
    //                     </HStack>
    //                     <Text>그 날 느꼇던 감정이에요!</Text>
    //                 </VStack>
    //                 <View width={49} height={49} borderWidth={2} borderColor={"#2785F4"} borderRadius={25} style={{justifyContent: 'center', alignItems: 'center', paddingRight: 2}}>
    //                     <Image source={emotions["emotion_happy"]} alt={"happy"}></Image>
    //                 </View>
    //             </HStack>
    //         </VStack>
    //     );
    // };


    // // createTimestampFromDate 함수 수정
    // const createTimestampFromDate = (dateString) => {
    //     const [year, month, day] = dateString.split('-'); // 날짜 형식에서 연도, 월, 일 추출
    //     return new Date(year, month - 1, day).getTime(); // 해당 날짜의 타임스탬프 생성
    // };


//     // CalendarView 컴포넌트의 useEffect 내부
//     useEffect(() => {
//         getBPMData();
//     }, [dateRange]); // dateRange가 변경될 때마다 호출하도록 변경
//
// // CalendarView 컴포넌트의 getBPMData 함수 내부
//     const getBPMData = async () => {
//         const userRef = firestore().collection("Users").doc(userId);
//         const reportRef = userRef.collection("Report");
//
//         console.log("selected dateRange :", dateRange)
//         // 사용자가 선택한 날짜의 타임스탬프 생성
//         const selectedTimestamp = createTimestampFromDate(dateRange[0]);
//         console.log("selected dateRange :", selectedTimestamp)
//
//         // Firestore 쿼리
//         const querySnapshot = await reportRef
//             .where('createAt', '==', selectedTimestamp)
//             .limit(1)
//             .get();
//
//         if (!querySnapshot.empty) {
//             const recentReport = querySnapshot.docs[0].data();
//             console.log("Recent Report1:", recentReport["1st_Report"].sdnn);
//             console.log("Recent Report2:", recentReport["2nd_Report"].sdnn);
//             setbpm(recentReport["1st_Report"].sdnn);
//             setbpm2(recentReport["2nd_Report"].sdnn);
//
//             console.log("create at:", recentReport.createAt);
//             // moment 객체로 변환하여 상태로 설정
//             setCreateAt1(moment(recentReport.createAt.toDate()).format("YYYY-MM-DD"));
//         } else {
//             console.log("No reports found");
//         }
//     };

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
                            <Box h={100} alignContent={"center"}>
                                <Image source={StressResultsImage} alt={"view-all-stress"}></Image></Box>
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
        console.log("index :", index)
        if (selected === index) {
            // 꼭 날짜 하나 선택하는걸로 변경
            // If the selected item is clicked again, deselect it
            // setSelected(undefined);
            // setClickCount(0);
        } else {
            // If a different item is clicked, select it
            setSelected(index);
            // setClickCount(1);
            setSelectedDate(dateRange[index]);
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
            <VStack width={"100%"} space={5}>

            <CalendarBPM selectedDate={selectedDate} />
            <CalendarStressLevel selectedDate={selectedDate}/>
                <StressSemiCircle selectedDate={selectedDate}/>

                <EmotionComponent selectedDate={selectedDate} />

            </VStack>
        </ScrollView>

    </VStack>
);
};
