import {Buffer} from "buffer";
import React, {createContext, useContext, useRef, useState} from "react";
import {BleManager} from "react-native-ble-plx";
import {useDispatch} from "react-redux";
import {setConnectDevice, setConnectionStatus} from "../../data/store";
// import {setConnectedDevice} from "../../data/store";


const DEVICE_ID = "RENST";
const SERVICE_UUID = "b3a4529f-acc1-4f4e-949b-b4b7a2376f4f";
const CHARACTERISTIC_UUID = "ed890871-07e9-4967-81b1-22ce3df7728e";


/**
 * @classdesc Represents a variable manager for BLE (Bluetooth Low Energy) devices.
 * @class
 */
const manager = new BleManager();

/**
 * Creates a BLE context for interacting with Bluetooth Low Energy devices.
 *
 * @returns {Object} The BLE context object.
 */
const BLEContext = createContext(null);


/**
 * Returns the BLEContext from the current React context.
 *
 * @returns {BLEContext} The BLEContext from the current React context.
 */
export const useBLE = () => useContext(BLEContext);


/**
 * BLEProvider component provides functionality for handling Bluetooth Low Energy (BLE) devices.
 *
 * @component
 * @param {ReactNode} children - The child components.
 * @returns {ReactNode} - The child components wrapped in BLEContext.Provider.
 */
