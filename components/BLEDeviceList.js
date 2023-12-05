import React from 'react';
import {useBLE} from "../module/BLEProvider";
import {Box, Button, Text, VStack} from "native-base";

export const BLEDeviceList = () => {
    const {devices, scanAndConnect} = useBLE();

    return (
        <Box>
            <Button onPress={() => scanAndConnect()}>Scan for Devices</Button>
            <VStack>
                {devices.map((device) => (
                    <Text key={device.id}>{device.name || 'Unknown Device'} _ {device.id}</Text>
                ))}
            </VStack>
            {/*<ul>*/}
            {/*    {devices.map((device) => (*/}
            {/*        <li key={device.id}>{device.name || 'Unknown Device'}</li>*/}
            {/*    ))}*/}
            {/*</ul>*/}
        </Box>
    );
};
