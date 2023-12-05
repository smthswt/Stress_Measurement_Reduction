import {Button, Center, Heading, Progress, Text, VStack} from "native-base";
import React, {useEffect, useState} from "react";
import {ItemComponent} from "./ItemComponent";
import {useNavigation} from "@react-navigation/native";
import {useBLE} from "../module/BLEProvider";


export const AnalysisResult = () => {
    const navigation = useNavigation();
    const {
        sendDataToArduino, receivedData
    } = useBLE();

    const [stressIndex, setStressIndex] = useState(null);
    const [SDNN, setSDNN] = useState(null);
    const [HR, setHR] = useState(null);

    const sendGetAnalysisData = () => {
        const message = "GetAnalysisData";
        sendDataToArduino('b3a4529f-acc1-4f4e-949b-b4b7a2376f4f', 'ed890871-07e9-4967-81b1-22ce3df7728e', message);
    };

    useEffect(() => {
        sendGetAnalysisData();
    }, []);

    useEffect(() => {

        if (receivedData === null || receivedData === '')
            return;

        console.log("AnalysisResult Received Data: " + receivedData);

        const jsonObject = JSON.parse(receivedData);

        let message = jsonObject["message"];
        let stressIndex = jsonObject["StressIndex"];
        let sdnn = jsonObject["SDNN"];
        let hr = jsonObject["HR"];

        setStressIndex(stressIndex);
        setSDNN(sdnn);
        setHR(hr);

        console.info("Message: " + message + ", Stress Index: " + stressIndex + ", SDNN: " + sdnn + ", HR: " + hr);

    }, [receivedData]);

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
                <Button p={'5'} onPress={handlePress}>
                    <Text fontSize={'15'} fontWeight={'bold'} color={'white'}>힐링하기</Text>
                </Button>
            </VStack>
        </VStack>
    );
}