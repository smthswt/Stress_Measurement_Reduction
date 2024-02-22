import {Alert, BackHandler, TouchableOpacity, View} from "react-native";
import {Box, Button, Divider, HStack, Radio, Text, useDisclose, VStack} from "native-base";
import React, {useCallback, useEffect, useState} from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import MusicActionSheet from "./components/MusicActionSheet";
import Music_ActionSheet from "./components/MusicActionSheet";
import ManualActionSheet from "./components/ManualActionSheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

/**
 * React component for displaying a calendar view.
 *
 * @component
 * @param {object} navigation - Navigation object used for navigating between screens.
 * @returns {ReactElement} - The rendered component.
 */
export const SettingsView_Manual = ({ navigation }) => {
    const { isOpen, onOpen, onClose } = useDisclose();
    const [music, setMusic] = React.useState("music_two");
    const [move, setMove] = React.useState("move_two");
    const [time, setTime] = React.useState("time_one");
    const [manualMusicName, setManualMusicName] = useState('');
    const [options, setOptions] = useState([
        { label: 'Rise Again (Feat. Will Bug)', value: 0 },
        { label: 'Shin Seung Hun - Like a Beautiful Flame', value: 1 },
        { label: 'Maroon 5 - Wipe your eyes', value: 2 },
        { label: 'J.S Bach - Air on the G String', value: 3 },
    ]);

    const addOption = (musicName) => {
        const lastValue = options[options.length - 1].value;
        const newOption = {
            label: musicName,
            value: lastValue + 1,
        };
        setOptions([...options, newOption]);
    };

    const removeOption = (valueToRemove) => {
        const updatedOptions = options.filter(option => option.value !== valueToRemove);
        setOptions(updatedOptions);
    };

    //remove option 함수로 합치기
    const removeMusicOption = () => {
        Alert.alert('음원을 삭제하시겠습까?');
    }


    // 앱이 시작될 때 AsyncStorage에서 음원 이름 가져오기
    useEffect(() => {
        const fetchSelectedMusic = async () => {
            try {
                const selectedMusic = await AsyncStorage.getItem('selectedMusicName');
                if (selectedMusic !== null) {
                    setManualMusicName(selectedMusic);
                }
            } catch (error) {
                console.error('Error fetching selected music:', error);
            }
        };

        fetchSelectedMusic();
    }, []); // []를 추가하여 한 번만 실행되도록 설정


    const handleMusicName = (musicName) => {
        // setManualMusicName(musicName);
        addOption(musicName.split('.')[0]); // 새로운 음원을 추가합니다.
    };


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
                <Text bold>음원 선택</Text>
                <Radio.Group name="myRadioGroup" colorScheme={"blue"} value={music} onChange={nextValue => {
                    setMusic(nextValue);
                }}>

                    {options.map(option => (
                        <Radio key={option.value} value={option.value} size={"sm"} marginY={1} justifyContent={"space-between"}>
                            {/*Pressable, TouchableOpacity로 바꾸기 바꾸기*/}
                            <Button variant={'unstyled'} onLongPress={removeMusicOption}>
                            {option.label}

                            </Button>
                        </Radio>
                    ))}

                </Radio.Group>
                <Divider/>
                <Button variant={"text"} onPress={onOpen}>
                    <Text>음원 추가하기 +</Text>
                    <ManualActionSheet onOpen={onOpen} onClose={onClose} isOpen={isOpen} MusicName={handleMusicName}/>
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
