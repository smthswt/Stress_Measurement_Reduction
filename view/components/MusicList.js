import {
    Button,
    Center,
    HStack,
    Text,
    useDisclose,
    View,
    VStack,
    FlatList, Pressable
} from "native-base";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import React, {useState, useEffect, useContext} from "react";
import Music_ActionSheet from "./MusicActionSheet";
import {Alert, TouchableOpacity} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TrackPlayer from "react-native-track-player";
import {UserContext} from "../module/UserProvider";
import firestore from "@react-native-firebase/firestore";


export const MusicList = () => {
    const { isOpen, onOpen, onClose } = useDisclose();
    const [selectedItemId, setSelectedItemId] = useState("");
    const [fileExist, setFileExist] =useState(false)
    const [currentPlayingId, setCurrentPlayingId] = useState(null);
    const [selectedSongID, setSelectedSongID] = useState()
    const [isPlaying, setIsPlaying] = useState(false)


    const music_icon = <Ionicons name="musical-notes-sharp" size={22} color={"#59BCFF"} />
    // const folderMusic_icon = <MaterialCommunityIcons name={"folder"} size={22} color={"#FFC431"} />

    const [data, setData] = useState([
        {
            id: "song number 1",
            // musicType: music_icon,
            stressLevel: 1,
            // Artist: "J.S Bach",
            Song: "",
            Url: ""
        },
        {
            id: "song number 2",
            // musicType: music_icon,
            stressLevel: 2,
            // Artist: "Maroon",
            Song: "",
            Url: ""
        },
        {
            id: "song number 3",
            // musicType: music_icon,
            stressLevel: 3,
            // Artist: "Adele",
            Song: "",
            Url: ""
        },
        {
            id: "song number 4",
            // musicType: folderMusic_icon,
            stressLevel: 4,
            // Artist: "Mariah Carey",
            Song: "",
            Url: ""
        },
    ]);


    // //로컬 스토리지에서 데이터를 가져와서 data 상태를 업데이트합니다.
    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const storedData = await AsyncStorage.getItem("AImusicData");
    //             console.log("데이터가 성공적으로 가져와졌습니다1:", JSON.parse(storedData))
    //             if (storedData !== null) {
    //                 // const newestData = JSON.parse(storedData);
    //                 setData(JSON.parse(storedData));
    //                 console.log("데이터가 성공적으로 가져와졌습니다:", (data))
    //                 // console.log("데이터가 성공적으로 가져와졌습니다:", data)
    //             }
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //         }
    //     };
    //
    //     fetchData().then(() => {
    //         console.log('Data fetched successfully',);
    //     }).catch(error => {
    //         console.error('Error fetching data:', error);
    //     });
    // }, []);


    //노래 정보 가져오기
    const getMusicData = () => {
        try {
            const userRef = firestore().collection("Users").doc(userId);
            const aiMusicRef = userRef.collection("AI_Music");

            // 실시간으로 데이터베이스 변경 사항을 감지
            aiMusicRef.onSnapshot(snapshot => {
                const updatedData = data.map(item => {
                    const musicData = snapshot.docs.find(doc => doc.data().itemId === item.id);
                    if (musicData) {
                        const { song, copyfilePath } = musicData.data();
                        return { ...item, Song: song, Url: copyfilePath };
                    } else {
                        return item;
                    }
                });

                setData(updatedData);
            });
        } catch (error) {
            console.error("Error fetching data from Firestore:", error);
        }
    };

    useEffect(() => {
        getMusicData();
    }, []);



    const openMusicActionSheet = (itemId) => {
        setSelectedItemId(itemId);
        onOpen();
    };


    const {userId} = useContext(UserContext)
    // console.log("전역 userId:", userId) //전역관리

    //노래 정보 저장
    const handleMusicData = async (name, uri, copyfilePath) => {
        const newMusicName = name.replace('.mp3', '');
        console.log("name: ", newMusicName)
        console.log("uri: ", uri)
        console.log("copyfilePath: ", copyfilePath)


            console.log("음원 이름, 주소 정보가 업데이트되었습니다.");

            // AsyncStorage에 업데이트된 데이터를 저장합니다.
            // await AsyncStorage.setItem("AImusicData", JSON.stringify(updatedData));

            //firebase 에 저장.
            const userRef = await firestore().collection("Users");
            const aiMusicRef = await userRef.doc(userId).collection("AI_Music");

            const aiMusicDoc = await aiMusicRef.add({
                song: newMusicName,
                copyfilePath: copyfilePath,
                itemId: selectedItemId
            });

            console.log('music file added successfully!');
            console.log("음원 파일 경로 저장 완료.");
    };


    //노래 데이터 초기화, 삭제
    const handleInitialSelectedMusic = async () => {
        console.log("설정 초기화 버튼 클릭");

        try {
            const userRef = firestore().collection("Users").doc(userId);
            const aiMusicRef = userRef.collection("AI_Music");
            const querySnapshot = await aiMusicRef.where("itemId", '==', selectedItemId).get();

            querySnapshot.forEach(doc => {
                doc.ref.delete();
                setIsPlaying(false)
                console.log("선택한 노래 삭제");
            });
        } catch (error) {
            console.error("Error removing document: ", error);
        }


    };

    // console.log('------------------')


    // 노래 재생 및 일시정지
    const handleClickMusic = async (newMusicName, musicArtist, itemId) => {
        try {
            const selectedMusic = data.find(item => item.id === itemId);
            const selectedUri = selectedMusic.Url;
            const selectedSong = selectedMusic.Song;

            console.log("Selected SONG:", selectedSong);
            console.log("Selected URI:", selectedUri);

            if (selectedUri) {
                if (currentPlayingId === itemId) {
                    await TrackPlayer.pause();
                    setCurrentPlayingId(null);
                    setIsPlaying(false);
                } else {
                    if (currentPlayingId) {
                        await TrackPlayer.pause();
                        setIsPlaying(false);
                    }
                    console.log("음원 재생 시작")
                    await TrackPlayer.reset();
                    await TrackPlayer.add({
                        url: selectedUri,
                        title: selectedSong,
                    });
                    await TrackPlayer.play();
                    setCurrentPlayingId(itemId);
                    setIsPlaying(true);
                    console.log("Music playing...");
                }
            } else {
                Alert.alert("음원이 없습니다.", ".mp3 음원을 업로드 해주세요.");
            }
        } catch (error) {
            console.error("Error fetching data from Firestore:", error);
        }
    };




    const closeMusicActionSheet = () => {
        setSelectedItemId("");
        onClose();
    };


    return (
        // <ScrollView contentContainerStyle={{justifyContent: "center", alignItems: 'center', padding: 20}}>
        <VStack p={5} flex={1}>

            <View width={"100%"} shadow={2} backgroundColor={'white'}>
                <FlatList showsVerticalScrollIndicator={false}
                          data={data}
                          keyExtractor={(item) => item.id}
                          renderItem={({item}) => (

                              <TouchableOpacity activeOpacity={0.8} onPress={() => handleClickMusic(item.Song, item.Artist, item.id, item.Url)}>
                                  <Center flex={1} backgroundColor={'white'} paddingY={2} paddingX={1}>
                                      <HStack justifyContent={"space-between"} width={"94%"} marginY={1}>

                                          <HStack space={6} margin={2} width={"70%"} alignItems={"center"} justifyContent={'flex-start'}>
                                              {/*{item.musicType}*/}
                                              {music_icon}
                                              <VStack space={1.5} alignItems={'flex-start'} justifyContent={'center'}>
                                                  <Text bold fontSize={'md'} color={"#222222"}>스트레스 레벨 {item.stressLevel}</Text>

                                                  <Text
                                                      style={{
                                                          color: (isPlaying && currentPlayingId === item.id) ? "black" : "#616161", fontWeight: (isPlaying && currentPlayingId === item.id) ? "500" : "400"}}>
                                                      {item.Song ? (item.Song.length > 25 ? item.Song.substring(0, 23) + "..." : item.Song) : "등록된 음원이 없습니다"}
                                                  </Text>

                                              </VStack>
                                          </HStack>

                                          <Button variant={"unstyled"} onPress={() => openMusicActionSheet(item.id)}>
                                              <View width={"100%"} borderWidth={1} borderRadius={30} borderColor={"#59BCFF"} padding={1.5}>
                                                  <MaterialIcons name={"edit"} size={20} color={"#2785F4"}/>
                                              </View>
                                              {/*<Music_ActionSheet onOpen={onOpen} onClose={onClose} isOpen={isOpen} data={item}/>*/}
                                          </Button>

                                      </HStack>
                                  </Center>
                              </TouchableOpacity>

                          )}/>
            </View>
            {isOpen && selectedItemId && (
                <Music_ActionSheet
                    onOpen={onOpen}
                    onClose={closeMusicActionSheet}
                    isOpen={isOpen}
                    MusicData={handleMusicData}
                    data={data.find((item) => item.id === selectedItemId)}
                    url={data.find((item) => item.id === selectedItemId).url}
                    handleInitialSelectedMusic={handleInitialSelectedMusic}
                />
            )}
            {/*<Text>{JSON.stringify(data)}</Text>*/}
        </VStack>

    );
};