export const BLEProvider = ({children}) => {
    const dispatch = useDispatch();

    const [connectedDevice, setConnectedDevice] = useState(null);

    let rrList = useRef([]);
    let hrList = useRef([]);

    let avgHR = useRef(0.0);
    let sdnn = useRef(0.0);
    let stressIndex = useRef(0);

    /**
     * Represents a subscription object.
     *
     * @typedef {Object} Subscription
     */
    let subscription;

    /**
     * Scans for all devices using BLEProvider.
     *
     * @param {number} [scanTimeout=10000] - The scan timeout in milliseconds.
     * @returns {Promise<Array>} - A promise that resolves with an array of discovered devices.
     */
    const scanAllDevices = (scanTimeout = 2 * 1000) => {
        return new Promise((resolve, reject) => {
            console.log("BLEProvider BLE Scanning...");

            let devices = []; // 발견된 장치들을 저장할 배열
            let timer;
            manager.startDeviceScan(null, null, (error, device) => {
                if (error) {
                    clearInterval(timer);
                    console.log(error);
                    reject(error); // 에러 발생 시 reject
                }

                if (device && device.name) {
                    // 발견된 장치를 배열에 추가. 중복 방지 로직 필요할 수 있음
                    if (device.name === DEVICE_ID && devices.findIndex(d => d.id === device.id) === -1) {
                        devices.push(device);
                        console.log(`Found: Device Name(${device.name}), Id(${device.id})`);
                    }
                }
            });

            // 정해진 시간 후에 스캔 중지 및 발견된 장치 목록 반환
            timer = setTimeout(() => {
                manager.stopDeviceScan();
                console.log("Scanning stopped");
                resolve(devices); // 스캔 종료 후 발견된 모든 장치 반환
            }, scanTimeout);
        });
    }


    /**
     * Asynchronously connects to a BLE device with the specified deviceId.
     *
     * @param {string} deviceId - The ID of the BLE device to connect to.
     * @returns {Promise<Object>} - A Promise that resolves to the connected device, or null if the connection fails.
     */
    const connect = async (deviceId) => {
        try {
            // BLE 장치에 연결
            const device = await manager.connectToDevice(deviceId);
            if (!device) {
                console.log("BLEProvider 장치를 찾을 수 없습니다.");
                // dispatch(setConnectedDevice(null));
                setConnectedDevice(null);
                // connectedDevice = null;
                return null;
            }

            // 서비스와 특성 탐색
            const services = await device.discoverAllServicesAndCharacteristics();
            if (!services) {
                console.log("BLEProvider 서비스를 찾을 수 없습니다.");
                // connectedDevice = null;
                setConnectedDevice(null);
                return null;
            }

            if (await device.isConnected()) {
                // connectedDevice = device;
                // dispatch(setConnectedDevice(device));
                setConnectedDevice(device);

                // const disconnectListener = connectedDevice.addListener(
                //     'BleManagerDisconnectPeripheral',
                //     (data) => {
                //         // 연결 해제된 장치의 ID를 통해 특정 동작 수행
                //         console.log('Disconnected from ' + data.id);
                //         alert('Device is disconnected!');
                //
                //         connectDevice("");
                //     }
                // );

                console.log(`BLEProvider connectToDevice: ${device.id} - ${device.name}`);
            }

            return device;
        } catch (error) {
            console.error("BLEProvider connectToDevice: " + error);
            // connectedDevice = null;
            setConnectedDevice(null);

            throw error;
        }
    }


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
    const disconnect = async () => {
        if (connectedDevice) {
            if (subscription) {
                console.log("subscription remove");
                subscription.remove();
            }

            return await connectedDevice.cancelConnection()
                .then((device) => {
                    // connectedDevice = null;
                    setConnectedDevice(null);
                    return true;
                })
                .catch((error) => {
                    console.log(error);
                    return false;
                });
        }
    }


    /**
     * Handle characteristic for BLEProvider.
     *
     * @param {string} error - The error message.
     * @param {object} characteristic - The characteristic object containing the value.
     */
    const handleCharacteristic = (error, characteristic) => {
        if (error) {
            console.warn(error);

            dispatch(setConnectDevice(""));
            dispatch(setConnectionStatus(false));
            return;
        }

        // Data transmitted from Arduino BLE is encoded in Base64.
        // Accordingly, Base64 decoding is required.

        // If your data is actually Base64 encoded...
        const base64Data = characteristic.value;
        const rawBytes = Buffer.from(base64Data, "base64");

        Packet(rawBytes);
    }


    /**
     * Represents a packet of data.
     * @param {Buffer} packetData - The input data for the packet.
     */
    const Packet = (packetData) => {
        let length = packetData.length;

        let startCode = packetData[0];
        let endCode = packetData[length - 1];
        let idCode = packetData[2];
        let crc = packetData[length - 2]

        let calculatedCrc = calculateCrc(packetData, length - 2);
        if (startCode === 60 && calculatedCrc === crc && endCode === 62) {
            // console.log(`valid packet: ${idCode}`);

            switch (idCode) {
                case 0x00:
                    // 명령어 성공
                    parseSuccessPacket(packetData);
                    break;
                case 0x99:
                    // 명령어 실패 - 에러 처리
                    parseErrorPacket(packetData);
                    break;
                case 0x30:
                    parseAnalysisResultPacket(packetData);
                    break;
                case 0x40:
                    // Stress Index 데이터 수신
                    parseStressIndexPacket(packetData);
                    break;
                case 0x41:
                    // SDNN 데이터 수신
                    parseSDNNPacket(packetData);
                    break;
                case 0x42:
                    // Avg.HR 데이터 수신
                    parseAverageHRPacket(packetData);
                    break;
                case 0x50:
                    // RealTime HR 데이터 수신
                    parseRealTimeHRPacket(packetData);
                    break;
                case 0x51:
                    // RealTime RR 데이터 수신
                    parseRealTimeRRPacket(packetData);
                    break;
            }
        }
    }


    /**
     * Calculates the cyclic redundancy check (CRC) of the given data.
     *
     * @param {Uint8Array} data - The data on which the CRC needs to be calculated.
     * @param {number} length - The length of the data.
     * @returns {number} The CRC value calculated.
     *
     * @example
     * const data = [1, 2, 3, 4, 5];
     * const length = data.length;
     * const crc = calculateCrc(data, length);
     * console.log(crc); // Output: 15
     */
    const calculateCrc = (data, length) => {
        let crc = 0;
        for (let i = 0; i < length; i++) {
            crc += data[i];
        }
        return crc & 0x7F;
    }


    /**
     * Parses the success packet data.
     *
     * @param {Buffer} packetData - The packet data to be parsed.
     *
     * @returns {undefined} - Returns undefined if packet data is falsy.
     */
    const parseSuccessPacket = (packetData) => {
        if (!packetData)
            return;

        // 커멘드 성공 여부 처리
    }


    /**
     * Parses the error packet data.
     *
     * @param {Buffer} packetData - The error packet data to be parsed.
     */
    const parseErrorPacket = (packetData) => {
        if (!packetData)
            return;

        // 커멘드 실패 여부 처리
    }


    /**
     * Parses the real-time heart rate packet data.
     *
     * @param {Buffer} packetData - The packet data to parse.
     */
    const parseRealTimeHRPacket = (packetData) => {

        if (!packetData)
            return;

        let high = packetData[3];
        let low = packetData[4];

        let data = (high & 0xFF) << 8 | low & 0xFF;
        console.log(`Real Time HR: ${data}`);

        // setAvgHRList([...avgHRList, data]);
        hrList.current.push(data);
    }


    /**
     * Parses a real-time RR (Respiration Rate) packet.
     *
     * @param {Buffer} packetData - The packet data to parse.
     */
    const parseRealTimeRRPacket = (packetData) => {
        if (!packetData)
            return;

        let high = packetData[3];
        let low = packetData[4];

        let data = (high & 0xFF) << 8 | low & 0xFF;
        console.log(`Real Time RR: ${data}`);

        // setRRList([...rrList, data]);
        rrList.current.push(data);
    }


    /**
     * Parses a stress index packet.
     *
     * @param {Buffer} packetData - The packet data to parse.
     */
    const parseStressIndexPacket = (packetData) => {
        if (!packetData)
            return;

        let high = packetData[3];
        let low = packetData[4];

        let data = (high & 0xFF) << 8 | low & 0xFF;
        console.log(`Stress Index: ${data}`);
    }


    /**
     * Parses the SDNN packet from the given packet data.
     *
     * @param {Buffer} packetData - The packet data containing the SDNN packet.
     */
    const parseSDNNPacket = (packetData) => {
        if (!packetData)
            return;

        let high = packetData[3];
        let low = packetData[4];

        let data = (high & 0xFF) << 8 | low & 0xFF;
        console.log(`SDNN: ${data}`);
    }


    /**
     * Parses the average heart rate packet and logs the result.
     *
     * @param {Buffer} packetData - The packet data containing the heart rate values.
     */
    const parseAverageHRPacket = (packetData) => {
        if (!packetData)
            return;

        let high = packetData[3];
        let low = packetData[4];

        let data = (high & 0xFF) << 8 | low & 0xFF;
        console.log(`Average HR: ${data}`);
    }

    const parseAnalysisResultPacket = (packetData) => {
        if (!packetData)
            return;

        let high = packetData[3];
        let low = packetData[4];

        let data = (high & 0xFF) << 8 | low & 0xFF;
        console.log(`Average HR: ${data}`);

        high = packetData[5];
        low = packetData[6];

        data = (high & 0xFF) << 8 | low & 0xFF;
        console.log(`SDNN: ${data}`);

        high = packetData[7];
        low = packetData[8];

        data = (high & 0xFF) << 8 | low & 0xFF;
        console.log(`Stress Index: ${data}`);
    }

    const calculateHeartRatePerMinute = (heartBeats, size, sec) => {

        // 측정된 박동의 총 개수 계산
        let totalBeats = 0;
        for (let i = 0; i < size; i++) {
            totalBeats += heartBeats[i];
        }

        let avg = totalBeats / size;

        // Uncomment below lines if you want to log the values
        // console.log("Total Beats:", totalBeats);
        // console.log("HR Avg:", avg);

        // 분당 박동수 계산
        let heartRatePerMinute = (avg / sec) * 60.0;
        return Math.floor(avg);
    }

    const calculateStressIndex = (value) => {
        let stressIndex = 0;
        if (value <= 0) {
            return 0;
        }

        if (value < 20) {
            stressIndex = 4;
        } else if (value < 30) {
            stressIndex = 3;
        } else if (value < 50) {
            stressIndex = 2;
        } else if (value > 50) {
            stressIndex = 1;
        }

        return stressIndex;
    }

    const calculateSDNN = (RR, count) => {
        let total = 0.0, sum = 0.0, average, pow1, SDNN = 0.0;

        // RR 데이터의 총합 계산
        for (let i = 0; i < count; i++) {
            total += RR[i];
        }
        average = total / count; // RR 평균값

        // 분산 계산
        for (let i = 0; i < count; i++) {
            pow1 = RR[i] - average;
            sum += pow1 * pow1;
        }

        // 표준편차 계산 (SDNN 값)
        SDNN = Math.sqrt(sum / (count - 1));

        return SDNN;
    }


    /**
     * Connects to a device with the given ID, subscribes to the specified service and characteristic,
     * and handles any incoming characteristics using the provided handler function.
     *
     * @async
     * @param {string} deviceId - The ID of the device to connect to.
     * @returns {void}
     * @throws {Error} If there was an error connecting to the device or subscribing to the characteristic.
     */
    const connectAndSubscribe = async (deviceId) => {
        try {
            console.log("connectAndSubscribe: " + deviceId);

            const device = await connect(deviceId);
            if (!device) {
                console.error("connectAndSubscribe: " + deviceId + " is not connected");
                return false;
            }

            subscription = device.monitorCharacteristicForService(SERVICE_UUID, CHARACTERISTIC_UUID, handleCharacteristic);
            return subscription;
        } catch (error) {
            console.error("connectAndSubscribe Error: " + error);
            throw error;
        }
    }


    /**
     * Sends data to the connected BLE device.
     *
     * @param {Uint8Array} message - The message to be sent.
     * @returns {Promise<boolean>} - A promise that resolves once the data has been sent.
     */
    const sendData = async (message) => {
        if (!connectedDevice) {
            console.log("There are no devices connected.");
            return false;
        }

        try {

            console.log(`connected device: ${connectedDevice}`);

            if (!await connectedDevice.isConnected()) {
                console.log("Temporarily disconnected. Trying to reconnect...");

                // Perform reconnection logic
                connectAndSubscribe(connectedDevice.id);
            }

            const messageBuffer = Buffer.from(message);
            const encodedData = messageBuffer.toString('base64');
            console.log("BLEProvider SendData: " + message + " : " + encodedData);

            await connectedDevice.writeCharacteristicWithResponseForService(
                SERVICE_UUID,
                CHARACTERISTIC_UUID,
                encodedData
            );

            return true;
        } catch (error) {
            console.error(error);
        }

        return false;
    }


    /**
     * Sends a start analysis packet.
     * @async
     * @function sendAnalysisStartPacket
     *
     * @description
     * This function is responsible for sending a start analysis packet to a device or system. The packet is constructed
     * with a fixed length of 5 bytes, consisting of specific data values in each position. The packet structure is as follows:
     *
     * Byte 0: Start delimiter character '<' (0x3C)
     * Byte 1: Length (0x01)
     * Byte 2: Command ID (0x01)
     * Byte 3: CRC (checksum) value
     * Byte 4: End delimiter character '>' (0x3E)
     *
     * The CRC value is calculated by calling the `calculateCrc` function, passing the `data` array and the length of the
     * array minus 2 (to exclude the CRC itself and the end delimiter character). The `calculateCrc` function is assumed to
     * be available in the codebase.
     *
     * Once the packet is constructed, it is sent asynchronously by calling the `sendData` function and passing the `data`
     * array for transmission.
     *
     * @returns {Promise} A promise that resolves when the packet is successfully sent.
     */
    const sendAnalysisStartPacket = async () => {

        let data = new Uint8Array(5);
        data[0] = '<'.charCodeAt(0);
        data[1] = 0x01; // Length
        data[2] = 0x01; // Command ID
        data[4] = '>'.charCodeAt(0);

        data[3] = calculateCrc(data, data.length - 2);

        await sendData(data);
    }

    /**
     * Sends an analysis end packet.
     *
     * @function
     * @async
     *
     * @returns {Promise<void>} Resolves once the packet is sent.
     */
    const sendAnalysisEndPacket = async () => {
        let data = new Uint8Array(5);

        data[0] = '<'.charCodeAt(0);
        data[1] = 0x01; // Length
        data[2] = 0x02; // Command ID
        data[4] = '>'.charCodeAt(0);

        data[3] = calculateCrc(data, data.length - 2);

        await sendData(data);
    }

    /**
     * Sends a motor start packet.
     *
     * @param {number} index - The index of the motor.
     * @param {number} power - The power level for the motor.
     * @returns {Promise<void>} - A promise that resolves when the packet is sent.
     */
    const sendMotorStartPacket = async (index, power) => {
        let data = new Uint8Array(7);
        data[0] = '<'.charCodeAt(0);
        data[1] = 0x02; // Length
        data[2] = 0x03; // Command ID
        data[3] = index;
        data[4] = power;
        data[6] = '>'.charCodeAt(0);

        data[5] = calculateCrc(data, data.length - 2);

        await sendData(data);
    }


    /**
     * Sends a motor stop packet to the specified device.
     *
     * @async
     * @function sendMotorStopPacket
     * @returns {Promise<void>} - A Promise that resolves once the packet is sent.
     */
    const sendMotorStopPacket = async () => {
        let data = new Uint8Array(5);
        data[0] = '<'.charCodeAt(0);
        data[1] = 0x01; // Length
        data[2] = 0x04; // Command ID
        data[4] = '>'.charCodeAt(0);

        data[3] = calculateCrc(data, data.length - 2);

        await sendData(data);
    }


    /**
     * Sends a stress index packet.
     *
     * @async
     * @function sendStressIndexPacket
     * @returns {Promise} A Promise that resolves when the packet is sent.
     */
    const sendStressIndexPacket = async () => {
        let data = new Uint8Array(5);
        data[0] = '<'.charCodeAt(0);
        data[1] = 0x01; // Length
        data[2] = 0x10; // Command ID
        data[3] = (data[1] + data[2]) & 0x7F;
        data[4] = '>'.charCodeAt(0);

        await sendData(data);
    }


    /**
     * Sends an SDNN packet.
     *
     * @async
     * @function sendSDNNPacket
     * @returns {Promise<void>} A Promise that resolves when the packet has been sent.
     */
    const sendSDNNPacket = async () => {
        let data = new Uint8Array(5);
        data[0] = '<'.charCodeAt(0);
        data[1] = 0x01;
        data[2] = 0x11;
        data[3] = (data[1] + data[2]) & 0x7F;
        data[4] = '>'.charCodeAt(0);

        await sendData(data);
    }


    /**
     * Sends an average heart rate packet.
     *
     * @async
     * @function sendAvgHRPacket
     * @returns {Promise} A Promise that resolves when the packet is sent.
     */
    const sendAvgHRPacket = async () => {
        let data = new Uint8Array(5);
        data[0] = '<'.charCodeAt(0);
        data[1] = 0x01;
        data[2] = 0x12;
        data[3] = (data[1] + data[2]) & 0x7F;
        data[4] = '>'.charCodeAt(0);

        await sendData(data);
    }


    /**
     * Function to initialize the analysis.
     *
     * @async
     * @function analysisStart
     * @returns {Promise<void>}
     */
    const analysisStart = async () => {
        avgHR.current = 0.0;
        sdnn.current = 0.0;
        stressIndex.current = 0.0;

        rrList.current = [];
        hrList.current = [];

        await sendAnalysisStartPacket();
    }

    /**
     * Sends analysis end packet and updates the necessary variables for analysis finish.
     *
     * @async
     * @function analysisFinish
     * @returns {Promise<void>}
     */
    const analysisFinish = async () => {
        await sendAnalysisEndPacket();

        console.log(`avgHRList: ${hrList.current}, Length: ${hrList.current.length}`);
        console.log(`RRList: ${rrList.current}, Length: ${rrList.current.length}`);

        avgHR.current = calculateHeartRatePerMinute(hrList.current, hrList.current.length, 60);
        sdnn.current = calculateSDNN(rrList.current, rrList.current.length);
        stressIndex.current = calculateStressIndex(sdnn.current);

        console.log(`HR (BPM): ${avgHR.current}, SDNN: ${sdnn.current}, StressIndex: ${stressIndex.current}`);
    }

    const getRRList = () => {
        return rrList.current;
    }

    const getHRList = () => {
        return hrList.current;
    }

    const getAvgHR = () => {
        return avgHR.current;
    }

    const getSDNN = () => {
        return sdnn.current;
    }

    const getStressIndex = () => {
        return stressIndex.current;
    }

    /**
     * Represents a value containing various methods related to BLE device scanning, connection, and packet transmission.
     *
     * @typedef {Object} Value
     *
     * @property {Function} scanAllDevices - A function that performs BLE device scanning and returns found devices.
     *
     * @property {Function} disconnect - A function that disconnects from the currently connected BLE device.
     *
     * @property {Function} connectAndSubscribe - A function that connects to a specific BLE device and subscribes to its characteristics.
     *
     * @property {Function} sendAnalysisStartPacket - A function that sends a packet to start the analysis process.
     *
     * @property {Function} sendAnalysisEndPacket - A function that sends a packet to end the analysis process.
     *
     * @property {Function} sendMotorStartPacket - A function that sends a packet to start a motor action.
     *
     * @property {Function} sendMotorStopPacket - A function that sends a packet to stop a motor action.
     *
     * @property {Function} sendStressIndexPacket - A function that sends a packet with the stress index value.
     *
     * @property {Function} sendSDNNPacket - A function that sends a packet with the SDNN value.
     *
     * @property {Function} sendAvgHRPacket - A function that sends a packet with the average heart rate value.
     */
    const value = {
        // Search and connect BLE devices
        scanAllDevices,
        disconnect,
        connectAndSubscribe,
        // communication method
        sendMotorStartPacket,
        sendMotorStopPacket,
        analysisStart,
        analysisFinish,
        getRRList,
        getHRList,
        // RENST Properties Get
        getStressIndex,
        getSDNN,
        getAvgHR
    }


    return (
        <BLEContext.Provider value={value}>
            {children}
        </BLEContext.Provider>
    );
}



