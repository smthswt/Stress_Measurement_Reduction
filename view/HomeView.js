import React, {useEffect} from "react";
import {Box, Button, Center, HStack, Icon, NativeBaseProvider, Pressable, ScrollView, Text, VStack} from "native-base";
import {useBLE} from "./module/BLEProvider";
import {DeviceConnectState} from "./components/DeviceConnectState";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {View} from "react-native";
import {BPM} from "./components/BPM";
import {StressLevel} from "./components/StressLevel";
import Ionicons from "react-native-vector-icons/Ionicons";


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
        <Button onPress={handleAnalysisStart} pl={5} pr={5} bg={'white'}>
            <Text fontWeight={'bold'} color={'#2785F4'}>측정하기</Text>
        </Button>
    );

    const AllResultsImage = require('../view/images/AllResults.png')
    const AllResults = () => {
        return (
            <HStack space={2} justifyContent={"space-between"}>
                <Pressable flex={1}>
                    <VStack alignItems={"center"} justifyContent={"center"} bg={"#FFFFFF"} shadow={2}>
                        <Text>Image</Text>
                        <Text bold fontSize={"lg"}>측정 결과 확인</Text>
                        <Text fontSize={'xs'} textAlign={"center"}>측정 결과를{"\n"}비교하여 확인해보세요.</Text>
                    </VStack>
                </Pressable>
                <Pressable flex={1}>
                    <VStack alignItems={"center"} justifyContent={"center"} bg={"#FFFFFF"} shadow={2}>
                        <Text>Image</Text>
                        <Text bold fontSize={"lg"}>측정 결과 확인</Text>
                        <Text fontSize={'xs'} textAlign={"center"}>측정 결과를{"\n"}비교하여 확인해보세요.</Text>
                    </VStack>
                </Pressable>
            </HStack>
        )
    }

    return (
        <ScrollView style={{flex: 1}}>
                <VStack space={1} h={'100%'} justifyContent={'space-between'}>
                    <DeviceConnectState/>
                    <VStack h={210} bgColor={'#2785F4'} justifyContent={'flex-end'} p={2}>
                        <Ionicons name={"pulse"} color={"#FFFFFF"} size={80}></Ionicons>
                        <HStack p={2} justifyContent={'space-between'} alignItems={'flex-end'} >
                            <Box>
                                <Text color={'white'} fontSize={'lg'} bold>길동님</Text>
                                <Text color={'white'} fontSize={'lg'}>안녕하세요</Text>
                            </Box>
                            <>
                                {isConnected ? DeviceConnected() : DeviceConnected()}
                            </>
                        </HStack>
                    </VStack>
                    <VStack space={1} flex={1}>
                        <Box flex={1} bg={'#E6E6E6'} borderRadius={'5'} p={2}>
                            <VStack space={3} p={1}>
                                <AnalysisDataNotFound/>
                                <BPM/>
                                <StressLevel/>
                                <AllResults/>
                            </VStack>
                        </Box>
                    </VStack>
                </VStack>

            <View>
                <View>
                </View>
            </View>
        </ScrollView>
    );
}
