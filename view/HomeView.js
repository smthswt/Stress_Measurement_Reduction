import React, {useEffect} from "react";
import {
    Box,
    Button,
    Center,
    HStack,
    Image,
    NativeBaseProvider,
    Pressable,
    ScrollView,
    Text,
    VStack
} from "native-base";
import {useBLE} from "./module/BLEProvider";
import {DeviceConnectState} from "./components/DeviceConnectState";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {View} from "react-native";
import {BPM} from "./components/BPM";
import {StressLevel} from "./components/StressLevel";
import Ionicons from "react-native-vector-icons/Ionicons";
import HeartIcon from "./images/HeartIcon.svg"
import HeartIconSvg from "./components/HeartIconSvg";
import {SvgXml} from "react-native-svg";


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

const xml =`
<svg width="66" height="64" viewBox="0 0 66 64" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_986_6145)">
<path d="M41 29.3153C41 30.4044 40.584 31.509 39.712 32.3569L33.008 39L26.288 32.3569C25.432 31.5167 25 30.4044 25 29.3153C25 28.2263 25.432 27.1061 26.288 26.266C27.976 24.578 30.744 24.578 32.448 26.266L33.008 26.8183L33.552 26.266C35.256 24.578 38.04 24.578 39.712 26.266C40.584 27.1139 41 28.2185 41 29.3231V29.3153Z" fill="#2785F4"/>
</g>
<defs>
<filter id="filter0_d_986_6145" x="0" y="0" width="66" height="64" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
<feFlood flood-opacity="0" result="BackgroundImageFix"/>
<feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
<feOffset/>
<feGaussianBlur stdDeviation="12.5"/>
<feComposite in2="hardAlpha" operator="out"/>
<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.8 0"/>
<feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_986_6145"/>
<feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_986_6145" result="shape"/>
</filter>
</defs>
</svg>`
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

    const handleMovetoViewAllResults = () => {
        navigation.navigate("HomeView_AllResults")
    }

    const handleMovetoViewAllStress = () => {
        navigation.navigate("HomeView_AllStress")
    }

    const AllResultsImage = require('../view/images/AllResults.png')
    const StressResultsImage = require('../view/images/AllStress.png')
    const AllResults = () => {
        return (
            <HStack space={2} justifyContent={"space-between"}>
                <Pressable flex={1} onPress={handleMovetoViewAllResults}>
                    {({
                          isHovered,
                          isFocused,
                          isPressed
                      }) => {
                         return <VStack alignItems={"center"} justifyContent={"center"} bg={isPressed ? "coolGray.200" : isHovered ? "coolGray.200" : "white"}
                                        style={{
                                            transform: [{
                                                scale: isPressed ? 0.96 : 1
                                            }]
                                        }} shadow={2} pt={5}
                                        pb={5} >
                             <Box h={100} alignContent={"center"}>
                                 <Image source={AllResultsImage} alt={"view-all-results"}></Image>
                             </Box>
                             <Text bold fontSize={"lg"}>측정 결과 확인</Text>
                             <Text fontSize={'xs'} textAlign={"center"}>측정 결과를{"\n"}비교하여 확인해보세요.</Text>
                         </VStack>
                    }}
                </Pressable>
                <Pressable flex={1} onPress={handleMovetoViewAllStress}>
                    {({
                          isHovered,
                          isFocused,
                          isPressed
                    }) => {
                        return <VStack alignItems={"center"} justifyContent={"center"} bg={isPressed ? "coolGray.200" : isHovered ? "coolGray.200" : "white"}
                                       style={{
                                           transform: [{
                                               scale: isPressed ? 0.96 : 1
                                           }]
                                       }} shadow={2} pt={5}
                                       pb={5} >
                            <Box h={100} alignContent={"center"}><Image source={StressResultsImage}
                                                                        alt={"view-all-stress"}></Image></Box>
                            <Text bold fontSize={"lg"}>스트레스 정보</Text>
                            <Text fontSize={'xs'} textAlign={"center"}>최근 검사한 스트레스{"\n"}수치를 한눈에 볼 수 있어요.</Text>
                        </VStack>
                    }}
                </Pressable>
            </HStack>
        )
    }

    return (
        <ScrollView style={{flex: 1}}>
                <VStack space={1} h={'100%'} justifyContent={'space-between'}>
                    <DeviceConnectState/>
                    <VStack h={210} bgColor={"black"} justifyContent={'flex-end'} p={2}>
                        <Ionicons name={"pulse"} color={"#FFFFFF"} size={80}></Ionicons>
                        <SvgXml xml={xml} width="100%" height="100%"/>
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
