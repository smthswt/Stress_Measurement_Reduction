import React from "react";
import {Box, Button, Center, HStack, Image, Text, View, VStack} from "native-base";
import {ImageBackground, TouchableOpacity, StyleSheet} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import {Easing} from "react-native-reanimated";
import {MotiView} from "moti";

const EnrollingDeviceView = ({navigation}) => {

    const deviceImage = require("./images/RenstDevice.png");
    const backgroundImage = require('./images/BackgroundofRenstDevice.png');
    
    const handleSearch = () => {
        console.log("검색 버튼 클릭")
        navigation.navigate("DeviceSettingScreens", {screen: "CompleteEnroll"})
    }

    function WaveAnimation() {
        return (
            <MotiView
                from={{
                    opacity: 0.7,
                    scale: 1,
                }}
                animate={{
                    opacity: 0,
                    scale: 4,
                }}
                transition={{
                    type: 'timing',
                    duration: 2000,
                    easing: Easing.out(Easing.ease),
                    // delay: index * 400,
                    loop: true,
                }}
                // key={index}
                style={styles.circular}
            />
        );
    }


    return(
    <View flex={1}>
        <HStack alignitems={"center"} justifyContent={"flex-start"} bgColor={"white"} padding={5}>
            <TouchableOpacity activeOpacity={0.8} onPress={() => {navigation.goBack()}}>
                <Ionicons name={"arrow-back"} color={'#222222'} size={25} />
            </TouchableOpacity>
            <Text bold fontSize={18} marginLeft={3}>디바이스 등록하기</Text>
        </HStack>

        <VStack flex={1} justifyContent={"space-between"} bg={"white"}>
            <Center flex={0.72} overflow={"hidden"} py={3}>
                    {/*<ImageBackground source={backgroundImage} resizeMode={'cover'} alt={"Background Image"}*/}
                    {/*style={{justifyContent: "center", height: 800}}>*/}
                    {/*    <Image source={deviceImage} alt={"Device Image"} />*/}
                    {/*</ImageBackground>*/}

                {/*<Box width={250} height={250} borderRadius={125} bg={"blue.300"} position={"absolute"} />*/}
                <WaveAnimation />
                    <Image source={deviceImage} alt={"Device Image"} position={"relative"}/>

            </Center>
            <VStack flex={0.28} py={3} justifyContent={"space-between"} alignItems={"center"}>
                <VStack justifyContent={'center'} alignItems={'center'} space={2}>
                    <Text fontSize={17} bold>주변에 있는 디바이스를 찾아드릴게요.</Text>
                    <Text fontSize={14}>블루투스를 이용해서 찾아드릴게요.</Text>
                </VStack>
                <Button onPress={handleSearch} width={"92%"} marginBottom={2} bg={"#2785F4"} size={"lg"}>
                    <Text fontWeight={"bold"} color={"white"} fontSize={18}>검색</Text>
                </Button>
            </VStack>

        </VStack>


    </View>
)
};

export default EnrollingDeviceView;


const styles = StyleSheet.create({
    circular: {
        width: 250, height: 250, borderRadius: 125, bg: "blue.300", position: "absolute"
    },
});
