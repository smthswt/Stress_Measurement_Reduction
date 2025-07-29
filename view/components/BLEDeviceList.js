import React from 'react';
import {useBLE} from '../module/BLEProvider';
import {Box, Button, Text, VStack} from 'native-base';

/**
 * Represents a list of Bluetooth Low Energy (BLE) devices.
 *
 * @returns {*} The rendered JSX representation of the BLEDeviceList component.
 */
export const BLEDeviceList = () => {
  const {devices, scanAndConnect} = useBLE();

  return (
    <Box>
      <Button onPress={() => scanAndConnect()}>Scan for Devices</Button>
      <VStack>
        {devices.map(device => (
          <Text key={device.id}>
            {device.name || 'Unknown Device'} _ {device.id}
          </Text>
        ))}
      </VStack>
    </Box>
  );
};
