import {Buffer} from 'buffer';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {BleManager} from 'react-native-ble-plx';

const DEVICE_ID = 'ESP32_BLE';
const SERVICE_UUID = 'b3a4529f-acc1-4f4e-949b-b4b7a2376f4f';
const CHARACTERISTIC_UUID = 'ed890871-07e9-4967-81b1-22ce3df7728e';

export const BLEContext = createContext();

export const useBLE = () => useContext(BLEContext);

const manager = new BleManager();

export const BLEProvider = ({children}) => {
    const [connectedDevice, setConnectedDevice] = useState(null);
    const [receivedData, setReceivedData] = useState(""); // 수신된 데이터를 저장할 상태
    const [devices, setDevices] = useState([]); // 발견된 장치들의 목록

    const [isScanning, setIsScanning] = useState(false);
    const [isConnected, setIsConnected] = useState(false);

    let accumulatedData = '';
    let subscription;

    useEffect(() => {
        console.log("BLEProvider Connected device changed:", connectedDevice);
        // 컴포넌트 언마운트 시 실행될 로직
        return () => {
            setReceivedData(''); // 상태 초기화
        };
    }, [connectedDevice]);

    const connectToDevice = async (deviceId) => {
        try {
            // BLE 장치에 연결
            const device = await manager.connectToDevice(deviceId);
            if (!device) {
                console.log("BLEProvider 장치를 찾을 수 없습니다.");
                // setConnectedDevice(null);
                return null;
            }

            // 서비스와 특성 탐색
            const services = await device.discoverAllServicesAndCharacteristics();
            if (!services) {
                console.log("BLEProvider 서비스를 찾을 수 없습니다.");
                // setConnectedDevice(null);
                return null;
            }

            if (device.isConnected()) {
                setIsConnected(device.isConnected());
                setConnectedDevice(device);

                console.log("BLEProvider connectToDevice: " + device.name);
            }

            return device;
        } catch (error) {
            console.error("BLEProvider connectToDevice: " + error);
            setConnectedDevice(null);
            return null;
        }
    };

    const disconnectFromDevice = async () => {
        if (connectedDevice) {
            if(subscription) {
                console.log("subscription remove");
                subscription.remove();
            }
            await connectedDevice.cancelConnection()
                .then((device) => {
                    // 데이터 송수신 코드
                    // sendDataToArduino2(device, "Hellow");
                })
                .catch((error) => {
                    console.log(error);
                });
            setConnectedDevice(null);
        }
    };

    const handleCharacteristic = (error, characteristic) => {
        if (error) {
            console.error("BLEProvider handleCharacteristic: " + error);
            setIsConnected(false);
            return;
        }

        // 수신된 데이터 조각(Base64 인코딩)을 디코딩
        const dataPart = Buffer.from(characteristic.value, 'base64').toString('utf-8');

        // 데이터 조각을 누적
        accumulatedData += dataPart;
        // console.log("Received: " + accumulatedData);

        // 데이터 조각의 시작과 끝을 확인
        if (isValidJSONPart(accumulatedData)) {
            accumulatedData = cleanData(accumulatedData);
            console.log("BLEProvider Received: " + accumulatedData);

            // 완전한 데이터를 상태에 업데이트
            setReceivedData(accumulatedData);

            // 누적 데이터 초기화
            accumulatedData = '';
            setReceivedData('');
        }
    };

    // 패킷의 유효성을 검사하는 함수
    const isValidJSONPart = (data) => {
        // 시작 '{'와 끝 '}' 문자가 있는지 확인
        return data.startsWith('$') && data.endsWith('\n');
    };

    // 문자열에서 head와 tail 문자 제거
    const cleanData = (data) => {
        return data.replace(/^\$/, '').replace(/\n$/, '');
    };

    const connectAndSubscribeToArduino = async (deviceId, serviceUUID, characteristicUUID) => {
        try {
            const device = await connectToDevice(deviceId);
            if (!device) return;

            subscription = device.monitorCharacteristicForService(serviceUUID, characteristicUUID, handleCharacteristic);
        } catch (error) {
            console.error(error);
        }
    };

    const sendDataToArduino = async (serviceUUID, characteristicUUID, message) => {
        if (!connectedDevice) {
            console.log("BLEProvider 장치에 연결되어 있지 않습니다.");
            return;
        }

        try {
            accumulatedData = "";

            if (!await connectedDevice.isConnected()) {
                console.log("BLEProvider 장치가 연결되지 않았습니다. 재연결 시도 중...");
                // 재연결 로직 수행
                await connectAndSubscribeToArduino("08:D1:F9:D7:83:26", SERVICE_UUID, CHARACTERISTIC_UUID);
            }

            console.log("BLEProvider SendData: " + message);
            const encodedData = Buffer.from(message).toString('base64');
            await connectedDevice.writeCharacteristicWithResponseForService(
                serviceUUID,
                characteristicUUID,
                encodedData // Base64로 인코딩된 데이터
            );
        } catch (error) {
            console.error(error);
        }
    };

    const findDevice = (name) => {
        return new Promise((resolve, reject) => {
            console.log("BLEProvider BLE Scanning...");
            setIsScanning(true);

            manager.startDeviceScan(null, null, (error, device) => {
                if (error) {
                    console.log(error);
                    setIsScanning(false);
                    reject(error); // 에러 발생 시 reject
                    return;
                }

                // 특정 장치 찾기 (예: 이름으로 필터링)
                if (device.name === name) {
                    console.log("BLEProvider Found: " + name);
                    manager.stopDeviceScan();
                    setIsScanning(false);

                    resolve(device); // 장치 찾았을 때 resolve
                } else {
                    // 장치를 찾지 못한 경우 처리 (선택 사항)
                }
            });
        });
    };


    const scanAndConnect = () => {
        manager.startDeviceScan(null, null, (error, device) => {
            if (error) {
                console.log(error);
                return;
            }

            // 이미 목록에 있는 장치는 추가하지 않음
            if (!devices.some((d) => d.id === device.id)) {
                setDevices((prevDevices) => [...prevDevices, device]);
            }
        });

        // 스캔을 일정 시간 후에 중지
        setTimeout(() => {
            manager.stopDeviceScan();
        }, 10000); // 10초 후에 스캔 중지
    };

    const value = {
        manager,
        connectedDevice,
        receivedData,
        isConnected,
        connectToDevice,
        disconnectFromDevice,
        connectAndSubscribeToArduino,
        sendDataToArduino,
        devices,
        scanAndConnect,
        findDevice,
    };

    return (
        <BLEContext.Provider value={value}>
            {children}
        </BLEContext.Provider>
    );
};
