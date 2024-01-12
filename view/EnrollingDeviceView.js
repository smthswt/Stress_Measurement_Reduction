import React from "react";
import {Box, Button, Center, HStack, Image, Text, View, VStack} from "native-base";
import {ImageBackground, TouchableOpacity} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const EnrollingDeviceView = ({navigation}) => {

    const deviceImage = require("./images/RenstDevice.png");
    const backgroundImage = require('./images/RenstDeviceWithBack.png');
    
    const handleSearch = () => {
        console.log("검색 버튼 클릭")
        navigation.navigate("DeviceSettingScreens", {screen: "CompleteEnroll"})
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
            <VStack flex={0.8} alignItems={"center"} justifyContent={"flex-end"}>
                <View height={"95%"} justifyContent={"space-between"} alignItems={"center"} py={2}>
                <Center flex={0.9} justifyContent={"center"} alignItems={"center"} mt={5} bg={"red.100"}>
                    <ImageBackground source={backgroundImage} resizeMode={'cover'} alt={"Background Image"}
                    style={{flex: 1, justifyContent: "center", height: 800,}}>
                        <Image source={deviceImage} alt={"Device Image"} />
                    </ImageBackground>
                </Center>
                <VStack justifyContent={'center'} alignItems={'center'} space={2} flex={0.1}>
                    <Text fontSize={17} bold>주변에 있는 디바이스를 찾아드릴게요.</Text>
                    <Text fontSize={14}>블루투스를 이용해서 찾아드릴게요.</Text>
                </VStack>
                </View>
            </VStack>
            <VStack flex={0.2} mb={2} justifyContent={"flex-end"} alignItems={"center"}>
                <Button onPress={handleSearch} width={"92%"} marginBottom={2} bg={"#2785F4"} size={"lg"}>
                    <Text fontWeight={"bold"} color={"white"} fontSize={18}>검색</Text>
                </Button>
            </VStack>

        </VStack>


    </View>
)
};

export default EnrollingDeviceView;