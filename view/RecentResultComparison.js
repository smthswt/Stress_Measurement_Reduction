import React, {useEffect, useState} from "react";
import {useNavigation} from "@react-navigation/native";
import {useBLE} from "./module/BLEProvider";
import {Button, Center, Heading, HStack, Image, Link, Text, VStack} from "native-base";
import {ItemComponent} from "./ItemComponent";
import Ionicons from "react-native-vector-icons/Ionicons";
import {AnimatedCircularProgress} from "react-native-circular-progress";
import SemiCircleProgress from "./components/SemiCirle";


/**
 * Represents the analysis result of a measurement.
 *
 * @class
 */
export const RecentResultComparison = ({route}) => {
    const selectedEmotion  = route.params;
    console.log(selectedEmotion)
    /**
     * UseNavigation function
     *
     * This function retrieves a navigation object to navigate through an application.
     *
     * @returns {object} - The navigation object.
     */
    const navigation = useNavigation();

    /**
     * Sends data to Arduino.
     * @param {Object} data - The data to be sent to Arduino.
     * @returns {boolean} - True if the data was successfully sent to Arduino, false otherwise.
     */
    const {sendData, receivedData} = useBLE();


    /**
     * Represents the stress index of a given object.
     *
     * @typedef {number} StressIndex
     */
    const [stressIndex, setStressIndex] = useState(null);


    /**
     * Represents the SDNN variable.
     *
     * @typedef {number} SDNN
     */
    const [SDNN, setSDNN] = useState(null);

    /**
     * The HR variable represents the human resources department of a company.
     * It stores information related to employees, such as their names, job titles, and contact information.
     *
     * @typedef {Object} HR
     */
    const [HR, setHR] = useState(null);


    /**
     * Send a request to retrieve analytics data.
     *
     * @function sendGetAnalysisData
     * @returns {void}
     */
    const sendGetAnalysisData = () => {
        const message = "GetAnalysisData";
        sendData('b3a4529f-acc1-4f4e-949b-b4b7a2376f4f', 'ed890871-07e9-4967-81b1-22ce3df7728e', message);
    };


    useEffect(() => {
        sendGetAnalysisData();
    }, []);


    useEffect(() => {

        if (receivedData === null || receivedData === '')
            return;

        console.log("AnalysisResult Received Data: " + receivedData);

        const handleData = (data) => {
            const jsonObject = JSON.parse(data);

            let message = jsonObject["message"];
            let stressIndex = jsonObject["StressIndex"];
            let sdnn = jsonObject["SDNN"];
            let hr = jsonObject["HR"];

            setStressIndex(stressIndex);
            setSDNN(sdnn);
            setHR(hr);

            console.info("Message: " + message + ", Stress Index: " + stressIndex + ", SDNN: " + sdnn + ", HR: " + hr);
        };

        handleData(receivedData);

    }, [receivedData]);

    /**
     * Function to handle press event.
     * Navigates to the 'Healing' page.
     *
     * @function handlePress
     * @returns {void}
     */

    const emotions = {
        emotion_happy:  require('../view/images/emotion_happy.png') ,
        emotion_tired:  require('../view/images/emotion_tired.png') ,
        emotion_normal: require('../view/images/emotion_normal.png') ,
        emotion_sad: require('../view/images/emotion_sad.png') ,
        emotion_soso: require('../view/images/emotion_soso.png'),
        emotion_angry: require('../view/images/emotion_angry.png'),
    };

    return (
        <VStack space={5} h={'100%'} m={5}>
            <VStack space={1} justifyContent={"space-between"} p={5} bgColor={"white"} shadow={2}>
                <HStack justifyContent={'space-between'} alignItems={'center'}>
                    <Text bold fontSize={'lg'}>최근 검사 기록</Text>
                    <Image source={emotions.emotion_happy} alt={'test'}/>
                </HStack>
                <ItemComponent hr={HR} sdnn={SDNN} stressIndex={stressIndex}></ItemComponent>
            </VStack>
            <VStack space={1} justifyContent={"space-between"} p={5} bgColor={"white"} shadow={2}>
                <HStack justifyContent={'space-between'} alignItems={'center'}>
                    <Text bold fontSize={'lg'}>마지막 검사 기록</Text>
                    <Image source={emotions.emotion_sad} alt={'test'}/>
                </HStack>
                <ItemComponent hr={HR} sdnn={SDNN} stressIndex={stressIndex}></ItemComponent>
            </VStack>
        </VStack>
    );
}
