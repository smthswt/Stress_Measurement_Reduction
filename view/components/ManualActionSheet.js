import {Actionsheet, Box, Button, HStack, Pressable, Text, useDisclose, View, VStack} from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import React, {useCallback, useEffect, useRef, useState} from "react";
import AntDesign from "react-native-vector-icons/AntDesign";
import DocumentPicker, {types} from 'react-native-document-picker'
import axios from "axios";
import {Alert, Platform} from "react-native";
import {parseStream} from "music-metadata";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getAll, getAlbums, searchSongs, SortSongFields, SortSongOrder } from 'react-native-get-music-files';
import {check, PERMISSIONS, request, requestMultiple, RESULTS} from "react-native-permissions";


const ManualActionSheet  = ({onOpen, onClose, isOpen, MusicName}) => {
    const [fileSelected, setFileSelected] = useState(false);
    const [fileName, setFileName] = useState("")
    const [audioFile, setAudioFile] = useState();
    const [audioSize, setAudioSize] = useState()
    const [manualMusicMetaData, setManualMusicMetaData] = useState([]);


    const handleMp3FilePicker = useCallback(async () => {
        console.log("핸드폰 내 Mp3 파일 찾기")
        try {
            const fileResponse = await DocumentPicker.pickSingle({
                presentationStyle: 'fullScreen',
                type: [types.images, types.audio]
            });
            setFileSelected(true);
            console.log('파일이 선택되었습니다.')
            console.log("파일 정보:", fileResponse)
            setAudioFile(fileResponse)

            console.log("음원 이름: ", fileResponse.name);
            setFileName(fileResponse.name);

            const sizeInMB = fileResponse.size / 1024**2;
            console.log("파일 용량: ", sizeInMB)
            setAudioSize(sizeInMB)

        } catch (error) {
            if (DocumentPicker.isCancel(error)) {
                console.log('파일 선택이 취소되었습니다.')
            } else {
                console.log("에러 :", error);
            }
        }
    }, []);

    // const audioSize2MB = audioSize.toFixed(2);
    const audioSize2MB = audioSize;
    const fileFullName = fileName.split('.')[0]



    //음원 파일 저장
    const handleUploadMusic = async () => {
        console.log("선택한 파일을 업로드합니다...")
        try {
            const {fileCopyUri, name, size, type, uri} = audioFile;
            const dataToStore = { fileCopyUri, name, size, type, uri };
            const jsonValue = JSON.stringify(dataToStore);
            await AsyncStorage.setItem('manualmusic', jsonValue)
            setFileSelected(false);
            console.log("저장된 내용: ", jsonValue)
            console.log("선택한 음원 파일이 저장되었습니다.")

            const getJsonValue = await AsyncStorage.getItem('manualmusic');
            const parseData = JSON.parse(getJsonValue)
            const musicName = parseData.name

            console.log("전체 데이터: ", parseData)
            console.log("데이터가 정상적으로 불러와졌습니다.");

            MusicName(musicName)
            // AsyncStorage에 음원 이름만 저장
            await AsyncStorage.setItem('selectedMusicName', musicName);
            // return jsonValue != null ? parseData : "불러올 데이터가 없습니다.";

            onClose();
        } catch (error) {
            console.error("에러: ", error)
            Alert.alert("실패: ", "음원 파일 업로드 실패, \n 다시 시도해주세요." )
        }
    };


    const handleOnClose = () => {
        console.log("닫기")
        setFileSelected(false);
        onClose();
    }

    // const requestMediaPermissions = async () => {
    //     if (Platform.OS === 'android') {
    //         let hasPermission =
    //             (await check(PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE)) ===
    //             RESULTS.GRANTED || (await check(PERMISSIONS.ANDROID.READ_MEDIA_AUDIO)) ===
    //             RESULTS.GRANTED;
    //
    //         if (!hasPermission) {
    //             hasPermission = await requestMultiple([
    //                 PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    //                 PERMISSIONS.ANDROID.READ_MEDIA_AUDIO,
    //             ]);
    //         }
    //
    //         return hasPermission;
    //     }
    //
    //     if (Platform.OS === 'ios') {
    //         let hasPermission =
    //             (await check(PERMISSIONS.IOS.MEDIA_LIBRARY)) === RESULTS.GRANTED;
    //         if (!hasPermission) {
    //             hasPermission =
    //                 (await request(PERMISSIONS.IOS.MEDIA_LIBRARY)) === RESULTS.GRANTED;
    //         }
    //
    //         return hasPermission;
    //     }
    //
    //     return false;
    // };

    // const test = async () => {
    //     // const permissions = await requestMediaPermissions();
    //     // if (permissions) {
    //         const songsResults = await getAll({
    //             limit: 20,
    //             offset: 0,
    //             // coverQuality: 50,
    //             minSongDuration: 1000,
    //             sortOrder: SortSongOrder.DESC,
    //             sortBy: SortSongFields.TITLE,
    //         })
    //         // console.log("Permission pass")
    //         if (typeof songsResults === 'string') {
    //             console.log("Song Results === string")
    //             return;
    //         }
    //         setManualMusicMetaData(songsResults);
    //         console.log("메타 데이터: ", songsResults)
    //     // }
    // };
    //
    // useEffect(() => {
    //     test();
    // }, []);
    //
    // const render = () => {
    //     if (manualMusicMetaData?.length === 0) {
    //         return <Text>No items</Text>;
    //     }
    //
    //     return manualMusicMetaData?.map((song) => (
    //         <View key={song.url}>
    //             <Image
    //                 source={{
    //                     uri: song.cover,
    //                 }}
    //                 resizeMode="cover"
    //                 style={{
    //                     width: 150,
    //                     height: 150,
    //                 }}
    //             />
    //             {/*<Text style={styles.text}>Album: {song.album}</Text>*/}
    //             <Text style={styles.text}>Artist: {song.artist}</Text>
    //             <Text style={styles.text}>Title: {song.title}</Text>
    //             <Text style={styles.text}>Duration(ms): {song.duration}</Text>
    //             {/*<Text style={styles.text}>Genre: {song.genre}</Text>*/}
    //             {/*<Text style={styles.text}>FileUrl: {song.url}</Text>*/}
    //         </View>
    //     ));
    // };
    //
    // console.log("메타 데이터: ", test())


    return(

        <Actionsheet isOpen={isOpen} onClose={handleOnClose} hideDragIndicator>

            <Actionsheet.Content paddingBottom={5} paddingTop={4} justifyContent={"center"} alignItems={"center"} >
                    <Box w="100%" h={60} marginTop={1} marginBottom={5} justifyContent="center" alignItems={"center"}>
                        {(fileSelected) ?
                            <>
                                <Text fontSize={18} color="black" fontWeight={"bold"} lineHeight={32}>
                                    음원 파일이 선택되었습니다.
                                </Text>
                            </>
                            :
                            <>
                            <Text fontSize={18} color="black" fontWeight={"bold"} lineHeight={32}>
                                핸드폰 내 음원(.mp3)
                            </Text>
                            <Text fontSize={18} color="black" fontWeight={"bold"}>
                                파일을 선택해주세요.
                            </Text>
                            </>
                        }
                    </Box>


                {(fileSelected) ?
                <Box display={'flex'} flexDir={"row"} justifyContent={'space-between'} alignItems={'center'}
                     width={"320px"} height={'119px'} py={4} px={4} borderWidth={1} borderRadius={3} backgroundColor={'#F5F5F6'} borderColor={'#E6E6E7'}>
                    <MaterialCommunityIcons name={"folder"} size={22} color={"#FFC431"} style={{padding: 2}}/>
                    <Box width={'230px'} height={'auto'}>
                    <Text style={{fontSize: 14, fontWeight: 500, color:'#616161'}}>{fileFullName.length > 40 ? '"' + fileFullName.substring(0, 30) + '...' + '"\n'  : '"' + fileFullName + '"\n'}</Text>

                        <Text style={{fontSize: 12, fontWeight: 500, color:'#ADADAD'}}>{audioSize2MB}MB
                        </Text>
                    </Box>
                </Box>
                    :
                <Pressable
                        onPress={handleMp3FilePicker}
                        width={"92%"}
                        alignItems={'center'}
                        justifyContent={'center'}
                        bg={(props) =>
                            props.isPressed ? "blue.200" : props.isHovered ? "blue.100" : "blue.50"}>
                        {({ isPressed, isHovered }) => (
                            <HStack p={1} justifyContent="center" alignItems={"center"} marginTop={2}
                                    bgColor={"#F5F5F6"} marginBottom={1} borderColor={"#E6E6E7"} borderRadius={3}
                                    borderWidth={1} height={"120px"} width={"100%"}
                                    style={{
                                        transform: [{ scale: isPressed ? 0.95 : isHovered ? 1.05 : 1 }],
                                        transition: "transform 0.2s",
                                    }}>
                                <Box mr={2} p={1} style={{ borderWidth: 1.5, borderColor: '#ADADAD',
                                    borderRadius: 3, borderStyle: 'dashed', }}>
                                    <AntDesign name={"plus"} color={"#ADADAD"} size={26} />
                                </Box>
                                <Text marginLeft={2} fontSize={"14px"} color={'#616161'}>
                                    여기를 눌러 파일을 선택해주세요.
                                </Text>
                            </HStack>
                        )}
                    </Pressable>
                }

                    <VStack width={"92%"} marginTop={8}>
                        <Button size={"lg"} bg={"#2785F4"} onPress={handleUploadMusic}>
                            <Text fontWeight={800} fontSize={'18px'} color={"white"}>업로드 하기</Text>
                        </Button>
                    </VStack>

            </Actionsheet.Content>

        </Actionsheet>
    )
};

export default ManualActionSheet;

