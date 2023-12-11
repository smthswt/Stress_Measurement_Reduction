import React, {useEffect} from "react";
import {Box, Button, Center, Text, VStack} from "native-base";
import {useBLE} from "./module/BLEProvider";
import {DeviceConnectState} from "./components/DeviceConnectState";


/**
 * Represents a component that displays a message when analysis data is not found.
 *
 * @returns {ReactElement} The rendered component.
 */
const AnalysisDataNotFound = () => (
    <Box borderRadius="sm" borderWidth={0} bgColor="blueGray.300" p={3}>
        <Center>
            <Text fontWeight={'bold'}>측정 데이터가 없습니다.</Text>
        </Center>
    </Box>
);


/**
 * HomeScreen component representing the home screen of the application.
 *
 * @param navigation - The navigation object used to navigate between screens.
 * @returns JSX element representing the home screen.
 */
export const HomeView = ({navigation}) => {

    /**
     * Represents a boolean variable indicating the connection status.
     *
     * @type {boolean}
     */
    const {isConnected} = useBLE();

    /**
     * This function handles the analysis start event by navigating to the "AnalysisStart" screen.
     *
     * @function
     * @name handleAnalysisStart
     * @returns {void}
     */
    const handleAnalysisStart = () => {
        navigation.navigate("AnalysisStart");
    };

    /**
     * Represents a component to display a message when the device is not found.
     * @function DeviceNotFound
     * @returns {JSX.Element} - The rendered component.
     */
    const DeviceNotFound = () => (
        <Button bg={'gray.400'} onPress={handleAnalysisStart} p={'5'} disabled={true}>
            <Text fontSize={'15'} fontWeight={'bold'} color={'white'}>디바이스가 연결되어야 측정 할 수 있습니다.</Text>
        </Button>
    );

    /**
     * Represents a component for a device connected state.
     *
     * @return {Component} A component with a button for analysis start.
     */
    const DeviceConnected = () => (
        <Button onPress={handleAnalysisStart} p={'5'}>
            <Text fontSize={'15'} fontWeight={'bold'} color={'white'}>측정시작</Text>
        </Button>
    );


    return (
        <VStack space={1} p={2} h={'100%'} justifyContent={'space-between'}>
            <VStack space={1} flex={1}>
                <DeviceConnectState/>
                <Box flex={1} bg={'#E6E6E6'} borderRadius={'5'} p={2}>
                    <VStack space={3} p={1}>
                        <Text fontWeight={'bold'}>최근 측정 데이터 비교</Text>
                        <AnalysisDataNotFound/>
                    </VStack>
                </Box>
            </VStack>
            <>
                {isConnected ? DeviceConnected() : DeviceConnected()}
            </>
        </VStack>
    );
}