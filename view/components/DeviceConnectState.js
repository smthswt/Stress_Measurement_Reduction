import React from 'react';
import {useBLE} from "../module/BLEProvider";
import {Box, Button, HStack, Text, VStack} from "native-base";


/**
 * Represents the state of the device connection.
 * @typedef {Object} DeviceConnectState
 */
export const DeviceConnectState = () => {

    /**
     * Represents the connected device.
     */
    const {connectedDevice, disconnectFromDevice, findDevice, connectAndSubscribe} = useBLE();

    /**
     * Asynchronous function to handle device connection.
     *
     * @function handleConnect
     * @async
     * @returns {void}
     */
    const handleConnect = async () => {
        const device = await findDevice('ESP32_BLE');
        if (device) {
            // console.log('장치에 연결됨:', device.name);
            await connectAndSubscribe(device.id, 'b3a4529f-acc1-4f4e-949b-b4b7a2376f4f', 'ed890871-07e9-4967-81b1-22ce3df7728e');
        }
    };

    /**
     * Handles the disconnect event of the device.
     *
     * @async
     * @function handleDisconnect
     * @returns {Promise} - A Promise that resolves when the device is disconnected.
     */
    const handleDisconnect = async () => {
        await disconnectFromDevice();
    };

    /**
     * Represents a component for displaying a device not found message.
     * @returns {React.Component} The rendered `DeviceNotFound` component.
     */
    const DeviceNotFound = () => (
        <Box p={'3%'} bg={'#3E3E3E'} borderRadius={'5'}>
            <HStack justifyContent={'space-between'}>
                <VStack>
                    <Text fontSize={'15px'} fontWeight={'bold'} color={'white'}>RENST DEVICE</Text>
                    <Text fontSize={'15px'} fontWeight={'bold'} color={'white'}>NOT CONNECTED</Text>
                </VStack>
                <Button onPress={handleConnect}>DEVICE CONNECT</Button>
            </HStack>
        </Box>
    );

    /**
     * Represents a component for displaying a connected device.
     *
     * @returns {React.Element} - The rendered connected device component.
     */
    const DeviceConnected = () => (
        <Box p={'3%'} bg={'#005F65'} borderRadius={'5'}>
            <HStack justifyContent={'space-between'}>
                <VStack>
                    <Text fontSize={'15px'} fontWeight={'bold'} color={'white'}>RENST DEVICE</Text>
                    <Text fontSize={'15px'} fontWeight={'bold'} color={'white'}>CONNECTED</Text>
                </VStack>
                <Button onPress={handleDisconnect}>DEVICE DISCONNECT</Button>
            </HStack>
        </Box>
    );

    return (
        <>
            {connectedDevice ? DeviceConnected() : DeviceNotFound()}
        </>
    );
};
