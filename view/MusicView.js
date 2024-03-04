import React, {useEffect} from "react";
import {Text, VStack, View, ScrollView,} from "native-base";
import {Dimensions, } from "react-native";

import {MusicList} from "./components/MusicList";
import AsyncStorage from "@react-native-async-storage/async-storage";


const { width: SCREEN_WIDTH } = Dimensions.get("screen");
const { height: SCREEN_HEIGHT } = Dimensions.get("screen");



/**
 * Represents a view for the Music page.
 *
 * @param {Object} navigation - The navigation object used for navigating between screens.
 *
 * @returns {JSX.Element} The rendered MusicView component.
 */
export const MusicView = ({ navigation }) => {

    // // 로컬 스토리지에서 데이터를 가져와서 data 상태를 업데이트합니다.
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const storedData = await AsyncStorage.getItem("AImusicData");
    //             console.log("데이터가 성공적으로 가져와졌습니다1:", JSON.parse(storedData))
    //             if (storedData !== null) {
    //                 // const newestData = JSON.parse(storedData);
    //                 console.log("데이터가 성공적으로 가져와졌습니다:", storedData)
    //             }
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //         }
    //     };
    //
    //     fetchData().then(() => {
    //         console.log('Data fetched successfully',);
    //     }).catch(error => {
    //         console.error('Error fetching data:', error);
    //     });
    // }, []);

    return (
        <VStack style={{flex: 1}}>
            <VStack alignitems={"flex-start"} bgColor={"white"} padding={5}>
                <Text bold fontSize={18}>음원 설정</Text>
                <Text fontSize={14} color={"#616151"} mt={2}>나에게 맞는 음악을 설정해보세요.</Text>
            </VStack>

            <MusicList />

        </VStack>
    );
};