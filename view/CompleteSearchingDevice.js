import React, {useRef, useState} from "react";
import {AlertDialog, Button, Center, HStack, Pressable, ScrollView, Text, View, VStack} from "native-base";
import {RefreshControl, TouchableOpacity} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import {useBLE} from "./module/BLEProvider";
import {useDispatch} from "react-redux";
import {addDevice, getDeviceById} from "../data/RealmDatabase";
import {setConnectDevice, setConnectionStatus} from "../data/store";
// import moment from "moment/moment";
import moment from "moment";
import {Paragraph} from "react-native-paper";
import {DeviceItem} from "./components/DeviceItem";
import DeviceListView from "./DeviceListView";


const CompleteSearchingDevice = ({navigation, route}) => {
    const [clickStates, setClickStates] = useState({});
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, SetIsLoading] = useState(false);
    const [refreshing, setRefreshing] = React.useState(false);
    const devices = route.params.devices; // Accessing devices from route params

    // 클릭된 디바이스의 정보를 저장하는 상태 변수
    const [selectedDevice, setSelectedDevice] = useState(null);

    const onClose = () => setIsOpen(false);
    const alertRef = useRef(null);


    const {connectAndSubscribe} = useBLE();
    const dispatch = useDispatch();

    const messageRef = useRef(null);
    const [isMessageOpen, setIsMessageOpen] = React.useState(false);


    const handleClickDevice = (name, id) => {
        console.log(`연결할 디바이스 선택함 - Name: ${name}`);
        setSelectedDevice({ name, id });
        setClickStates((prevClickStates) => ({
            ...prevClickStates,
            [name]: !prevClickStates[name],
        }));
        console.log("click 상태: ", clickStates);
    };


    // 등록하기 버튼을 눌렀을 때 호출되는 함수
    const handleEnroll = () => {
        console.log("등록하기");
        if (selectedDevice) {
            // 선택된 디바이스 정보를 이용하여 연결 시도
            handleDeviceConnect(selectedDevice.id, selectedDevice.name);
        }
    };


    const handleDeviceConnect = async (id, name) => {
        console.log(`handleDeviceConnect: ${id}, name=${name}`);

        try {
            // handle device connect logic here
            let success = await connectAndSubscribe(id);
            if (success) {
                let now = moment();
                console.log(now);

                if (!getDeviceById(id))
                    addDevice(id, name, now.toDate(), true);
                console.log("Adding new device:", id, name)
                // addDevice({id: id, name: name, registrationDate: now.toDate(), isConnected: true});

                dispatch(setConnectDevice(id));
                dispatch(setConnectionStatus(true));
                setIsMessageOpen(true);

                console.log("블루투스 기기 등록 완료")
                setIsOpen(true);
            }
        } catch (e) {
            console.error("Error connecting to device: ", e);
        }
    }

    /**
     * Handles the successful connection event.
     *
     * This method logs the message "handleConnectOk" to the console
     * and sets the isMessageOpen flag to false.
     *
     * @return {void} No return value.
     */
    const handleConnectOk = () => {
        console.log("handleConnectOk");
        setIsMessageOpen(false);

        navigation.goBack();
    }



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

    // const handleEnroll = () => {
    //     console.log("등록하기")
    //     setIsOpen(true);
    // };

    //이건 빼자
    const  handleSearchAgain = () => {
        console.log("다시 검색하기 = 새로고침")
        onRefresh();

    };

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);



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
    },
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
            <ScrollView bg={"white"}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
            >
                <VStack space={4} marginY={5} flex={0.7} justifyContent={'center'} alignItems={'center'}>

                    {
                        devices != null &&
                        devices.length > 0 &&
                        devices.map(device => (
                    <Pressable key={device.name} name={device.name} id={device.id} onPress={() => handleClickDevice(device.name, device.id)} flexDir={"row"}
                               borderColor={clickStates[device.name] ? "#3DC061" : "transparent"}
                               borderWidth={clickStates[device.name] ? 1 : 0}
                               bg={"white"} width={"92%"}  p={3} shadow={3} justifyContent={"space-between"} alignItems={"center"}>

                        {/*RENST : 08:D1:F9:D7:83:26*/}
                        <Text fontWeight={600}>{device.name} : {device.id}</Text>

                        {clickStates[device.name] && <AntDesign name={"checkcircle"} size={16} color={"#3DC061"} /> }
                    </Pressable>

                        ))}

                    {/*<VStack space={3}>*/}
                    {/*    {*/}
                    {/*        devices != null &&*/}
                    {/*        devices.length > 0 &&*/}
                    {/*        devices.map(device => (*/}
                    {/*            <DeviceItem key={device.id} name={device.name} id={device.id}*/}
                    {/*                        onConnect={handleDeviceConnect}/>*/}
                    {/*        ))*/}
                    {/*    }*/}
                    {/*</VStack>*/}


                </VStack>


            </ScrollView>
            </VStack>

            {/*/!*블루투스 기기 연결 알람*!/*/}
            {/*<AlertDialog leastDestructiveRef={messageRef} isOpen={isMessageOpen}>*/}
            {/*    <AlertDialog.Content p={"2%"}>*/}
            {/*        <AlertDialog.Body>*/}
            {/*            디바이스 연결이 되었습니다.*/}
            {/*        </AlertDialog.Body>*/}
            {/*        <Center mt={3} mb={3}>*/}
            {/*            <Button colorScheme="danger" onPress={handleConnectOk} width={"80%"}>*/}
            {/*                확인*/}
            {/*            </Button>*/}
            {/*        </Center>*/}
            {/*    </AlertDialog.Content>*/}
            {/*</AlertDialog>*/}

                <Center flex={0.33} bg={"white"}>
                    <VStack flex={1} width={"92%"} justifyContent={"center"} alignItems={"center"} pb={3}>
                        <View flex={1} justifyContent={"center"} mb={1}>
                            {/*<Text>{data.length}개의 디바이스가 확인되었습니다.</Text>*/}
                            <Paragraph>{devices != null ? devices.length : 0}개의 디바이스가 확인되었습니다.</Paragraph>
                        </View>

                        <View flex={1} width={"100%"} justifyContent={"flex-end"}>
                            <Button width={"100%"} bg={"#2785F4"} size={"lg"}
                                    onPress={handleEnroll}>
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
                        <Button onPress={handleConnectOk} w={'95%'} bgColor={'#2785F4'}>
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
