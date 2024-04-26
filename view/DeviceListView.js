import React, {useState} from "react";
import {Box, Button, Center, HStack, Image, Pressable, Text, useDisclose, View, VStack} from "native-base";
import {TouchableOpacity} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import deviceImagewithBlueBack from "./images/DevaiceImagewithBlue.png";
import AntDesign from "react-native-vector-icons/AntDesign";
import DeviceListActionSheet from "./components/DeviceListActionSheet";
import {updateDevice, deleteDevice, getDevices} from "../data/RealmDatabase";
import {useDispatch, useSelector} from "react-redux";
import {useBLE} from "./module/BLEProvider";
import {fetchDevices, setConnectDevice, setConnectionStatus} from "../data/store";
import {Paragraph} from "react-native-paper";
import moment from "moment";

const DeviceListView = ({navigation}) => {
    const {isOpen, onOpen, onClose} = useDisclose();
    const [selectedDevice, setSelectedDevice] = useState();

    const deviceImageBlueBack = require('./images/DevaiceImagewithBlue.png')

    const devices = getDevices();

// devices 배열을 매핑하여 각 디바이스의 id와 name 값을 추출합니다.
    const deviceList = devices.map(device => ({
        id: device.id,
        name: device.name
    }));

// deviceList 배열에는 모든 디바이스의 id와 name이 포함됩니다.

// 예를 들어, 첫 번째 디바이스의 id와 name을 가져오려면 다음과 같이 할 수 있습니다.
    const device = deviceList[0];


    // Redux store에서 디바이스 정보 가져오기
    const connectDevice = useSelector(state => state.device.connectDevice);
    const dispatch = useDispatch();
    const {connectAndSubscribe, disconnect} = useBLE();
    console.log("connectDevice info :", connectDevice);
    console.log("device info id :", device.id)
    console.log("device info name :", device.name)

    const handleDeviceConnect = async () => {
        console.log("Device Connect", device.id);

        try {
            if (await connectAndSubscribe(device.id)) {
                updateDevice(device.id, true);
                dispatch(setConnectDevice(device.id));
                dispatch(setConnectionStatus(true));
            }
        } catch (e) {
            // TODO: 상용화에서는 에러 처리를 구현해야 함.
        }
    }

    // const handleCancelConnect = () => {
    //     console.log("연결해제 버튼 클릭 됌.")
    // };
    //
    // const deviceData = [{
    //     name: "kim's device",
    //     date: "2024/01/11",
    //     connectState: true,
    // }, {
    //     name: "lee's device",
    //     date: "2024/01/10",
    //     connectState: false,
    // }
    // ];

    const handleDeviceDisconnect = async (device) => {
        console.log("Device Disconnect", device.id);

        if (connectDevice === "") {
            updateDevice(device.id, false);
            dispatch(setConnectDevice(""));
            dispatch(setConnectionStatus(false));
            return;
        }

        if (await disconnect()) {
            updateDevice(device.id, false);
            dispatch(setConnectDevice(""));
            dispatch(setConnectionStatus(false));
        }
    }

    const handleDeviceDelete = async (dev) => {
        console.log("블루투스 기기 등록 삭제.")
        deleteDevice(dev.id);
        dispatch(fetchDevices());
    }


    const handleOnOpen = (device) => {
        console.log("actionsheet open")
        onOpen();
    };


    const ConnectedDevice = () => {
        console.log("등록된 블루투스 기기 재연결")
        return (connectDevice === device.id ? <VStack space={2}>
            <Paragraph>연결된 디바이스</Paragraph>
            <HStack space={1} justifyContent={"space-around"} fullWidth={true}>
                <Button flex={1} disabled backgroundColor={'black'}>연결됨</Button>
                <Button onPress={handleDeviceDisconnect} backgroundColor={'red.800'}>연결해제</Button>
            </HStack>
        </VStack> : <VStack space={2}>
            <Paragraph>연결되지 않은 디바이스</Paragraph>
            <HStack space={1} justifyContent={"space-around"} fullWidth={true}>
                <Button flex={1} disabled backgroundColor={'gray.100'}></Button>
                <Button onPress={handleDeviceDelete}>삭제하기2</Button>
            </HStack>
        </VStack>);
    }

    const DisconnectedDevice = () => {
        console.log("등록된 블루투스 기기 연결해제")
        return (<VStack space={2}>
            <Paragraph>연결되지 않은 디바이스</Paragraph>
            <HStack space={1} justifyContent={"space-around"} fullWidth={true}>
                <Button flex={1} onPress={handleDeviceConnect}>연결하기</Button>
                <Button onPress={handleDeviceDelete} backgroundColor={'red.800'}>삭제하기</Button>
            </HStack>
        </VStack>);
    }

    // let momentDate = moment(device.createdAt);
    let momentDate = device ? moment(device?.createdAt) : moment();



    return(
        <View flex={1}>
            <HStack alignitems={"center"} justifyContent={"flex-start"} bgColor={"white"} padding={5}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => {navigation.goBack()}}>
                    <Ionicons name={"arrow-back"} color={'#222222'} size={25} />
                </TouchableOpacity>
                <Text bold fontSize={18} marginLeft={3}>디바이스 목록</Text>
            </HStack>

            <VStack flex={1} margin={5} space={4}>
                {/*{deviceData.map((device, index) => (*/}
                {/*<HStack backgroundColor={"white"} p={4} shadow={2} justifyContent={"space-between"} alignItems={"center"}>*/}
                {/*    <VStack space={6} justifyContent={"space-between"} pb={1}>*/}
                {/*        <VStack space={1.5} pt={1}>*/}
                {/*        <Text fontSize={16} fontWeight={"bold"}>{device.name}</Text>*/}
                {/*        <HStack space={2} alignItems={"center"}>*/}
                {/*            <Text color={"#ADADAD"} fontSize={12}>등록 날짜</Text>*/}
                {/*            <Box borderWidth={0.5} height={2} borderColor={"#ADADAD"} />*/}
                {/*            <Text color={'#ADADAD'} fontSize={12}>{device.date}</Text>*/}
                {/*        </HStack>*/}
                {/*        <HStack space={2} alignItems={"center"}>*/}
                {/*            <AntDesign name={device.connectState ? "checkcircle" : "exclamationcircle"} size={13} color={device.connectState ? "#3DC061" : "#EB5147"} />*/}
                {/*            <Text color={device.connectState ? "#3DC061" : "#EB5147"} fontSize={12}>{device.connectState ? "연결" : "연결 오류"}</Text>*/}
                {/*        </HStack>*/}
                {/*        </VStack>*/}
                {/*        <Pressable onPress={handleOnOpen} borderWidth={1} alignItems={"center"} justifyContent={"center"}*/}
                {/*                   borderRadius={3} width={81} borderColor={"#2785F4"} py={1.5}>*/}
                {/*            <Text color={"#2785F4"} fontSize={12}>연결 해제</Text>*/}
                {/*            <DeviceListActionSheet isOpen={isOpen} onOpen={onOpen} onClose={onClose} />*/}
                {/*        </Pressable>*/}
                {/*    </VStack>*/}
                {/*    <Box>*/}
                {/*        <Image source={deviceImageBlueBack} alt={"Device Image"}></Image>*/}
                {/*    </Box>*/}
                {/*</HStack>*/}
                {/*))}*/}

                <VStack justifyContent={'space-between'} backgroundColor={'white'} padding={2}>
                    <Paragraph>{device.name}</Paragraph>
                    <Paragraph>등록날짜 | {momentDate.format('YYYY-MM-DD')}</Paragraph>
                    {connectDevice === "" ? <DisconnectedDevice/> : <ConnectedDevice/>}
                </VStack>

            </VStack>
        </View>
    )
};

export default DeviceListView;