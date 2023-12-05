import {Avatar, Card} from "react-native-paper";
import {Box, Button, Center, HStack, Text, VStack} from "native-base";
import React, {useEffect} from "react";
import {useBLE} from "../module/BLEProvider";
import {DeviceConnectState} from "../components/DeviceConnectState";
import {ItemComponent} from "./ItemComponent";
import {Footer} from "../Footer";

const LeftContent = props => <Avatar.Icon {...props} icon="folder"/>

const AnalysisDataNotFound = () => (
    <Box borderRadius="sm" borderWidth={0} bgColor="blueGray.300" p={3}>
        <Center>
            <Text fontWeight={'bold'}>측정 데이터가 없습니다.</Text>
        </Center>
    </Box>
);

export const HomeScreen = ({navigation}) => {
    const { connectedDevice, isConnected } = useBLE();

    // const sendTestData = () => {
    //     const message = "Hello World";
    //     console.log(message);
    //     sendDataToArduino('b3a4529f-acc1-4f4e-949b-b4b7a2376f4f', 'ed890871-07e9-4967-81b1-22ce3df7728e', message);
    // };

    useEffect(() => {
    }, [connectedDevice]);

    const handleAnalysisStart = () => {
        navigation.navigate("AnalysisStart");
    };

    const DeviceNotFound = () => (
        <Button bg={'gray.400'} onPress={handleAnalysisStart} p={'5'} disabled={true}>
            <Text fontSize={'15'} fontWeight={'bold'} color={'white'}>디바이스가 연결되어야 측정 할 수 있습니다.</Text>
        </Button>
    );

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
                        {/*<ItemComponent/>*/}
                        {/*<ItemComponent/>*/}
                        {/*<ItemComponent/>*/}
                        <AnalysisDataNotFound/>
                    </VStack>
                </Box>
            </VStack>
            <>
                {isConnected ? DeviceConnected() : DeviceNotFound()}
            </>
        </VStack>
    );
}