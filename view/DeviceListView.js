import React, {useContext, useEffect, useState} from "react";
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
import firestore from "@react-native-firebase/firestore";
import {UserContext} from "./module/UserProvider";

const DeviceListView = ({navigation}) => {
    const {isOpen, onOpen, onClose} = useDisclose();
    const [device, setDevice] = useState(null);
    const [deviceData, setDeviceData] = useState([])

    const deviceImageBlueBack = require('./images/DevaiceImagewithBlue.png')

    const {userId} = useContext(UserContext)


    useEffect(() => {
        const userRef = firestore().collection("Users").doc(userId);
        const unsubscribe = userRef.collection("Ble_Devices").onSnapshot(snapshot => {
            const devicesData = snapshot.docs.map(doc => doc.data());
            console.log("devicelist :", devicesData);
            setDeviceData(devicesData);

            // 데이터를 가져온 후에 device 변수 설정
            const deviceList = devicesData.map(device => ({
                id: device.id,
                name: device.name
            }));

            const selectedDevice = deviceList.length > 0 ? deviceList[0] : null;
            setDevice(selectedDevice);
        });

        return () => {
            unsubscribe(); // Cleanup 함수로 사용자 구독 해제
        };
    }, []);




    console.log("deviceData :", device)


    // const devices = getDevices();



    // Redux store에서 디바이스 정보 가져오기
    const connectDevice = useSelector(state => state.device.connectDevice);
    const dispatch = useDispatch();
    const {connectAndSubscribe, disconnect} = useBLE();
    console.log("connectDevice info :", connectDevice);
    console.log("device info id :", device?.id)

    const handleDeviceConnect = async () => {
        if (!device) return; // device가 null인 경우 처리

        console.log("Device Connect", device.id);

        const userRef = firestore().collection("Users").doc(userId);
        const deviceRef = userRef.collection("Ble_Devices").where("id", "==", device.id);
        const deviceSnapshot  = await deviceRef.get()

        try {
            if (await connectAndSubscribe(device.id)) {
                // updateDevice(device.id, true);
                deviceSnapshot.forEach(async (doc) => {
                    await doc.ref.update({
                        isConnect: true,
                    });
                });
                dispatch(setConnectDevice(device.id));
                dispatch(setConnectionStatus(true));
            }
        } catch (e) {
            // TODO: 상용화에서는 에러 처리를 구현해야 함.
        }
    };


    const handleDeviceDisconnect = async () => {
        if (!device) return; // device가 null인 경우 처리

        console.log("Device Disconnect", device.id);

        const userRef = firestore().collection("Users").doc(userId);
        const deviceRef = userRef.collection("Ble_Devices").where("id", "==", device.id);
        const deviceSnapshot  = await deviceRef.get()

        if (deviceSnapshot.empty) {
            console.log("해당 기기를 찾을 수 없습니다.");
            return;
        }

        if (connectDevice === "") {
            deviceSnapshot.forEach(async (doc) => {
                await doc.ref.update({
                    isConnect: false,
                });
            });
            dispatch(setConnectDevice(""));
            dispatch(setConnectionStatus(false));
            return;
        }

        if (await disconnect()) {
            deviceSnapshot.forEach(async (doc) => {
                await doc.ref.update({
                    isConnect: false,
                });
            });

        // // 모든 문서 업데이트 작업을 위한 Promise 배열 생성
        // const updatePromises = [];
        // deviceSnapshot.forEach((doc) => {
        //     const updatePromise = doc.ref.update({
        //         isConnect: false,
        //     });
        //     updatePromises.push(updatePromise);
        // });
        //
        // // 모든 업데이트 작업이 완료될 때까지 기다림
        // await Promise.all(updatePromises);

            dispatch(setConnectDevice(""));
            dispatch(setConnectionStatus(false));
        }
    };

    const handleDeviceDelete = async (dev) => {
        //선택에 따른 기기만 삭제하게 세부 구현 필요
        if (!device) return; // device가 null인 경우 처리

        console.log("블루투스 기기 등록 삭제중...");
        const userRef = firestore().collection("Users").doc(userId);
        const devicesSnapshot = userRef.collection("Ble_Devices");
        const querySnapshot = await devicesSnapshot.where("id", "==", device.id).get();

        querySnapshot.forEach(doc => {
            doc.ref.delete();
            console.log("선택된 기기 등록 삭제");

            //redux 최신 상태로 업데이트
            dispatch(fetchDevices());
        });
    };


    const handleOnOpen = (device) => {
        console.log("actionsheet open")
        onOpen();
    };


    const ConnectedDevice = () => {
        if (!device) return null; // device가 null인 경우 처리

        console.log("등록된 블루투스 기기 목록");
        return connectDevice === device.id ? (
            <VStack space={2}>
                <Paragraph>연결된 디바이스</Paragraph>
                <HStack space={1} justifyContent={"space-around"} fullWidth={true}>
                    <Button flex={1} disabled backgroundColor={"black"}>
                        연결됨
                    </Button>
                    <Button onPress={handleDeviceDisconnect} backgroundColor={"red.800"}>
                        연결해제
                    </Button>
                </HStack>
            </VStack>
        ) : (
            <VStack space={2}>
                <Paragraph>연결되지 않은 디바이스</Paragraph>
                <HStack space={1} justifyContent={"space-around"} fullWidth={true}>
                    <Button flex={1} disabled backgroundColor={"gray.100"}></Button>
                    <Button onPress={handleDeviceDelete}>삭제하기</Button>
                </HStack>
            </VStack>
        );
    };

    const DisconnectedDevice = () => {
        if (!device) return null; // device가 null인 경우 처리

        console.log("등록된 블루투스 기기 연결해제");
        return (
            <VStack space={2}>
                <Paragraph>연결되지 않은 디바이스</Paragraph>
                <HStack space={1} justifyContent={"space-around"} fullWidth={true}>
                    <Button flex={1} onPress={handleDeviceConnect}>
                        연결하기
                    </Button>
                    <Button onPress={handleDeviceDelete} backgroundColor={"red.800"}>
                        삭제하기
                    </Button>
                </HStack>
            </VStack>
        );
    };

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
                    {device ? (
                        <>
                            <Paragraph>{device.name}</Paragraph>
                            <Paragraph>등록날짜 | {momentDate.format('YYYY-MM-DD')}</Paragraph>
                            {connectDevice === "" ? <DisconnectedDevice/> : <ConnectedDevice/>}
                        </>
                    ) : (
                        <Text>등록된 디바이스가 없습니다.</Text>
                    )}
                </VStack>

            </VStack>
        </View>
    )
};

export default DeviceListView;