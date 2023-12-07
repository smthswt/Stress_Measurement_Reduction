import {AlertDialog, Button, Center, Heading, Progress, Text, VStack, Image} from "native-base";
import React, {useEffect, useState} from "react";
import {useNavigation} from "@react-navigation/native";
import {useBLE} from "../module/BLEProvider";

export const ElectrocardiogramMeasurementView = () => {
    const navigation = useNavigation();
    const {
        sendDataToArduino, receivedData
    } = useBLE();

    // 전체 시간을 정의합니다.
    const totalTime = 60 * 1;
    const messageRef = React.useRef(null);

    const [seconds, setSeconds] = useState(totalTime);
    const [isPaused, setIsPaused] = useState(false);
    const [isOpen, setIsOpen] = React.useState(false);
    const [isMessageOpen, setIsMessageOpen] = React.useState(false);

    const handleSummit = () => {
        setIsOpen(false);
        const timer = setTimeout(() => {
            navigation.navigate('AnalysisEnd');
            clearTimeout(timer);
        }, 500);
    };

    const startAnalysis = () => {
        const message = "AnalysisStart";
        console.log(message);
        sendDataToArduino('b3a4529f-acc1-4f4e-949b-b4b7a2376f4f', 'ed890871-07e9-4967-81b1-22ce3df7728e', message);
    };

    const endAnalysis = () => {
        const message = "AnalysisEnd";
        console.log(message);
        sendDataToArduino('b3a4529f-acc1-4f4e-949b-b4b7a2376f4f', 'ed890871-07e9-4967-81b1-22ce3df7728e', message);
    };

    // 페이지 로드 시, 분석 시작
    useEffect(() => {
        startAnalysis();
    }, []);

    // 분석 시간 체크 루프
    useEffect(() => {
        let timer;
        if (seconds > 0 && !isPaused) {
            timer = setTimeout(() => {
                setSeconds(seconds - 1);
            }, 1000);
        } else if (seconds <= 0) {
            // 시간이 0에 도달하면 측정을 종료 합니다.
            endAnalysis();
            setIsOpen(true);
            // handleSummit();
        }

        return () => clearTimeout(timer);
    }, [seconds, isPaused]);

    // RENST 로 부터 받는 데이터 처리
    useEffect(() => {
        if (receivedData === null || receivedData === '')
            return;

        console.log("Received Data: " + receivedData);
    }, [receivedData])


    // 경과한 시간에 기반한 프로그레스 값 계산
    const progressValue = ((totalTime - seconds) / totalTime) * 100;

    const onOpenAnalysisStopMessageBox = () => {
        setIsPaused(true);
        setIsMessageOpen(true);
    };

    const onCloseAnalysisStopMessageBox = () => {
        setIsMessageOpen(false);
    };

    const handleAnalysisStop = () => {
        // setIsMessageOpen(false);
        // const timer = setTimeout(() => {
        //     navigation.navigate("Home");
        //     clearTimeout(timer);
        // }, 500);
    };

    return (
        <>
            <VStack space={1} p={'5'} h={'100%'} justifyContent={'space-between'}>
                <Heading>심전도 측정 중입니다...</Heading>

                <VStack space={1}>
                    <Center>
                        <Text>{seconds}초 남았습니다.</Text>
                    </Center>
                    <Progress value={progressValue}></Progress>
                    <Button p={'5'} onPress={onOpenAnalysisStopMessageBox}>
                        <Text fontSize={'15'} fontWeight={'bold'} color={'white'}>측정중지</Text>
                    </Button>
                </VStack>
            </VStack>

            <AlertDialog leastDestructiveRef={messageRef} isOpen={isOpen}>
                <AlertDialog.Content p={'2%'}>
                    <VStack space={3}>
                        {/*<Image />*/}
                        <Center>
                            <Text fontSize={'xl'} fontWeight={'bold'}>측정이 완료되었습니다.</Text>
                        </Center>
                        <Button onPress={handleSummit} w={'100%'} p={5}>
                            <Text fontSize={'lg'} fontWeight={'bold'} color={'white'} >확인</Text>
                        </Button>
                    </VStack>
                </AlertDialog.Content>
            </AlertDialog>

            <AlertDialog leastDestructiveRef={messageRef} isOpen={isMessageOpen}
                         onClose={onCloseAnalysisStopMessageBox}>
                <AlertDialog.Content p={'2%'}>
                    <AlertDialog.CloseButton/>
                    <AlertDialog.Header>측정을 중지하시겠습니까?</AlertDialog.Header>
                    <AlertDialog.Body>
                        측정을 중지하고 메뉴 화면으로 이동 합니다.
                    </AlertDialog.Body>
                    <Center mt={3} mb={3}>
                        <Button colorScheme="danger" onPress={handleAnalysisStop} width={'80%'}>
                            확인
                        </Button>
                    </Center>
                </AlertDialog.Content>
            </AlertDialog>
        </>
    );
};