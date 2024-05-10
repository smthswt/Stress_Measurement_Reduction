import {Alert, BackHandler, TouchableHighlight, TouchableOpacity, View} from "react-native";
import {Box, Button, Divider, Radio, ScrollView, Text, useDisclose, VStack, HStack} from "native-base";
import React, {useCallback, useContext, useEffect, useState} from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import ManualActionSheet from "./components/ManualActionSheet";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TrackPlayer, { State } from 'react-native-track-player';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import firestore from "@react-native-firebase/firestore";
import {UserContext} from "./module/UserProvider";
import {serverTimestamp} from "@react-native-firebase/firestore/lib/modular/FieldValue";
import {useBLE} from "./module/BLEProvider";

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
    const [musicItemId, setMusicItemId] = React.useState("");
    const [isPlaying, setIsPlaying] = useState(false);
    const [selectedTitle, setSelectedTitle] = useState()

    const {userId} = useContext(UserContext)
    // console.log("전역 userId:", userId) //전역관리

    // useEffect(() => {
    //     // AsyncStorage에서 음악 옵션들을 가져와 설정합니다.
    //     const fetchOptions = async () => {
    //         try {
    //             const storedOptions = await AsyncStorage.getItem('options');
    //             // const selectedMusicName = await AsyncStorage.getItem('selectedMusicName');
    //             if (storedOptions !== null) {
    //                 setOptions(JSON.parse(storedOptions));
    //                 console.log(storedOptions)
    //             }
    //         } catch (error) {
    //             console.error('Error fetching options:', error);
    //         }
    //     };
    //
    //     fetchOptions().then(() => {
    //         console.log("Options fetched successfully!");
    //     }).catch(error => {
    //         console.error("Error fetching options:", error);
    //     });
    // }, []);


    const getManualMusic = () => {
        try {
            const userRef = firestore().collection("Users").doc(userId);
            const manualMusicRef = userRef.collection("Manual_Music")

            manualMusicRef.onSnapshot(snapshot => {
                const updatedOption = snapshot.docs.map(doc => {
                    const musicData = doc.data();
                    return {
                        itemId: musicData.itemId,
                        song: musicData.song,
                        copyfilePath: musicData.copyfilePath,
                    };
                })

                setOptions(updatedOption);
            });
        } catch (error) {
            console.error("Error fetching data from Firestore:", error);
        }
    };



    useEffect(() => {
        getManualMusic()
        console.log("음원 데이터 가져오기")
    }, [])


    const handleMusicData = (uri, name, manualCopyfilePath) => {
        const newMusicName = name.replace('.mp3', '');
        // console.log("선택된 음원 이름: ", newMusicName)
        console.log("선택된 음원 경로:", uri);
        console.log("선택된 음원 이름: ", newMusicName)
        console.log("선택된 백업 경로", manualCopyfilePath)
        // console.log("선택된 음원 아티스트:", metaMusicArtist);
        addOption(manualCopyfilePath, newMusicName);
    };

    const addOption = async (manualCopyfilePath, newMusicName) => {
        console.log("path :", manualCopyfilePath)
        console.log("title :", newMusicName)

        try {
            const userRef = firestore().collection("Users").doc(userId);
            const manualMusicRef = userRef.collection("Manual_Music");

            // // 현재 manual_music 컬렉션의 크기 가져오기
            // const manualMusicSize = (await manualMusicRef.get()).size;
            //
            // // 새로운 아이템의 itemId 생성 (기존 문서 수 + 1)
            // const newItemId = manualMusicSize + 1;

            // Firestore에서 Manual_Music 컬렉션의 모든 문서를 가져옵니다.
            const snapshot = await manualMusicRef.get();

            // 현재 있는 모든 문서들의 itemId를 배열로 만듭니다.
            const existingItemIds = snapshot.docs.map(doc => doc.data().itemId);

            // 비어 있는 itemId를 찾습니다.
            let newItemId = 1;
            while (existingItemIds.includes(newItemId)) {
                newItemId++;
            }

            // 새로운 옵션 객체 생성
            const newOption = {
                itemId: newItemId,
                copyfilePath: manualCopyfilePath,
                song: newMusicName,
                // artist: metaMusicArtist,
            };

            // options 상태 업데이트
            setOptions([...options, newOption]);

            // firestore에 새로운 문서 추가
            await manualMusicRef.add({
                song: newMusicName,
                copyfilePath: manualCopyfilePath,
                itemId: newItemId,
                time: serverTimestamp(),
            });

            console.log('New option added successfully:', newOption);
        } catch (error) {
            console.error('Error adding new option:', error);
        }
    };


    // const removeOption2 = (valueToRemove) => {
    //     const updatedOptions = options.filter(option => option.label !== valueToRemove);
    //     setOptions(updatedOptions);
    //
    //     // AsyncStorage에서도 해당 옵션을 제거합니다.
    //     AsyncStorage.setItem('options', JSON.stringify(updatedOptions)).then(() => {
    //         console.log("Option removed and updated successfully!");
    //
    //         // 제거된 항목이 있을 때마다 options 배열의 길이를 갱신합니다.
    //         setMusic(updatedOptions.length.toString());
    //     }).catch(error => {
    //         console.error("Error removing and updating option:", error);
    //     });
    // };

    const removeOption = async (valueToRemove) => {
        console.log("음원 삭제 버튼이 클릭 되었습니다.")
        await TrackPlayer.pause();

        try {
            const userRef = firestore().collection("Users").doc(userId);
            const manualMusicRef = userRef.collection("Manual_Music");
            const querySnapshot = await manualMusicRef.where("itemId", '==', valueToRemove).get();

            querySnapshot.forEach(doc => {
                doc.ref.delete();
                console.log("선택한 음원 삭제")
            });
        } catch (error) {
            console.error("Error removing document: ", error)
        }
    };


    // useEffect(() => {
    //     console.log('Options updated:', options);
    // }, [options]);


    const removeMusicAlert = (valueToRemove) => {
        const optionToRemove = options.find(option => option.itemId === valueToRemove);
        Alert.alert(
            '음원 삭제',
            `"${optionToRemove.song}"을 삭제하시겠습니까?`,
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


    const handleMusicChange = async (radioId) => {
        console.log("radio num:", radioId)
        setMusicItemId(radioId)

        try {
            // Firestore에서 선택된 음악 데이터 가져오기
            const userRef = firestore().collection("Users").doc(userId);
            const selectedMusicRef = userRef.collection("Manual_Music");
            const musicSnapshot = await selectedMusicRef.where("itemId", '==', radioId).get();

            if (!musicSnapshot.empty) {
                // 선택된 음악 데이터가 존재하는 경우
                const musicData = musicSnapshot.docs[0].data();
                const selectedSong = musicData.song;
                const selectedUri = musicData.copyfilePath;
                console.log("Selected song:", selectedSong);
                console.log("Selected song URI:", selectedUri);

                // 선택된 음악을 TrackPlayer에 추가하고 재생
                await TrackPlayer.reset(); // 재생 목록 초기화
                await TrackPlayer.add({
                    title: selectedSong,
                    url: selectedUri,
                });
                await TrackPlayer.play(); // 음원 재생

            } else {
                // 선택된 음악 데이터가 없는 경우
                console.error('Selected music data not found for itemId:', radioId);
            }
        } catch (error) {
            console.error('Error updating selected music:', error);
        }
    };

    const {sendMotorStopPacket} = useBLE()

    const handleMusicPause = async () => {
        await TrackPlayer.pause();
        await sendMotorStopPacket();
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
                <Radio.Group name="myRadioGroup" colorScheme={"blue"} value={musicItemId} onChange={handleMusicChange}>

                    <ScrollView showsVerticalScrollIndicator style={{height: optionsLength > 6 ? 170 : 'auto', width: "100%"}}>
                    {options.map(option => (
                        <Radio key={option.itemId} value={option.itemId} size={"sm"} marginY={1} justifyContent={"space-between"}>
                            <TouchableOpacity onLongPress={() => removeMusicAlert(option.itemId)} >
                                <Text>{option.song !== undefined && option.song !== "" ? option.song : "알수없음"}</Text>

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
