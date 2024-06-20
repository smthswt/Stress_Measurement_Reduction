import {Actionsheet, Box, Button, HStack, Pressable, Text, useDisclose, View, VStack} from "native-base";
import React, {useContext, useEffect, useState} from "react";
import firestore from "@react-native-firebase/firestore";
import {fetchDevices} from "../../data/store";
import {UserContext} from "../module/UserProvider";
import {useDispatch, useSelector} from "react-redux";
import {useBLE} from "../module/BLEProvider";


const DeviceListActionSheet  = ({onOpen, onClose, isOpen, handleDeviceDelete}) => {
    const [device, setDevice] = useState(null);
    const [deviceData, setDeviceData] = useState([])
    // Redux store에서 디바이스 정보 가져오기
    const connectDevice = useSelector(state => state.device.connectDevice);
    const connectedStatus = useSelector(state => state.device.isConnected);
    const {userId} = useContext(UserContext)

    // const handleCancelConnection = () => {
    //     console.log("등록된 디바이스가 삭제되었습니다")
    //     onClose();
    // };

    const handleOnClose = () => {
        console.log("actionsheet close")
        onClose();
    };

    // useEffect(() => {
    //     const userRef = firestore().collection("Users").doc(userId);
    //     const unsubscribe = userRef.collection("Ble_Devices").onSnapshot(snapshot => {
    //         const devicesData = snapshot.docs.map(doc => doc.data());
    //         console.log("devicelist :", devicesData);
    //         setDeviceData(devicesData);
    //
    //         // 데이터를 가져온 후에 device 변수 설정
    //         const deviceList = devicesData.map(device => ({
    //             id: device.id,
    //             name: device.name
    //         }));
    //
    //         const selectedDevice = deviceList.length > 0 ? deviceList[0] : null;
    //         setDevice(selectedDevice);
    //     });
    //
    //     return () => {
    //         unsubscribe(); // Cleanup 함수로 사용자 구독 해제
    //     };
    // }, []);


    const dispatch = useDispatch();
    const {connectAndSubscribe, disconnect} = useBLE();
    // console.log("connectDevice info :", connectDevice);
    // console.log("device info id :", device?.id)

    // const handleDeviceDelete = async (dev) => {
    //     //선택에 따른 기기만 삭제하게 세부 구현 필요
    //     if (!device) return; // device가 null인 경우 처리
    //
    //     console.log("블루투스 기기 등록 삭제중...");
    //     const userRef = firestore().collection("Users").doc(userId);
    //     const devicesSnapshot = userRef.collection("Ble_Devices");
    //     const querySnapshot = await devicesSnapshot.where("id", "==", device.id).get();
    //
    //     querySnapshot.forEach(doc => {
    //         doc.ref.delete();
    //         console.log("선택된 기기 등록 삭제");
    //
    //         //redux 최신 상태로 업데이트
    //         dispatch(fetchDevices());
    //     });
    // };

    return(

        <Actionsheet isOpen={isOpen} onClose={handleOnClose} hideDragIndicator>

            <Actionsheet.Content paddingBottom={5} paddingTop={4} justifyContent={"center"} alignItems={"center"} >
                <VStack w="100%" h={60} px={4} justifyContent="center" alignItems={"center"}>
                    <Text fontSize={18} color="black" fontWeight={"bold"} lineHeight={32}>
                        디바이스 등록을
                    </Text>
                    <Text fontSize={18} color="black" fontWeight={"bold"}>
                        삭제하시겠습니까?
                    </Text>
                </VStack>

                <Box marginY={6}>
                <Text color={"#EB5147"} fontSize={16}>삭제 이후 복원이 불가능합니다.</Text>
                </Box>
                
                {/*<Actionsheet.Item onPress={handleCancelConnection}>연결해제</Actionsheet.Item>*/}
                <Box width={"92%"} mb={2} mt={2}>
                    <Button onPress={handleDeviceDelete} bg={"#2785F4"} size={"lg"}>
                        <Text fontWeight={"bold"} color={"white"} fontSize={18}>삭제 하기</Text>
                    </Button>
                </Box>


            </Actionsheet.Content>

        </Actionsheet>
    )
};

export default DeviceListActionSheet;

