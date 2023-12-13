import React, {useEffect, useState} from "react";
import {useNavigation} from "@react-navigation/native";
import {useBLE} from "./module/BLEProvider";
import {Button, Heading, Text, VStack} from "native-base";
import {ItemComponent} from "./ItemComponent";


/**
 * Represents the analysis result of a measurement.
 *
 * @class
 */
export const AnalysisResultView = () => {

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
    const handlePress = () => {
        navigation.navigate('Healing');
    };


    return (
        <VStack space={1} p={'5'} h={'100%'} justifyContent={'space-between'}>
            <VStack space={3}>
                <Heading>측정 결과 입니다.</Heading>
                <ItemComponent stressIndex={stressIndex} sdnn={SDNN} hr={HR}/>
            </VStack>
            <VStack space={1}>
                <Button p={'5'} onPress={handlePress} bgColor={'#2785F4'}>
                    <Text fontSize={'15'} fontWeight={'bold'} color={'white'}>힐링하기</Text>
                </Button>
            </VStack>
        </VStack>
    );
}
