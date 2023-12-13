import {AlertDialog, Button, Center, Heading, Progress, Text, VStack, Image} from "native-base";
import React, {useEffect, useState} from "react";
import {useNavigation} from "@react-navigation/native";
import {useBLE} from "./module/BLEProvider";

/**
 * The MassageHealingView component represents the view for a massage healing process.
 *
 * The component provides functionality for sending commands to an Arduino device,
 * displaying a countdown timer, and handling the stoppage of the healing process.
 *
 * @component
 * @example
 * // Example usage of MassageHealingView component
 * const App = () => {
 *     return (
 *         <MassageHealingView />
 *     );
 * }
 *
 * @returns {JSX.Element} The MassageHealingView component.
 */
export const MassageHealingView = () => {

    /**
     * Retrieves the navigation object used for navigating within the application.
     *
     * @returns {object} The navigation object.
     */
    const navigation = useNavigation();


    /**
     * Sends data.
     *
     * @param {String} data - The data to be sent to Arduino.
     * @returns {boolean} Returns true if sending data to Arduino is successful,
     *                    otherwise returns false.
     *
     * @throws {TypeError} If the data parameter is not a string.
     *
     * @example
     * sendData('Hello Arduino');
     */
    const {sendData} = useBLE();


    /**
     * Represents the total time in seconds.
     *
     * @type {number}
     */
    const totalTime = 10;


    /**
     * A React useRef hook for storing a reference to the cancel function.
     *
     * @type {React.RefObject<null>}
     */
    const cancelRef = React.useRef(null);


    /**
     * A React useRef hook that stores a reference to a message element.
     *
     * @type {React.MutableRefObject<HTMLElement|null>}
     */
    const messageRef = React.useRef(null);

    const [seconds, setSeconds] = useState(totalTime);
    const [isOpen, setIsOpen] = React.useState(false);
    const [isMessageOpen, setIsMessageOpen] = React.useState(false);


    useEffect(() => {
        sendHealingStart();
    }, []);


    const sendHealingStart = () => {
        const message = "HealingStart";
        console.log(message);
        sendData('b3a4529f-acc1-4f4e-949b-b4b7a2376f4f', 'ed890871-07e9-4967-81b1-22ce3df7728e', message);
    };

    const sendHealingStop = () => {
        const message = "HealingStop";
        sendData('b3a4529f-acc1-4f4e-949b-b4b7a2376f4f', 'ed890871-07e9-4967-81b1-22ce3df7728e', message);
    };

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
            navigation.navigate("TabScreens", {screen:"Home"});
            clearTimeout(timer);
        }, 500);
    };

    return (
        <>
            <VStack space={1} p={'5'} h={'100%'} justifyContent={'space-between'}>
                <Heading>힐링을 시작 합니다...</Heading>
                <VStack space={1}>
                    <Button p={'5'} onPress={onOpenHealingStopMessageBox} bgColor={"#2785F4"}>
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
        </>
    );
};