//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// import {Buffer} from 'buffer';
// import React, {createContext, useContext, useEffect, useState} from 'react';
// import {BleManager} from 'react-native-ble-plx';
//
// export const DEVICE_ID = 'ESP32_BLE';
// export const SERVICE_UUID = 'b3a4529f-acc1-4f4e-949b-b4b7a2376f4f';
// const CHARACTERISTIC_UUID = 'ed890871-07e9-4967-81b1-22ce3df7728e';
//
// /**
//  * Creates a BLE context for interacting with Bluetooth Low Energy devices.
//  *
//  * @returns {Object} The BLE context object.
//  */
// export const BLEContext = createContext();
//
// /**
//  * Returns the BLEContext from the current React context.
//  *
//  * @returns {BLEContext} The BLEContext from the current React context.
//  */
// export const useBLE = () => useContext(BLEContext);
//
// /**
//  * @classdesc Represents a variable manager for BLE (Bluetooth Low Energy) devices.
//  * @class
//  */
// const manager = new BleManager();
//
//
// /**
//  * BLEProvider component provides functionality for handling Bluetooth Low Energy (BLE) devices.
//  *
//  * @component
//  * @param {ReactNode} children - The child components.
//  * @returns {ReactNode} - The child components wrapped in BLEContext.Provider.
//  */
// export const BLEProvider = ({children}) => {
//
//     /**
//      * Represents a collection of devices.
//      *
//      * @class
//      */
//     const [devices, setDevices] = useState([]);
//
//     /**
//      * Represents the connected device.
//      *
//      * @typedef {Object} ConnectedDevice
//      */
//     const [connectedDevice, setConnectedDevice] = useState(null);
//
//     /**
//      * Represents the received data from an external source.
//      *
//      * @typedef {Object} receivedData
//      */
//     const [receivedData, setReceivedData] = useState(""); // 수신된 데이터를 저장할 상태
//
//     /**
//      * Represents the scanning status.
//      *
//      * @type {boolean}
//      * @name isScanning
//      * @description Indicates whether the application is currently in scanning mode.
//      */
//     const [isScanning, setIsScanning] = useState(false);
//
//     /**
//      * Represents the connection status of a device or network.
//      *
//      * @typedef {boolean} isConnected
//      */
//     const [isConnected, setIsConnected] = useState(false);
//
//
//     /**
//      * A string variable to store accumulated data.
//      *
//      * @type {string}
//      */
//     let accumulatedData = '';
//
//
//     /**
//      * Represents a subscription object.
//      *
//      * @typedef {Object} Subscription
//      */
//     let subscription;
//
//     useEffect(() => {
//         console.log("BLEProvider Connected device changed:", connectedDevice);
//         // 컴포넌트 언마운트 시 실행될 로직
//         return () => {
//             setReceivedData(''); // 상태 초기화
//         };
//     }, [connectedDevice]);
//
//
//     /**
//      * Asynchronously connects to a BLE device with the specified deviceId.
//      *
//      * @param {string} deviceId - The ID of the BLE device to connect to.
//      * @returns {Promise<Object>} - A Promise that resolves to the connected device, or null if the connection fails.
//      */
//     const connectToDevice = async (deviceId) => {
//         try {
//             // BLE 장치에 연결
//             const device = await manager.connectToDevice(deviceId);
//             if (!device) {
//                 console.log("BLEProvider 장치를 찾을 수 없습니다.");
//                 // setConnectedDevice(null);
//                 return null;
//             }
//
//             // 서비스와 특성 탐색
//             const services = await device.discoverAllServicesAndCharacteristics();
//             if (!services) {
//                 console.log("BLEProvider 서비스를 찾을 수 없습니다.");
//                 // setConnectedDevice(null);
//                 return null;
//             }
//
//             if (device.isConnected()) {
//                 setIsConnected(device.isConnected());
//                 setConnectedDevice(device);
//
//                 console.log("BLEProvider connectToDevice: " + device.name);
//             }
//
//             return device;
//         } catch (error) {
//             console.error("BLEProvider connectToDevice: " + error);
//             setConnectedDevice(null);
//             return null;
//         }
//     };
//
//
//     /**
//      * Disconnects from the connected device.
//      * If there is a connected device, it cancels the connection
//      * and removes any active subscription.
//      * Once disconnected, the connected device is set to null.
//      * This function is asynchronous and returns a promise.
//      *
//      * @returns {Promise} A promise that resolves once the disconnection is complete
//      *                    or rejects with an error if an error occurs during disconnection.
//      */
//     const disconnectFromDevice = async () => {
//         if (connectedDevice) {
//             if (subscription) {
//                 console.log("subscription remove");
//                 subscription.remove();
//             }
//             await connectedDevice.cancelConnection()
//                 .then((device) => {
//                 })
//                 .catch((error) => {
//                     console.log(error);
//                 });
//             setConnectedDevice(null);
//         }
//     };
//
//
//     /**
//      * Handle characteristic for BLEProvider.
//      *
//      * @param {string} error - The error message.
//      * @param {object} characteristic - The characteristic object containing the value.
//      */
//     const handleCharacteristic = (error, characteristic) => {
//         if (error) {
//             console.error("BLEProvider handleCharacteristic: " + error);
//             setIsConnected(false);
//             return;
//         }
//
//         // 수신된 데이터 조각(Base64 인코딩)을 디코딩
//         const dataPart = Buffer.from(characteristic.value, 'base64').toString('utf-8');
//
//         // 데이터 조각을 누적
//         accumulatedData += dataPart;
//         // console.log("Received: " + accumulatedData);
//
//         // 데이터 조각의 시작과 끝을 확인
//         if (isDollarNewlineFormat(accumulatedData)) {
//             accumulatedData = removeDollarAndNewline(accumulatedData);
//             console.log("BLEProvider Received: " + accumulatedData);
//
//             // 완전한 데이터를 상태에 업데이트
//             setReceivedData(accumulatedData);
//
//             // 누적 데이터 초기화
//             accumulatedData = '';
//             setReceivedData('');
//         }
//     };
//
//
//     /**
//      * Checks whether the given data is in dollar newline format.
//      *
//      * @param {string} data - The data to be checked.
//      * @returns {boolean} - Returns true if the data is in dollar newline format, false otherwise.
//      */
//     const isDollarNewlineFormat = (data) => {
//         // Check if the data starts with '$' and ends with '\n
//         return data.startsWith('$') && data.endsWith('\n');
//     };
//
//
//     /**
//      * Removes the dollar sign and newline character from the given data string.
//      *
//      * @param {string} data - The data string to be processed.
//      * @returns {string} The processed data string without the dollar sign and newline character.
//      */
//     const removeDollarAndNewline = (data) => {
//         return data.replace(/^\$/, '').replace(/\n$/, '');
//     };
//
//
//     /**
//      * Connects to a device with the given ID, subscribes to the specified service and characteristic,
//      * and handles any incoming characteristics using the provided handler function.
//      *
//      * @async
//      * @param {string} deviceId - The ID of the device to connect to.
//      * @param {string} serviceUUID - The UUID of the service to subscribe to.
//      * @param {string} characteristicUUID - The UUID of the characteristic to monitor.
//      * @returns {void}
//      * @throws {Error} If there was an error connecting to the device or subscribing to the characteristic.
//      */
//     const connectAndSubscribe = async (deviceId, serviceUUID, characteristicUUID) => {
//         try {
//             const device = await connectToDevice(deviceId);
//             if (!device) return;
//
//             subscription = device.monitorCharacteristicForService(serviceUUID, characteristicUUID, handleCharacteristic);
//         } catch (error) {
//             console.error(error);
//         }
//     };
//
//
//     /**
//      * Sends data through a BLE connection to a specified service and characteristic.
//      * @param {string} serviceUUID - The UUID of the service to send data to.
//      * @param {string} characteristicUUID - The UUID of the characteristic to send data to.
//      * @param {string} message - The data to send.
//      * @returns {void}
//      */
//     const sendData = async (serviceUUID, characteristicUUID, message) => {
//         if (!connectedDevice) {
//             console.log("BLEProvider 장치에 연결되어 있지 않습니다.");
//             return;
//         }
//
//         try {
//             accumulatedData = "";
//
//             if (!await connectedDevice.isConnected()) {
//                 console.log("BLEProvider 장치가 연결되지 않았습니다. 재연결 시도 중...");
//                 // 재연결 로직 수행
//                 connectAndSubscribe("08:D1:F9:D7:83:26", SERVICE_UUID, CHARACTERISTIC_UUID);
//             }
//
//             console.log("BLEProvider SendData: " + message);
//             const encodedData = Buffer.from(message).toString('base64');
//             await connectedDevice.writeCharacteristicWithResponseForService(
//                 serviceUUID,
//                 characteristicUUID,
//                 encodedData // Base64로 인코딩된 데이터
//             );
//         } catch (error) {
//             console.error(error);
//         }
//     };
//
//     /**
//      * Searches for a device with the given name using BLE scanning.
//      *
//      * @param {string} name - The name of the device to search for.
//      * @returns {Promise} A promise that resolves with the device if found, or rejects with an error if not found or an error occurred.
//      */
//     const findDevice = (name) => {
//         return new Promise((resolve, reject) => {
//             console.log("BLEProvider BLE Scanning...");
//             setIsScanning(true);
//
//             manager.startDeviceScan(null, null, (error, device) => {
//                 if (error) {
//                     console.log("find error: ", error);
//                     setIsScanning(false);
//                     reject(error); // 에러 발생 시 reject
//                     return;
//                 }
//
//                 // 특정 장치 찾기 (예: 이름으로 필터링)
//                 if (device.name === name) {
//                     console.log("BLEProvider Found: " + name);
//                     manager.stopDeviceScan();
//                     setIsScanning(false);
//
//                     resolve(device); // 장치 찾았을 때 resolve
//                 } else {
//                     // 장치를 찾지 못한 경우 처리 (선택 사항)
//                 }
//             });
//         });
//     };
//
//
//     /**
//      * Scans for Bluetooth devices and connects to them.
//      *
//      * This function starts scanning for Bluetooth devices using the `manager.startDeviceScan` method.
//      * It adds the newly discovered devices to an existing list of devices if they are not already present.
//      * The scan is stopped after a specified duration using the `setTimeout` function and the `manager.stopDeviceScan` method.
//      */
//     const scanAndConnect = () => {
//         manager.startDeviceScan(null, null, (error, device) => {
//             if (error) {
//                 console.log("ScanAndConnect error:", error);
//                 return;
//             }
//
//             // 이미 목록에 있는 장치는 추가하지 않음
//             if (!devices.some((d) => d.id === device.id)) {
//                 setDevices((prevDevices) => [...prevDevices, device]);
//             }
//         });
//
//         // 스캔을 일정 시간 후에 중지
//         setTimeout(() => {
//             manager.stopDeviceScan();
//         }, 10000); // 10초 후에 스캔 중지
//     };
//
//
//     /**
//      * Represents the current state and functionality of the manager.
//      *
//      * @typedef {Object} ManagerData
//      *
//      * @property {instance} manager - The manager instance
//      * @property {instance} connectedDevice - The name of the currently connected device.
//      * @property {string} receivedData - The data received from the connected device.
//      * @property {boolean} isConnected - Indicates whether the manager is currently connected to a device.
//      * @property {function} connectToDevice - A function to connect to a specific device.
//      * @property {function} disconnectFromDevice - A function to disconnect from the currently connected device.
//      * @property {function} connectAndSubscribe - A function to connect and subscribe to an BLE device.
//      * @property {function} sendData - A function to send data to the BLE device.
//      * @property {function} devices - A function to retrieve a list of available devices.
//      * @property {function} scanAndConnect - A function to scan for devices and connect to the first available one.
//      * @property {function} findDevice - A function to find a specific device by name.
//      */
//     const value = {
//         manager,
//         connectedDevice,
//         receivedData,
//         isConnected,
//         connectToDevice,
//         disconnectFromDevice,
//         connectAndSubscribe,
//         sendData,
//         devices,
//         scanAndConnect,
//         findDevice,
//     };
//
//     return (
//         <BLEContext.Provider value={value}>
//             {children}
//         </BLEContext.Provider>
//     );
// };
