import {Box, Image, Pressable, Text, VStack, HStack, Center} from "native-base";
import StressResultsImage from "../images/AllStress.png";
import React, {useContext, useEffect, useState} from "react";
import SemiCircleProgress from "./SemiCirle";
import {useBLE} from "../module/BLEProvider";
import firestore from "@react-native-firebase/firestore";
import {UserContext} from "../module/UserProvider";
import moment from "moment/moment";


export const StressSemiCircle = ({selectedDate}) => {
    const [sdnn, setSdnn] = useState(0)
    const [createAt1, setCreateAt1] = useState("");
    const {userId} = useContext(UserContext)

    // sdnn 데이터 호출
    const getSdnnData = async () => {
        const userRef = firestore().collection("Users").doc(userId);
        const reportRef = userRef.collection("Report");


        // 현재 날짜를 UTC+9 기준으로 변환하여 생성
        let Date = moment().format("YYYY-MM-DD");
        console.log("date:", Date)

        if (selectedDate) {
            // 선택한 날짜가 있을 경우에만 해당 날짜로 설정
            const selectedDateString = Array.isArray(selectedDate) ? selectedDate[0] : selectedDate;
            Date = moment(selectedDateString, "YYYY-MM-DD").format("YYYY-MM-DD");
        }

        // 현재 날짜를 기준으로 조회
        const querySnapshot = await reportRef
            .where('createAt', '>=', moment(Date).toDate())
            .where('createAt', '<', moment(Date).add(1, 'day').toDate())
            .orderBy('createAt', 'asc')
            .limit(1)
            .get();

        try {
            if (!querySnapshot.empty) {
                const docs = querySnapshot.docs;
                const recentReport = docs[0].data();

                // 데이터가 있는 경우, 가장 최근 sdnn값
                if (recentReport["1st_Report"] && recentReport["2nd_Report"]) {
                    setSdnn(parseFloat(recentReport["2nd_Report"]?.sdnn || 0).toFixed(1));
                    setCreateAt1(moment(recentReport.createAt.toDate()).format("YYYY-MM-DD"));
                } else {
                    // 데이터가 없는 경우
                    setSdnn(0);
                    setCreateAt1("");
                }
            }
        } catch (error) {
            console.error("Error fetching data from Firestore:", error);
        }
    };

    useEffect(() => {
        getSdnnData();
    }, [selectedDate]);

    // sdnn 값에 따라 progressColor 설정
    const getProgressColor = (sdnn) => {
        if (sdnn <= 20 || sdnn >= 450) {
            return '#EB5147'; // sdnn값이 450이상 또는 20이하인 경우
        } else if (sdnn >= 80 && sdnn <= 150) {
            return '#2785F4'; // sdnn값이 80~150인 경우
        } else if (sdnn > 20 && sdnn < 80) {
            return '#FF6B18'; // sdnn값이 20초과 80미만인 경우
        } else {
            return '#616161'; // 기본값 또는 처리되지 않은 값에 대한 기본 색상
        }
    };


// progressColor를 동적으로 설정
    const progressColor = getProgressColor(sdnn);


    return (
        <VStack flex={1}>
            <Box>
                <VStack alignItems={"center"} justifyContent={"center"} bg={"white"}
                        shadow={2} p={3}>
                    <HStack alignItems={"center"} justifyContent={"space-between"} width={"100%"}>
                        <Text bold fontSize={"lg"}>스트레스 인덱스</Text>
                        <Text bold fontSize={"lg"}>{sdnn}</Text>
                    </HStack>
                    <HStack alignItems={"center"} justifyContent={"space-between"} width={"100%"}>
                        <Text fontSize={12} color={"#616161"}>최근 스트레스 정보에요</Text>
                        <Text fontSize={12} color={"#616161"}>스트레스 인덱스</Text>
                    </HStack>
                    <HStack alignItems={'center'} justifyContent={'flex-start'} width={"100%"}>
                        <Text fontSize={12} color={"#616161"}>정정 수치 56~80</Text>
                    </HStack>

                    <Center pb={5}>
                        <SemiCircleProgress
                            progressColor={progressColor}
                            progressWidth={15}
                            // initialPercentage={0}
                            minValue={0}
                            maxValue={450}
                            currentValue={sdnn} //sdnn
                        >
                            <Text bold fontSize={'3xl'} mb={2}>
                                {sdnn}
                            </Text>
                        </SemiCircleProgress>
                    </Center>

                </VStack>
            </Box>
        </VStack>
    );
};