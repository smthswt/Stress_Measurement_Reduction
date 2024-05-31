import {Center, HStack, Image, Text, VStack} from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";
import {View} from "react-native";
import React, {useContext, useEffect, useState} from "react";
import firestore from "@react-native-firebase/firestore";
import moment from "moment/moment";
import {UserContext} from "../module/UserProvider";
import EmotionHappy from "../icons/EmotionHappy";
import EmotionNormal from "../icons/EmotionNormal";
import EmotionSoso from "../icons/EmotionSoso";
import EmotionTired from "../icons/EmotionTired";
import EmotionSad from "../icons/EmotionSad";
import EmotionAngry from "../icons/EmotionAngry";

export const EmotionComponent = ({selectedDate}) => {
    const [emotion, setEmotion] = useState("알 수 없음")
    const [createAt1, setCreateAt1] = useState("");
    const {userId} = useContext(UserContext)

    //emotion 데이터 호출
    const getEmotionData = async () => {
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
                    setEmotion(recentReport["2nd_Report"]?.emotion || "알 수 없음");
                    setCreateAt1(moment(recentReport.createAt.toDate()).format("YYYY-MM-DD"));
                    console.log("emootion:", emotion)
                } else {
                    // 데이터가 없는 경우
                    setEmotion("알 수 없음");
                    setCreateAt1("");
                }
            }
        } catch (error) {
            console.error("Error fetching data from Firestore:", error);
        }
    };

    useEffect(() => {
        getEmotionData();
    }, [selectedDate]);

    const EmotionIcon = {
        emotion_happy: <EmotionHappy width={40} height={40} />,
        emotion_normal: <EmotionNormal width={40} height={40} />,
        emotion_soso: <EmotionSoso width={40} height={40} />,
        emotion_tired: <EmotionTired width={40} height={40} />,
        emotion_sad: <EmotionSad width={40} height={40} />,
        emotion_angry: <EmotionAngry width={40} height={40} />,
    };

    const EmotionToText = {
        emotion_happy: "행복해요!",
        emotion_normal: "보통이에요",
        emotion_soso: "그저그래요",
        emotion_tired: "피곤해요",
        emotion_sad: "슬퍼요..",
        emotion_angry: "화나요",
    }

    console.log("emotion:", emotion)

    return(
        <VStack bg={"white"} p={4} style={{
            elevation: 2, // For Android
        }}>
            <HStack justifyContent={"space-between"} alignItems={"center"}>
                <VStack space={0.5}>
                    <HStack alignItems={"center"} space={2}>
                        <Ionicons name={'happy'} color={"#F2B95A"} size={20}></Ionicons>
                        <Text bold>{EmotionToText[emotion]}</Text>
                    </HStack>
                    <Text>그 날 느꼇던 감정이에요!</Text>
                </VStack>
                <Center width={49} height={49} borderWidth={2} borderColor={"#2785F4"} borderRadius={25} style={{justifyContent: 'center', alignItems: 'center', padding: 1}}>
                    {EmotionIcon[emotion]}
                </Center>
            </HStack>
        </VStack>
    );
};