import {BackHandler, Touchable, TouchableOpacity, View} from "react-native";
import {Button, HStack, ScrollView, Slider, Text, VStack} from "native-base";
import React, {useContext, useEffect, useState} from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {handlePress} from "react-native-paper/lib/typescript/components/RadioButton/utils";
import {useNavigation} from "@react-navigation/native";
import {UserContext} from "./module/UserProvider";
import firestore from "@react-native-firebase/firestore";

/**
 * React component for displaying a calendar view.
 *
 * @component
 * @param {object} navigation - Navigation object used for navigating between screens.
 * @returns {ReactElement} - The rendered component.
 */



export const SettingsView_Regular = ({ navigation }) => {

    const [vibrate, setVibrate] = useState(0);
    const [measurementTime, setMeasurementTime] = useState(0);
    const [stimulationTime, setStimulationTime] = useState(0);
    const [initialFetchDone, setInitialFetchDone] = useState(false);

    const {userId} = useContext(UserContext)

    // 데이터베이스에서 값을 가져와서 상태 변수에 할당
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userDoc = await firestore()
                    .collection("Users")
                    .doc(userId)
                    .get();
                const userData = userDoc.data();
                if (userData) {
                    setVibrate(userData.Regular_settings?.vibrate || 15);  // 기본값 설정
                    setMeasurementTime(userData.Regular_settings?.measurementTime || 60);  // 기본값 설정
                    setStimulationTime(userData.Regular_settings?.stimulationTime || 30);  // 기본값 설정
                    setInitialFetchDone(true);
                    console.log(userData.measurementTime)
                    console.log(userData.stimulationTime)
                    console.log("User data fetched");
                }
            } catch (error) {
                console.error("Error fetching user data: ", error);
            }
        };

        fetchUserData();
    }, [userId]);


    useEffect(() => {
        const updateUserData = async () => {
            try {
                const Regular_settings = {
                    vibrate: vibrate,
                    measurementTime: measurementTime,
                    stimulationTime: stimulationTime,
                };
                await firestore()
                    .collection("Users")
                    .doc(userId)
                    .update({
                        Regular_settings
                    });
                console.log("User data updated");
            } catch (error) {
                console.error("Error updating user data: ", error);
            }
        };

        if (initialFetchDone) {
            updateUserData();
        }
    }, [measurementTime, stimulationTime, vibrate]);



    return(
    <VStack flex={1}>
        <ScrollView>
        <HStack alignitems={"center"} justifyContent={"flex-start"} bgColor={"white"} padding={5}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => {navigation.goBack()}}>
            <Ionicons name={"arrow-back"} color={'#222222'} size={25} />
            </TouchableOpacity>
            <Text bold fontSize={18} marginLeft={3}>일반 설정</Text>
        </HStack>

    <VStack flex={1} p={6} space={6}>
        <VStack bg={"white"} shadow={2} p={5} space={8}>

            {/*<VStack space={3}>*/}
            {/*    <Text bold>음악 소리</Text>*/}
            {/*    <HStack justifyContent={"space-between"} alignItems={"center"} >*/}
            {/*        <MaterialCommunityIcons name={"volume-high"} color={"#2785F4"} size={25}/>*/}
            {/*        <Slider width={"88%"} defaultValue={30} minValue={0} maxValue={100} step={1} colorScheme={"light"}>*/}
            {/*            <Slider.Track>*/}
            {/*                <Slider.FilledTrack bgColor={'#2785F4'} />*/}
            {/*            </Slider.Track>*/}
            {/*            <Slider.Thumb bg={"#2785F4"}/>*/}
            {/*        </Slider>*/}
            {/*    </HStack>*/}
            {/*</VStack>*/}

            <VStack space={3}>
                <Text bold>진동 세기</Text>
                <HStack justifyContent={"space-between"} alignItems={"center"}>
                    <MaterialCommunityIcons name={"volume-vibrate"} color={"#2785F4"} size={25}/>
                    <Text pr={2.5}>{vibrate ? vibrate + 'HZ' : "15HZ"}</Text>
                    <Slider width={"77%"} minValue={15} maxValue={35} step={5} colorScheme={"light"}
                            onChange={v => setVibrate(Math.floor(v))}
                    >
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
                    <Text pr={2.5}>{measurementTime ? measurementTime + '초' : "60초"}</Text>
                    <Slider width={"77%"} value={measurementTime} minValue={60} maxValue={120} step={30} colorScheme={"light"}
                            onChange={v => setMeasurementTime(Math.floor(v))}
                    >
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
                    <Text pr={2.5}>{stimulationTime ? stimulationTime + '초' : "30초"}</Text>
                    <Slider width={"77%"} value={stimulationTime} minValue={30} maxValue={90} step={30} colorScheme={"light"}
                            onChange={v => setStimulationTime(Math.floor(v))}
                    >
                        <Slider.Track>
                            <Slider.FilledTrack bg={"#2785F4"}/>
                        </Slider.Track>
                        <Slider.Thumb bg={"#2785F4"}/>
                    </Slider>
                </HStack>
            </VStack>
        </VStack>
    </VStack>
        </ScrollView>
    </VStack>

    );
};
