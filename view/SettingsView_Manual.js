import {Alert, BackHandler, TouchableHighlight, TouchableOpacity, View} from "react-native";
import {Box, Button, Divider, Radio, ScrollView, Text, useDisclose, VStack, HStack} from "native-base";
import React, {useCallback, useEffect, useState} from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import ManualActionSheet from "./components/ManualActionSheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TrackPlayer, { State } from 'react-native-track-player';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

/**
 * React component for displaying a calendar view.
 *
 * @component
 * @param {object} navigation - Navigation object used for navigating between screens.
 * @returns {ReactElement} - The rendered component.
 */
export const SettingsView_Manual = ({ navigation }) => {
    const { isOpen, onOpen, onClose } = useDisclose();
    const [move, setMove] = React.useState("move_two");
    const [time, setTime] = React.useState("time_one");
    const [options, setOptions] = useState([]);
    const [music, setMusic] = React.useState("");


    useEffect(() => {
        // AsyncStorage에서 음악 옵션들을 가져와 설정합니다.
        const fetchOptions = async () => {
            try {
                const storedOptions = await AsyncStorage.getItem('options');
                const selectedMusicName = await AsyncStorage.getItem('selectedMusicName');
                if (storedOptions !== null) {
                    setOptions(JSON.parse(storedOptions));
                    console.log(storedOptions)
                }
            } catch (error) {
                console.error('Error fetching options:', error);
            }
        };

        fetchOptions().then(() => {
            console.log("Options fetched successfully!");
        }).catch(error => {
            console.error("Error fetching options:", error);
        });
    }, []);


    const handleMusicData = (name, uri, MusicData) => {
        const newMusicName = name.replace('.mp3', '');
        console.log("선택된 음원 이름: ", newMusicName)
        console.log("선택된 음원 경로:", uri);
        addOption(newMusicName, uri);
    };

    const removeOption = (valueToRemove) => {
        const updatedOptions = options.filter(option => option.label !== valueToRemove);
        setOptions(updatedOptions);

        // AsyncStorage에서도 해당 옵션을 제거합니다.
        AsyncStorage.setItem('options', JSON.stringify(updatedOptions)).then(() => {
            console.log("Option removed and updated successfully!");

            // 제거된 항목이 있을 때마다 options 배열의 길이를 갱신합니다.
            setMusic(updatedOptions.length.toString());
        }).catch(error => {
            console.error("Error removing and updating option:", error);
        });
    };

    const addOption = (newMusicName, uri) => {
        // 현재 가장 큰 label 값 찾기
        let maxLabel = Math.max(...options.map(option => parseInt(option.label, 10)));
        if (!isFinite(maxLabel)) {
            maxLabel = 0;
        }

        const newValue = maxLabel + 1;
        const newOption = {
            label: newValue,
            value: newMusicName,
            uri: uri,
        };
        console.log('Before adding option:', options);
        setOptions([...options, newOption]);
        // setMusic(newValue)

        // AsyncStorage에 업데이트된 음악 옵션들을 저장합니다.
        AsyncStorage.setItem('options', JSON.stringify([...options, newOption])).then(() => {
            console.log("Options updated and saved successfully!");
        }).catch(error => {
            console.error("Error updating and saving options:", error);
        });
    };

    useEffect(() => {
        console.log('Options updated:', options);
    }, [options]);


    const removeMusicAlert = (valueToRemove) => {
        const optionToRemove = options.find(option => option.label === valueToRemove);
        Alert.alert(
            '음원 삭제',
            `'"'${optionToRemove.value}'"'을 삭제하시겠습니까?`,
            [
                {
                    text: '취소',
                    style: 'cancel',
                },
                {
                    text: '확인',
                    onPress: () => {
                        removeOption(valueToRemove);
                    },
                },
            ],
            { cancelable: true }
        );
    };


    const handleMusicChange = async (nextValue) => {
        try {
            // Radio.Group의 값을 변경할 때마다 로컬 스토리지에도 값을 업데이트하여 동기화합니다.
            await AsyncStorage.setItem('selectedMusicName', nextValue.toString());
            setMusic(nextValue);

            // 선택된 음원을 재생합니다.
            const option = options.find(opt => opt.label === nextValue);
            if (option) {
                await TrackPlayer.reset(); // 재생 목록 초기화
                await TrackPlayer.add({
                    title: option.value,
                    url: option.uri,
                });
                console.log("option.value: ", option.value)
                console.log("option.uri: ", option.uri)
                await TrackPlayer.play(); // 음원 재생

                // // AudioCommonMetadataReceived 이벤트를 구독하여 수신된 메타데이터를 콘솔에 출력합니다.
                // TrackPlayer.addEventListener("metadata-common-received", (data) => {
                //     console.log('Received metadata:', data);
                //     console.log('Received metadata title:', data.metadata.title);
                //     console.log('Received metadata artist:', data.metadata.artist);
                // });
            } else {
                console.error('Option not found for label:', nextValue);
            }
        } catch (error) {
            console.error('Error updating selected music:', error);
        }
    };

    const handleMusicPause = () => {
        TrackPlayer.pause();
        console.log("음악이 중지되었습니다.")
    };

    const optionsLength = options.length;


    return (
        <VStack flex={1}>
            <HStack alignitems={"center"} justifyContent={"flex-start"} bgColor={"white"} padding={5}>
                <TouchableOpacity activeOpacity={0.8} onPress={() => {navigation.goBack()}}>
                    <Ionicons name={"arrow-back"} color={'#222222'} size={25} />
                </TouchableOpacity>
                <Text bold fontSize={18} marginLeft={3}>메뉴얼 설정</Text>
            </HStack>

        <VStack flex={1} p={6} space={6}>
            <VStack bg={"white"} p={5} space={2} shadow={2}>
                <HStack justifyContent={"space-between"}>
                <Text bold>음원 선택</Text>
                    <TouchableOpacity activeOpacity={0.6} onPress={handleMusicPause}>
                    <MaterialCommunityIcons name={'pause'} size={22} color={"black"} />
                    </TouchableOpacity>
                </HStack>
                <Radio.Group name="myRadioGroup" colorScheme={"blue"} value={music} onChange={handleMusicChange}>

                    <ScrollView showsVerticalScrollIndicator style={{height: optionsLength > 6 ? 170 : 'auto', width: "100%"}}>
                    {options.map(option => (
                        <Radio key={option.label} value={option.label} size={"sm"} marginY={1} justifyContent={"space-between"}>
                            <TouchableOpacity onLongPress={() => removeMusicAlert(option.label)} >
                                <Text>{option.value}</Text>

                            </TouchableOpacity>
                        </Radio>
                    ))}
                    </ScrollView>

                </Radio.Group>
                <Divider/>
                <Button variant={"text"} onPress={onOpen}>
                    <Text>음원 추가하기 +</Text>
                    <ManualActionSheet onOpen={onOpen} onClose={onClose} isOpen={isOpen} MusicData={handleMusicData}/>
                </Button>
            </VStack>
            <VStack bg={"white"} p={5} space={2} shadow={2}>
                <Text bold>진동 선택</Text>
                <Radio.Group name="myRadioGroup" colorScheme={"blue"} value={move} onChange={nextValue => {
                    setMove(nextValue);
                }}>
                    <Radio value="move_one" my={1} size={"sm"}>60 Hz</Radio>
                    <Radio value="move_two" my={1} size={"sm"}>70 Hz</Radio>
                    <Radio value="move_three" my={1} size={"sm"}>80 Hz</Radio>
                    <Radio value="move_four" my={1} size={"sm"}>90 Hz</Radio>
                    <Radio value="move_five" my={1} size={"sm"}>100 Hz</Radio>

                </Radio.Group>
            </VStack>
            <VStack bg={"white"} p={5} space={2} shadow={2}>
                <Text bold>시간 선택</Text>
                <Radio.Group name="myRadioGroup" colorScheme={"blue"} value={time} onChange={nextValue => {
                    setTime(nextValue);
                }}>
                    <Radio value="time_one" my={1} size={"sm"}>10 분</Radio>
                    <Radio value="time_two" my={1} size={"sm"}>20 분</Radio>
                    <Radio value="time_three" my={1} size={"sm"}>30 분</Radio>
                </Radio.Group>
            </VStack>
        </VStack>


        </VStack>
    )
}
