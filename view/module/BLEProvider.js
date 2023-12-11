import {Buffer} from 'buffer';
import React, {createContext, useContext, useEffect, useState} from 'react';
import {BleManager} from 'react-native-ble-plx';

const DEVICE_ID = 'ESP32_BLE';
const SERVICE_UUID = 'b3a4529f-acc1-4f4e-949b-b4b7a2376f4f';
const CHARACTERISTIC_UUID = 'ed890871-07e9-4967-81b1-22ce3df7728e';

/**
 * Creates a BLE context for interacting with Bluetooth Low Energy devices.
 *
 * @returns {Object} The BLE context object.
 */
export const BLEContext = createContext();

/**
 * Returns the BLEContext from the current React context.
 *
 * @returns {BLEContext} The BLEContext from the current React context.
 */
export const useBLE = () => useContext(BLEContext);

/**
 * @classdesc Represents a variable manager for BLE (Bluetooth Low Energy) devices.
 * @class
 */
const manager = new BleManager();


/**
 * BLEProvider component provides functionality for handling Bluetooth Low Energy (BLE) devices.
 *
 * @component
 * @param {ReactNode} children - The child components.
 * @returns {ReactNode} - The child components wrapped in BLEContext.Provider.
 */
export const BLEProvider = ({children}) => {

    /**
     * Represents a collection of devices.
     *
     * @class
     */
    const [devices, setDevices] = useState([]);

    /**
     * Represents the connected device.
     *
     * @typedef {Object} ConnectedDevice
     */
    const [connectedDevice, setConnectedDevice] = useState(null);

    /**
     * Represents the received data from an external source.
     *
     * @typedef {Object} receivedData
     */
    const [receivedData, setReceivedData] = useState(""); // 수신된 데이터를 저장할 상태

    /**
     * Represents the scanning status.
     *
     * @type {boolean}
     * @name isScanning
     * @description Indicates whether the application is currently in scanning mode.
     */
    const [isScanning, setIsScanning] = useState(false);

    /**
     * Represents the connection status of a device or network.
     *
     * @typedef {boolean} isConnected
     */
    const [isConnected, setIsConnected] = useState(false);


    /**
     * A string variable to store accumulated data.
     *
     * @type {string}
     */
    let accumulatedData = '';


    /**
     * Represents a subscription object.
     *
     * @typedef {Object} Subscription
     */
    let subscription;

    useEffect(() => {
        console.log("BLEProvider Connected device changed:", connectedDevice);
        // 컴포넌트 언마운트 시 실행될 로직
        return () => {
            setReceivedData(''); // 상태 초기화
        };
    }, [connectedDevice]);


    /**
     * Asynchronously connects to a BLE device with the specified deviceId.
     *
     * @param {string} deviceId - The ID of the BLE device to connect to.
     * @returns {Promise<Object>} - A Promise that resolves to the connected device, or null if the connection fails.
     */
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


    /**
     * Disconnects from the connected device.
     * If there is a connected device, it cancels the connection
     * and removes any active subscription.
     * Once disconnected, the connected device is set to null.
     * This function is asynchronous and returns a promise.
     *
     * @returns {Promise} A promise that resolves once the disconnection is complete
     *                    or rejects with an error if an error occurs during disconnection.
     */
    const disconnectFromDevice = async () => {
        if (connectedDevice) {
            if (subscription) {
                console.log("subscription remove");
                subscription.remove();
            }
            await connectedDevice.cancelConnection()
                .then((device) => {
                })
                .catch((error) => {
                    console.log(error);
                });
            setConnectedDevice(null);
        }
    };


    /**
     * Handle characteristic for BLEProvider.
     *
     * @param {string} error - The error message.
     * @param {object} characteristic - The characteristic object containing the value.
     */
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
        if (isDollarNewlineFormat(accumulatedData)) {
            accumulatedData = removeDollarAndNewline(accumulatedData);
            console.log("BLEProvider Received: " + accumulatedData);

            // 완전한 데이터를 상태에 업데이트
            setReceivedData(accumulatedData);

            // 누적 데이터 초기화
            accumulatedData = '';
            setReceivedData('');
        }
    };


    /**
     * Checks whether the given data is in dollar newline format.
     *
     * @param {string} data - The data to be checked.
     * @returns {boolean} - Returns true if the data is in dollar newline format, false otherwise.
     */
    const isDollarNewlineFormat = (data) => {
        // Check if the data starts with '$' and ends with '\n
        return data.startsWith('$') && data.endsWith('\n');
    };


    /**
     * Removes the dollar sign and newline character from the given data string.
     *
     * @param {string} data - The data string to be processed.
     * @returns {string} The processed data string without the dollar sign and newline character.
     */
    const removeDollarAndNewline = (data) => {
        return data.replace(/^\$/, '').replace(/\n$/, '');
    };


    /**
     * Connects to a device with the given ID, subscribes to the specified service and characteristic,
     * and handles any incoming characteristics using the provided handler function.
     *
     * @async
     * @param {string} deviceId - The ID of the device to connect to.
     * @param {string} serviceUUID - The UUID of the service to subscribe to.
     * @param {string} characteristicUUID - The UUID of the characteristic to monitor.
     * @returns {void}
     * @throws {Error} If there was an error connecting to the device or subscribing to the characteristic.
     */
    const connectAndSubscribe = async (deviceId, serviceUUID, characteristicUUID) => {
        try {
            const device = await connectToDevice(deviceId);
            if (!device) return;

            subscription = device.monitorCharacteristicForService(serviceUUID, characteristicUUID, handleCharacteristic);
        } catch (error) {
            console.error(error);
        }
    };


    /**
     * Sends data through a BLE connection to a specified service and characteristic.
     * @param {string} serviceUUID - The UUID of the service to send data to.
     * @param {string} characteristicUUID - The UUID of the characteristic to send data to.
     * @param {string} message - The data to send.
     * @returns {void}
     */
    const sendData = async (serviceUUID, characteristicUUID, message) => {
        if (!connectedDevice) {
            console.log("BLEProvider 장치에 연결되어 있지 않습니다.");
            return;
        }

        try {
            accumulatedData = "";

            if (!await connectedDevice.isConnected()) {
                console.log("BLEProvider 장치가 연결되지 않았습니다. 재연결 시도 중...");
                // 재연결 로직 수행
                connectAndSubscribe("08:D1:F9:D7:83:26", SERVICE_UUID, CHARACTERISTIC_UUID);
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

    /**
     * Searches for a device with the given name using BLE scanning.
     *
     * @param {string} name - The name of the device to search for.
     * @returns {Promise} A promise that resolves with the device if found, or rejects with an error if not found or an error occurred.
     */
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


    /**
     * Scans for Bluetooth devices and connects to them.
     *
     * This function starts scanning for Bluetooth devices using the `manager.startDeviceScan` method.
     * It adds the newly discovered devices to an existing list of devices if they are not already present.
     * The scan is stopped after a specified duration using the `setTimeout` function and the `manager.stopDeviceScan` method.
     */
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


    /**
     * Represents the current state and functionality of the manager.
     *
     * @typedef {Object} ManagerData
     *
     * @property {instance} manager - The manager instance
     * @property {instance} connectedDevice - The name of the currently connected device.
     * @property {string} receivedData - The data received from the connected device.
     * @property {boolean} isConnected - Indicates whether the manager is currently connected to a device.
     * @property {function} connectToDevice - A function to connect to a specific device.
     * @property {function} disconnectFromDevice - A function to disconnect from the currently connected device.
     * @property {function} connectAndSubscribe - A function to connect and subscribe to an BLE device.
     * @property {function} sendData - A function to send data to the BLE device.
     * @property {function} devices - A function to retrieve a list of available devices.
     * @property {function} scanAndConnect - A function to scan for devices and connect to the first available one.
     * @property {function} findDevice - A function to find a specific device by name.
     */
    const value = {
        manager,
        connectedDevice,
        receivedData,
        isConnected,
        connectToDevice,
        disconnectFromDevice,
        connectAndSubscribe,
        sendData,
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
