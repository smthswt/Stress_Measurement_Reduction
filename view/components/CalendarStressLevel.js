import React, {useContext, useEffect, useState} from 'react';
import {HStack, Text, VStack} from 'native-base';
import {LineChart} from 'react-native-chart-kit';
import {View} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {VictoryBar, VictoryChart, VictoryGroup} from 'victory-native';
import {VictoryTheme} from 'victory';
import {UserContext} from "../module/UserProvider";
import moment from "moment";
import firestore from "@react-native-firebase/firestore";


export const CalendarStressLevel = ({date, sdnn, sdnn2}) => {
    const {userId} = useContext(UserContext)
    let now = moment();
    const [stressIndex, setStressIndex] = useState(0)
    const [stressIndex2, setStressIndex2] = useState(0)
    const [createAt1, setCreateAt1] = useState("");



// // stress index 데이터 호출
//     const getStressIndexData = async () => {
//         const userRef = firestore().collection("Users").doc(userId);
//         const reportRef = userRef.collection("Report");
//
//         // 실시간 업데이트
//         reportRef
//             .orderBy('createAt', 'desc')
//             .limit(2)
//             .onSnapshot((querySnapshot) => {
//                 if (!querySnapshot.empty) {
//                     const recentReport = querySnapshot.docs[0].data();
//                     console.log("Recent Report1:", recentReport["1st_Report"].stressIndex);
//                     console.log("Recent Report2:", recentReport["2nd_Report"].stressIndex);
//
//                     setStressIndex(recentReport["1st_Report"].stressIndex);
//                     setStressIndex2(recentReport["2nd_Report"].stressIndex);
//                     console.log("create at:", recentReport.createAt,);
//                     // moment 객체로 변환하여 상태로 설정
//                     setCreateAt1(moment(recentReport.createAt.toDate()).format("YYYY-MM-DD"));
//                 } else {
//                     console.log("No reports found");
//                 }
//             }, (error) => {
//                 console.error("Error fetching data from Firestore:", error);
//             });
//     };
//
//     useEffect(() => {
//         getStressIndexData();
//     }, []);


    const Data = {
        before: [
            {date: "date", stressLevel: "sdnn"},
        ],
        after: [
            {date: "date", stressLevel: "sdnn2"},
        ],
    };

    return (
        <VStack bgColor={'white'} p={3} shadow={2}>
            <HStack justifyContent={'space-between'}>
                <VStack justifyContent={'space-between'}>
                    <HStack alignItems={'center'} space={1}>
                        <Ionicons name={'flash'} color={'#FF6B18'} size={20} />
                        <Text bold fontSize={'lg'}>
                            스트레스 레벨
                        </Text>
                    </HStack>
                    <Text fontSize={'xs'}>오늘 힘든 하루를 보내셨나요?</Text>
                </VStack>
                <VStack space={2}>
                    <HStack alignItems={'center'} space={2}>
                        <Ionicons name={'ellipse'} color={'#2785F4'} />
                        <Text fontSize={'xs'}>힐링 전</Text>
                    </HStack>
                    <HStack alignItems={'center'} space={2}>
                        <Ionicons name={'ellipse'} color={'#FF4370'} />
                        <Text fontSize={'xs'}>힐링 후</Text>
                    </HStack>
                </VStack>
            </HStack>
            <HStack justifyContent={'center'} alignItems={'center'}>

                <VictoryChart
                    width={350}
                    height={250}
                    maxDomain={{y: 5}}
                    theme={VictoryTheme.material}>
                    <VictoryGroup offset={35} width={250} height={200}>
                        <VictoryBar
                            barWidth={25}
                            labels={({datum}) => `0`+datum.stressLevel}
                            style={{
                                data: {fill: '#2785F4'},
                                labels: {fill: 'black', fontWeight: 'bold'},
                            }}
                            data={Data.before}
                            x={'date'}
                            y={'stressLevel'}
                            cornerRadius={5}
                        />
                        <VictoryBar
                            barWidth={25}
                            labels={({datum}) => `0`+datum.stressLevel}
                            style={{
                                data: {fill: '#FF4370'},
                                labels: {fill: 'black', fontWeight: 'bold'},
                            }}
                            data={Data.after}
                            x={'date'}
                            y={'stressLevel'}
                            cornerRadius={5}
                        />
                    </VictoryGroup>
                </VictoryChart>
            </HStack>
        </VStack>
    );
};
