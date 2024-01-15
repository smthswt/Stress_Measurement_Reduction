import React, {useRef, useState} from "react";
import {AlertDialog, Button, Center, HStack, Pressable, ScrollView, Text, View, VStack} from "native-base";
import {TouchableOpacity} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";


const CompleteSearchingDevice = ({navigation}) => {
    // const [isClick, setIsClick] = useState(false);
    // const [clickCount, setClickCount] = useState(0);
    const [clickStates, setClickStates] = useState({});
    const [isOpen, setIsOpen] = useState(false);

    const onClose = () => setIsOpen(false);
    const alertRef = useRef(null);

    const handleClickDevice = (name) => {
        console.log(`연결할 디바이스 선택함 - Name: ${name}`);
        setClickStates((prevClickStates) => ({
            ...prevClickStates,
            [name]: !prevClickStates[name],
        }));
    };
    console.log(clickStates);

    // const handleClickDevice = () => {
    //     console.log(`연결할 디바이스 선택함 - device name: ${name}`);
    //     // setIsClick(true);
    //     if (clickCount === 0) {
    //         setIsClick(true);
    //         setClickCount(1);
    //     } else {
    //         setClickCount(0);
    //         setIsClick(false)
    //     }
    // };
    // console.log(isClick);
    // console.log(clickCount)

    const handleEnroll = () => {
        console.log("등록하기")
        setIsOpen(true);
    };

    const  handleSearchAgain = () => {
        console.log("다시 검색하기 = 새로고침?")
    };

    const handleSubmit = () => {
        console.log("연결 확인")
        setIsOpen(false);
    };

    const data = [{
        name: "kim's device",
    }, {
        name: "lee's device",
    }, {
        name: "park's device",
    } , {
        name: "park's device",
    }
    ]

    return(
        <View flex={1}>
            <HStack alignitems={"center"} justifyContent={"flex-start"} bgColor={"white"} padding={5}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => {navigation.navigate("Device")}}>
                    <Ionicons name={"arrow-back"} color={'#222222'} size={25} />
                </TouchableOpacity>
                <Text bold fontSize={18} marginLeft={3}>디바이스 등록하기</Text>
            </HStack>

            <VStack flex={0.7}>
            <ScrollView bg={"white"}>
                <VStack space={4} margin={5} flex={0.7}>

                    {data.map((device, index) => (
                    <Pressable key={index} onPress={() => handleClickDevice((device.name))} flexDir={"row"}
                               borderColor={clickStates[device.name] ? "#3DC061" : "transparent"}
                               borderWidth={clickStates[device.name] ? 1 : 0}
                               bg={"white"} width={"100%"} p={3} shadow={2} justifyContent={"space-between"} alignItems={"center"}>
                        <Text fontWeight={600}>{device.name}</Text>
                        {clickStates[device.name] && <AntDesign name={"checkcircle"} size={16} color={"#3DC061"} /> }
                    </Pressable>

                        ))}

                </VStack>
            </ScrollView>
            </VStack>

                <Center flex={0.33} bg={"white"}>
                    <VStack flex={1} width={"92%"} justifyContent={"center"} alignItems={"center"} pb={3}>
                        <View flex={1} justifyContent={"center"} mb={1}>
                            <Text>{data.length}개의 디바이스가 확인되었습니다.</Text>
                        </View>
                        <View flex={1} width={"100%"} justifyContent={"flex-end"}>
                            <Button width={"100%"} bg={"#2785F4"} size={"lg"} onPress={handleEnroll}>
                                <Text fontWeight={700} color={"white"} fontSize={18}>등록하기</Text>
                            </Button>
                        </View>
                        <Center flex={1} mt={2} width={"100%"}>
                            <Button width={"100%"} my={1} variant={"outline"} borderColor={"#2785F4"}
                                    size={"lg"} onPress={handleSearchAgain}>
                                <Text fontWeight={700} color={"#2785F4"} fontSize={18}>다시 검색하기</Text>
                            </Button>
                        </Center>
                    </VStack>
                </Center>

            {/*블루투스 디바이스 등록 완료 다이얼로그*/}
            <AlertDialog leastDestructiveRef={alertRef} isOpen={isOpen} onClose={onClose}>
                <AlertDialog.Content p={2} width={"80%"}>
                    <VStack space={3} p={3} py={3}>
                        <Center>
                            <Ionicons name={'checkmark-circle-outline'} size={75} color={'#59BCFF'}/>
                        </Center>
                        <Center mt={2}>
                            <Text fontSize={18} fontWeight={'bold'}>
                                디바이스 연결이 되었습니다.
                            </Text>
                        </Center>
                        <Center mt={3}>
                        <Button onPress={handleSubmit} w={'95%'} bgColor={'#2785F4'}>
                            <Text fontSize={'md'} fontWeight={'bold'} color={'white'}>
                                확인
                            </Text>
                        </Button>
                        </Center>
                    </VStack>
                </AlertDialog.Content>
            </AlertDialog>

        </View>
    )
};

export default CompleteSearchingDevice;
