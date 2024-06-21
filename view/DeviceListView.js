import React, {useContext, useEffect, useState} from "react";
import {Box, Button, Center, HStack, Image, Pressable, Text, useDisclose, View, VStack} from "native-base";
import {TouchableOpacity} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import deviceImagewithBlueBack from "./images/DevaiceImagewithBlue.png";
import AntDesign from "react-native-vector-icons/AntDesign";
import DeviceListActionSheet from "./components/DeviceListActionSheet";
import {useDispatch, useSelector} from "react-redux";
import {useBLE} from "./module/BLEProvider";
import {fetchDevices, setConnectDevice, setConnectionStatus} from "../data/store";
import {Paragraph} from "react-native-paper";
import moment from "moment";
import firestore from "@react-native-firebase/firestore";
import {UserContext} from "./module/UserProvider";

const DeviceListView = ({navigation}) => {
    const {isOpen, onOpen, onClose} = useDisclose();
    const [device, setDevice] = useState();
    const [deviceData, setDeviceData] = useState([])
    const [dataLoaded, setDataLoaded] = useState(false);

    // Redux store에서 디바이스 정보 가져오기
    const connectDevice = useSelector(state => state.device.connectDevice);
    const connectedStatus = useSelector(state => state.device.isConnected);
    const dispatch = useDispatch();
    const {connectAndSubscribe, disconnect} = useBLE();
    console.log("----------------")
    // console.log("connectDevice info :", connectDevice);
    // console.log("device connection info id :", connectedStatus)

    const deviceImageBlueBack = require('./images/DevaiceImagewithBlue.png')

    const {userId} = useContext(UserContext)


    const [isConnected, setIsConnected] = useState(false)
    const [bleDocuments, setBleDocuments] = useState([]);
    const [bleSnapshotSize, setBleSnapshotSize] = useState(0);

    const fetchBleData = async () => {
        try {
            const userRef = firestore().collection("Users").doc(userId);
            const bleRef = userRef.collection("Ble_Devices");

            // Ble_Device 컬렉션에서 문서 가져오기
            const bleSnapshot = await bleRef.get();
            const bleDocs = [];

            bleSnapshot.forEach(doc => {
                const data = doc.data();
                bleDocs.push({ id: data.id, isConnect: data.isConnect, date: data.registrationDate });
            });

            setBleDocuments(bleDocs);
            setBleSnapshotSize(bleSnapshot.size);

            console.log("bleSnapshot size:", bleSnapshot.size);
            console.log("장치 목록:", bleDocs);

        } catch (error) {
            console.error("Error fetching data from Firestore:", error);
        } finally {
            setDataLoaded(true); // 데이터 로딩 완료
        }
    };

    useEffect(() => {
        fetchBleData();

        const userRef = firestore().collection("Users").doc(userId);
        const bleRef = userRef.collection("Ble_Devices");
        const unsubscribe = bleRef.onSnapshot(snapshot => {
            const devicesData = snapshot.docs.map(doc => doc.data());
            console.log("Device list (real-time):", devicesData);
            setDeviceData(devicesData);
        });

        // Cleanup 함수로 사용자 구독 해제
        return () => unsubscribe();
    }, []);

    useEffect(() => {
            // 디바이스가 있고, isConnect 상태가 true면, setIsConnected true 아니면 디폴트, else return null
            if (bleDocuments.length > 0 && bleDocuments[0].isConnect === true) {
                dispatch(setConnectionStatus(true));
                setIsConnected(true);
                console.log("BLE 등록 있음, isConnect 상태 true");
            } else if (bleDocuments.length > 0 && bleDocuments[0].isConnect === false) {
                dispatch(setConnectionStatus(false));
                setIsConnected(false);
                console.log("BLE 등록 있음, isConnect 상태 false");
            } else if (bleDocuments.length === 0) {
                console.log("BLE 없음.");
            }
    }, [dataLoaded]);



    const handleDeviceConnect = async () => {
        if (!bleDocuments) return; // device가 null인 경우 처리

        console.log("handleDeviceConnect", bleDocuments[0].id);

        const userRef = firestore().collection("Users").doc(userId);
        const deviceRef = userRef.collection("Ble_Devices").where("id", "==", bleDocuments[0].id)
            .where("isConnect", "==", false);
        const deviceSnapshot = await deviceRef.get();

        try {
            if (await connectAndSubscribe(bleDocuments[0].id)) {
                deviceSnapshot.forEach(async (doc) => {
                    await doc.ref.update({
                        isConnect: true,
                    });
                });
                console.log("Dispatching setConnectDevice and setConnectionStatus");
                dispatch(setConnectDevice(bleDocuments[0].id));
                dispatch(setConnectionStatus(true));
                setIsConnected(true);

                console.log("connectDevice info:", connectDevice);
                console.log("device connection info id:", connectedStatus);
                console.log("연결 상태로 업데이트");
            }
        } catch (e) {
            console.error("Error connecting to device:", e);
        }
    };


    const handleDeviceDisconnect = async () => {
        if (!bleDocuments) return; // device가 null인 경우 처리


        const deviceId = bleDocuments[0].id;
        console.log("handleDeviceDisconnect", deviceId);

        const userRef = firestore().collection("Users").doc(userId);
        const deviceRef = userRef.collection("Ble_Devices").where("id", "==", deviceId).where("isConnect", "==", true);
        const deviceSnapshot = await deviceRef.get();

        // Check if the device is the connected device
        const isConnectedDevice = connectDevice === deviceId;

        try {
            console.log("Attempting to disconnect from device", deviceId);
            const disconnectResult = await disconnect();
            console.log("disconnect result:", disconnectResult);

            if (disconnectResult) {
                console.log("Device disconnected successfully");

                deviceSnapshot.forEach(async (doc) => {
                    await doc.ref.update({
                        isConnect: false,
                    });
                });

                dispatch(setConnectDevice(""));
                dispatch(setConnectionStatus(false));
                setIsConnected(false);

                console.log("connectDevice info after disconnect:", connectDevice);
                console.log("device connection info id after disconnect:", connectedStatus);
                console.log("연결 해제 상태");
            } else {
                console.log("Failed to disconnect from device");
            }
        } catch (error) {
            console.error("Error disconnecting from device:", error);
        }
    };

    const handleDeviceDelete = async () => {
        //추후에 선택에 따른 기기만 삭제하게 세부 구현 필요, 테스트할 기기가 없음
        if (!bleDocuments) return; // device가 null인 경우 처리

        console.log("블루투스 기기 등록 삭제중...");
        const userRef = firestore().collection("Users").doc(userId);
        const devicesSnapshot = userRef.collection("Ble_Devices");
        const querySnapshot = await devicesSnapshot.where("id", "==", bleDocuments[0].id).get();

        querySnapshot.forEach(doc => {
            doc.ref.delete();
            console.log("선택된 기기 등록 삭제");

            //redux 최신 상태로 업데이트
            dispatch(setConnectDevice(""));
            dispatch(setConnectionStatus(false));
            dispatch(fetchDevices(userId));

            console.log("connectDevice info :", connectDevice);
            console.log("device connection info id :", connectedStatus)
        });
    };


    const handleOnOpen = () => {
        console.log("actionsheet open")
        onOpen();
    };


    const ConnectedDevice = () => {
        if (!bleDocuments) return null; // device가 null인 경우 처리

        console.log("연결 상태로 블루투스 기기 목록 상태");
        // return connectDevice === bleDocuments[0].id ? (
        return (
            <Pressable onPress={handleDeviceDisconnect} borderWidth={1} alignItems={"center"} justifyContent={"center"}
                       borderRadius={3} width={81} borderColor={"#2785F4"} py={1.5}>
                <Text color={"#2785F4"} fontSize={12}>연결 해제</Text>
                {/*<DeviceListActionSheet isOpen={isOpen} onOpen={onOpen} onClose={onClose}/>*/}
            </Pressable>
        // ) : (
        //     // <VStack space={2}>
        //     //     <Paragraph>연결되지 않은 디바이스</Paragraph>
        //     //     <HStack space={1} justifyContent={"space-around"} fullWidth={true}>
        //     //         <Button flex={1} disabled backgroundColor={"gray.100"}></Button>
        //     //         <Button onPress={handleDeviceDelete}>삭제하기</Button>
        //     //     </HStack>
        //     // </VStack>
        //     null
        // );
        );
    };

    const DisconnectedDevice = () => {
        if (!bleDocuments) return null; // device가 null인 경우 처리

        console.log("블루투스 기기 연결해제 상태");
        return (
            <HStack space={2}>
                <Pressable onPress={handleDeviceConnect} borderWidth={1} alignItems={"center"} justifyContent={"center"}
                           borderRadius={3} width={81} borderColor={"#2785F4"} py={1.5}>
                    <Text color={"#2785F4"} fontSize={12}>연결 하기</Text>
                    {/*<DeviceListActionSheet isOpen={isOpen} onOpen={onOpen} onClose={onClose}/>*/}
                </Pressable>
                <Pressable onPress={handleOnOpen} borderWidth={1} alignItems={"center"} justifyContent={"center"}
                           borderRadius={3} width={81} borderColor={"red.700"} backgroundColor={"red.700"} py={1.5}>
                    <Text color={"white"} fontSize={12}>삭제하기</Text>
                    <DeviceListActionSheet isOpen={isOpen} onOpen={onOpen} onClose={onClose} handleDeviceDelete={handleDeviceDelete}/>
                </Pressable>
            </HStack>
        );
    };

    // let momentDate = moment(device.createdAt);
    let momentDate = device ? moment(bleDocuments[0].date) : moment();


    return(
        <View flex={1}>
            <HStack alignitems={"center"} justifyContent={"flex-start"} bgColor={"white"} padding={5}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => {navigation.goBack()}}>
                    <Ionicons name={"arrow-back"} color={'#222222'} size={25} />
                </TouchableOpacity>
                <Text bold fontSize={18} marginLeft={3}>디바이스 목록</Text>
            </HStack>

            <VStack flex={1} margin={5} space={4}>
                {deviceData.map((device, index) => (
                <HStack backgroundColor={"white"} p={4} shadow={2} justifyContent={"space-between"} alignItems={"center"}>
                    <VStack space={6} justifyContent={"space-between"} pb={1}>
                        <VStack space={1.5} pt={1}>
                        <Text fontSize={16} fontWeight={"bold"}>{device.name}</Text>
                        <HStack space={2} alignItems={"center"}>
                            <Text color={"#ADADAD"} fontSize={12}>등록 날짜</Text>
                            <Box borderWidth={0.5} height={2} borderColor={"#ADADAD"} />
                            <Text color={'#ADADAD'} fontSize={12}>{momentDate.format('YYYY/MM/DD')}</Text>
                        </HStack>

                            <HStack space={2} alignItems={"center"}>
                                <AntDesign name={isConnected ? "checkcircle" : "exclamationcircle"} size={13} color={isConnected ? "#3DC061" : "#EB5147"} />
                                <Text color={isConnected ? "#3DC061" : "#EB5147"} fontSize={12}>{isConnected ? "연결" : "연결 해제"}</Text>
                            </HStack>
                        </VStack>

                        {isConnected ?  <ConnectedDevice/> : <DisconnectedDevice/>}
                        
                    </VStack>
                    <Box>
                        <Image source={deviceImageBlueBack} alt={"Device Image"}></Image>
                    </Box>
                </HStack>
                ))}

                {/*// 테스트 용 */}
                {/*<VStack justifyContent={'space-between'} backgroundColor={'white'} padding={2}>*/}
                {/*    {device ? (*/}
                {/*        <>*/}
                {/*            <Paragraph>{device.name}</Paragraph>*/}
                {/*            <Paragraph>등록날짜 | {momentDate.format('YYYY-MM-DD')}</Paragraph>*/}
                {/*            {connectDevice === "" ? <DisconnectedDevice/> : <ConnectedDevice/>}*/}
                {/*        </>*/}
                {/*    ) : (*/}
                {/*        <Text>등록된 디바이스가 없습니다.</Text>*/}
                {/*    )}*/}
                {/*</VStack>*/}

            </VStack>
        </View>
    )
};

export default DeviceListView;