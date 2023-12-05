import {AlertDialog, Button, Center, Heading, Progress, Text, VStack, Image} from "native-base";
import React, {useEffect, useState} from "react";
import {useNavigation} from "@react-navigation/native";
import {useBLE} from "../module/BLEProvider";

export const MassageHealingView = () => {
    const navigation = useNavigation();

    const {
        sendDataToArduino,
    } = useBLE();

    // 전체 시간을 정의합니다.
    const totalTime = 10;
    const cancelRef = React.useRef(null);
    const messageRef = React.useRef(null);

    const [seconds, setSeconds] = useState(totalTime);
    const [isOpen, setIsOpen] = React.useState(false);
    const [isMessageOpen, setIsMessageOpen] = React.useState(false);

    const handleSummit = () => {
        setIsOpen(false);
        navigation.navigate('Home');
    };

    const sendTestData = () => {
        const message = "Hello World";
        console.log(message);
        sendDataToArduino('b3a4529f-acc1-4f4e-949b-b4b7a2376f4f', 'ed890871-07e9-4967-81b1-22ce3df7728e', message);
    };

    const sendHealingStart = () => {
        const message = "HealingStart";
        console.log(message);
        sendDataToArduino('b3a4529f-acc1-4f4e-949b-b4b7a2376f4f', 'ed890871-07e9-4967-81b1-22ce3df7728e', message);
    };

    const sendHealingStop = () => {
        const message = "HealingStop";
        sendDataToArduino('b3a4529f-acc1-4f4e-949b-b4b7a2376f4f', 'ed890871-07e9-4967-81b1-22ce3df7728e', message);
    };

    useEffect(() => {
        sendHealingStart();
    }, []);

    // 경과한 시간에 기반한 프로그레스 값 계산
    const progressValue = ((totalTime - seconds) / totalTime) * 100;

    const onOpenHealingStopMessageBox = () => {
        setIsMessageOpen(true);
    };

    const onCloseHealingStopMessageBox = () => {
        setIsMessageOpen(false);
    };

    const handleHealingStop = () => {
        sendHealingStop();
        setIsMessageOpen(false);
        const timer = setTimeout(() => {
            navigation.navigate("Home");
            clearTimeout(timer);
        }, 500);
    };

    return (
        <>
            <VStack space={1} p={'5'} h={'100%'} justifyContent={'space-between'}>
                <Heading>힐링을 시작 합니다...</Heading>

                <VStack space={1}>
                    {/*<Center>*/}
                    {/*    <Text>{seconds}초 남았습니다.</Text>*/}
                    {/*</Center>*/}
                    {/*<Progress value={progressValue}></Progress>*/}
                    <Button p={'5'} onPress={onOpenHealingStopMessageBox}>
                        <Text fontSize={'15'} fontWeight={'bold'} color={'white'}>힐링 중지</Text>
                    </Button>
                </VStack>
            </VStack>
            <AlertDialog leastDestructiveRef={messageRef} isOpen={isMessageOpen} onClose={onCloseHealingStopMessageBox}>
                <AlertDialog.Content p={'2%'}>
                    <AlertDialog.CloseButton/>
                    <AlertDialog.Header>힐링을 중지하시겠습니까?</AlertDialog.Header>
                    <AlertDialog.Body>
                        힐링을 중지하고 메뉴 화면으로 이동 합니다.
                    </AlertDialog.Body>
                    <Center mt={3} mb={3}>
                        <Button colorScheme="danger" onPress={handleHealingStop} width={'80%'}>
                            확인
                        </Button>
                    </Center>
                </AlertDialog.Content>
            </AlertDialog>
            {/*<AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen}>*/}
            {/*    <AlertDialog.Content p={'2%'}>*/}
            {/*        <VStack space={3}>*/}
            {/*            <Image />*/}
            {/*            <Center>*/}
            {/*                <Text fontSize={'xl'} fontWeight={'bold'}>힐링 마사지가 완료되었습니다.</Text>*/}
            {/*            </Center>*/}
            {/*            <Button onPress={handleSummit} w={'100%'} p={5}>*/}
            {/*                <Text fontSize={'lg'} fontWeight={'bold'} color={'white'} >확인</Text>*/}
            {/*            </Button>*/}
            {/*        </VStack>*/}
            {/*    </AlertDialog.Content>*/}
            {/*</AlertDialog>*/}
        </>
    );
};