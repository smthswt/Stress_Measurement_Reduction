import {AlertDialog, Button, Center, Heading, Progress, Text, VStack, Image, Modal, HStack} from "native-base";
import React, {useEffect, useRef, useState} from "react";
import {useNavigation} from "@react-navigation/native";
import {useBLE} from "./module/BLEProvider";
import Ionicons from "react-native-vector-icons/Ionicons";

/**
 * A React component that displays the Electrocardiogram Measurement view.
 *
 * @returns {JSX.Element} The Electrocardiogram Measurement view component.
 */
export const ElectrocardiogramMeasurementView = () => {

    /**
     * Retrieves the navigation object used for navigating within the application.
     *
     * @returns {object} The navigation object.
     */
    const navigation = useNavigation();


    /**
     * Sends data to an Arduino device.
     *
     * @param {string} data - The data to be sent to the Arduino device.
     * @throws {Error} If connection to the Arduino device fails.
     * @returns {boolean} True if the data was successfully sent, false otherwise.
     */
    const {sendData, receivedData} = useBLE();


    /**
     * Represents the total time in minutes.
     *
     * @type {number}
     */
    const totalTime = 20;

    /**
     * Reference to a message element used in a React component.
     *
     * @type {React.RefObject<HTMLElement>}
     * @name messageRef
     * @description The `messageRef` is a React ref object that can be used to reference
     *              a message element in a React component. It can be used to access and
     *              manipulate the message element programmatically.
     */
    const messageRef = React.useRef(null);

    /**
     * React useRef hook provides a way to hold a mutable value within a functional component.
     * The useRef() function returns an object with a 'current' property that can be used to access and modify the value.
     * This is commonly used to persist a value between renders without causing a re-render of the component.
     *
     * @type {React.MutableRefObject<any>}
     */
    const interval = useRef();

    /**
     * Represents a duration in seconds.
     *
     * @typedef {number} seconds
     */
    const [seconds, setSeconds] = useState(totalTime);


    /**
     * Determines if the execution of a process is currently paused.
     *
     * @type {boolean}
     * @description The value of this variable should be set to true when the process is paused, and false when it is running.
     * @example
     * // When the process is paused
     * isPaused = true;
     *
     * // When the process is running
     * isPaused = false;
     */
    const [isPaused, setIsPaused] = useState(false);


    /**
     * Determines if a certain variable is open or not.
     *
     * @param {boolean} isOpen - The variable indicating if something is open or not.
     * @returns {boolean} - Returns true if the variable is open, otherwise returns false.
     */
    const [isOpen, setIsOpen] = React.useState(false);


    /**
     * Represents whether a message is open or not.
     *
     * @type {boolean}
     */
    const [isMessageOpen, setIsMessageOpen] = React.useState(false);


    /**
     * Function to handle summit action
     * @function handleSummit
     */

    /**
     * Starts the analysis process.
     *
     * @function startAnalysis
     * @returns {void}
     */
    const startAnalysis = () => {
        const message = "AnalysisStart";
        console.log(message);
        sendData('b3a4529f-acc1-4f4e-949b-b4b7a2376f4f', 'ed890871-07e9-4967-81b1-22ce3df7728e', message);
    };

    /**
     * Logs a message indicating the end of analysis and sends the data to Arduino.
     *
     * @function endAnalysis
     * @returns {void}
     */
    const endAnalysis = () => {
        const message = "AnalysisEnd";
        console.log(message);
        sendData('b3a4529f-acc1-4f4e-949b-b4b7a2376f4f', 'ed890871-07e9-4967-81b1-22ce3df7728e', message);
    };


    /**
     * Event called when the page is activated
     */
    useEffect(() => {
        startAnalysis();

        interval.current = setInterval(() => {
           setSeconds(prevState => prevState - 1);
        }, 1000);

        return () => clearInterval(interval.current);
    }, []);

    /**
     * Event called when seconds changes
     */

    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        console.log("Time: " + seconds);

        if (seconds === 18)
        {
            setShowModal(true)
        }

        if(seconds <= 0)
        {
            clearInterval(interval.current);
            setIsOpen(true);
            endAnalysis();
        }
    }, [seconds])


    /**
     * Data processing received from BLE
     * Called whenever receivedData is updated.
     */
    useEffect(() => {
        if (receivedData === null || receivedData === '')
            return;

        console.log("Received Data: " + receivedData);
    }, [receivedData])

    /**
     * This function opens the Stop Analysis message box.
     * Set the variables 'isPaused' and 'isMessageOpen' to true.
     *
     * @function onOpenAnalysisStopMessageBox
     * @returns {void}
     */
    const onOpenAnalysisStopMessageBox = () => {
        setIsPaused(true);
        setIsMessageOpen(true);
    };

    /**
     * Closes the analysis stop message box.
     * @function
     * @name onCloseAnalysisStopMessageBox
     * @returns {void}
     */
    const onCloseAnalysisStopMessageBox = () => {
        setIsMessageOpen(false);
    };

    /**
     * Handles the event when analysis stops.
     * This function should be called when the analysis has finished.
     * It performs some actions like closing message and navigating to the home page.
     *
     * @function handleAnalysisStop
     * @returns {void}
     */
    const handleAnalysisStop = () => {

        // TODO: 분석 종료가 확인되면 호출되는 이벤트를 처리 해야 합니다.
        // setIsMessageOpen(false);
        // const timer = setTimeout(() => {
        //     navigation.navigate("Home");
        //     clearTimeout(timer);
        // }, 500);
    };

    /**
     * Represents the progress value based on the remaining time.
     *
     * @param {number} totalTime - The total time in seconds.
     * @param {number} seconds - The seconds elapsed.
     * @returns {number} - The progress value as a percentage (0-100).
     */
    const progressValue = ((totalTime - seconds) / totalTime) * 100;

    const emotion_happy = require('../view/images/emotion_happy.png')
    const emotion_normal = require('../view/images/emotion_normal.png')
    const emotion_soso = require('../view/images/emotion_soso.png')
    const emotion_tired = require('../view/images/emotion_tired.png')
    const emotion_sad = require('../view/images/emotion_sad.png')
    const emotion_angry = require('../view/images/emotion_angry.png')

    const emotions = [
        { name: 'emotion_happy', source: emotion_happy },
        { name: 'emotion_tired', source: emotion_tired },
        { name: 'emotion_normal', source: emotion_normal },
        { name: 'emotion_sad', source: emotion_sad },
        { name: 'emotion_soso', source: emotion_soso },
        { name: 'emotion_angry', source: emotion_angry },
    ]
    const [selectedEmotion, setSelectedEmotion] = useState(null);
    const handleEmotionSelect = (emotionName) => {
        if (selectedEmotion === emotionName) {
            setSelectedEmotion(null);
        } else {
            setSelectedEmotion(emotionName);
        }
    };
    const renderEmotions = () => {
        const columns = emotions.reduce((acc, emotion, index) => {
            const columnIndex = Math.floor(index / 2); // Split into columns with 2 rows each
            acc[columnIndex] = acc[columnIndex] || [];
            acc[columnIndex].push(
                <VStack key={index} flex={1}>
                    <Center>
                        <Button
                            onPress={() => handleEmotionSelect(emotion.name)}
                            style={{
                                backgroundColor: selectedEmotion === emotion.name ? '#F5F5F6' : 'transparent',
                                borderRadius: 50,
                            }}
                        >
                            <Image source={emotion.source} alt={emotion.name}></Image>
                        </Button>
                        <Text>{emotion.name}</Text>
                    </Center>
                </VStack>
            );
            return acc;
        }, []);

        return columns.map((column, index) => (
            <VStack key={index} space={5} flex={1}>
                {column}
            </VStack>
        ));
    };

    const handleSubmit = () => {
        if (selectedEmotion) {
            console.log('Selected emotion:', selectedEmotion);
            // Perform additional actions with the selected emotion here
            // For example, pass it to a parent component or perform an API call
        }
        // Optionally, close the modal after submission
        setShowModal(false);
    };

    const handleSummit = () => {
        setIsOpen(false);
        const timer = setTimeout(() => {
            if (selectedEmotion) {
                navigation.navigate('AnalysisViewScreens', {screen: 'AnalysisEnd', params: {selectedEmotion: selectedEmotion}});
                clearTimeout(timer);
            }
        }, 500);
    };

    return (
        <>
            <VStack space={1} p={'5'} h={'100%'} justifyContent={'space-between'} bg={"#2785f4"}>
                <Heading color={"#FFFFFF"}>심전도 측정 중입니다...</Heading>
                <VStack space={1} bg={"#FFFFFF"} p={5} shadow={2}>
                    <Center>
                        <Text>{seconds}초 남았습니다.</Text>
                    </Center>
                    <Progress value={progressValue} colorScheme={"blue"}></Progress>
                    <Button p={'5'} onPress={onOpenAnalysisStopMessageBox} bgColor={'#2785F4'} mt={2}>
                        <Text fontSize={'15'} fontWeight={'bold'} color={'white'}>측정중지</Text>
                    </Button>
                </VStack>
            </VStack>

            {/*Popup select emotion when time reaches 20s, consider using ActionSheet instead*/}
            <Modal isOpen={showModal} size="full">
                <Modal.Content borderTopLeftRadius={20} borderTopRightRadius={20} bg="white" p={4} style={{ position: 'absolute', bottom: 0, borderRadius: 0 }}>
                    <Modal.Body>
                        <Center mb={5}>
                            <Text textAlign="center" bold fontSize="2xl">
                                현재 기분이 어떠신가요?
                            </Text>
                        </Center>
                        <Center>
                            <HStack pb={5}>
                                {renderEmotions()}
                            </HStack>
                        </Center>
                        <Button bgColor={'#2785F4'} onPress={() => {handleSubmit()}} isDisabled={!selectedEmotion} _disabled={{ bgColor: '#a9a9a9' }}>
                            {!selectedEmotion && <Text color="white">감정을 선택해주세요.</Text>}
                            {selectedEmotion && <Text color="white">선택완료</Text>}
                        </Button>
                    </Modal.Body>
                </Modal.Content>
            </Modal>

            {/*측정 완료 다이얼로그*/}
            <AlertDialog leastDestructiveRef={messageRef} isOpen={isOpen}>
                <AlertDialog.Content p={'2%'}>
                    <VStack space={3} p={3}>
                        <Center>
                            <Ionicons name={"checkmark-circle-outline"} size={100} color={"#59BCFF"}/>
                        </Center>
                        <Center>
                            <Text fontSize={'xl'} fontWeight={'bold'}>측정이 완료되었습니다.</Text>
                        </Center>
                        <Button onPress={handleSummit} w={'100%'} p={5} bgColor={'#2785F4'}>
                            <Text fontSize={'lg'} fontWeight={'bold'} color={'white'}>확인</Text>
                        </Button>
                    </VStack>
                </AlertDialog.Content>
            </AlertDialog>

            {/*측정 중지 확인 다이얼로그*/}
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
