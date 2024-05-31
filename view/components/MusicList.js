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
    const [currentPlayingId, setCurrentPlayingId] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false)

    const {userId} = useContext(UserContext)
    // console.log("전역 userId:", userId) //전역관리


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
        {
            id: "song number 5",
            // musicType: folderMusic_icon,
            stressLevel: 5,
            // Artist: "Mariah Carey",
            Song: "",
            Url: ""
        },
    ]);


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


    //노래 정보 저장
    const handleMusicData = async (name, uri, copyfilePath) => {
        const newMusicName = name.replace('.mp3', '');
        console.log("name: ", newMusicName);
        console.log("uri: ", uri);
        console.log("copyfilePath: ", copyfilePath);

        try {

            const userRef = firestore().collection("Users").doc(userId);
            const aiMusicRef = userRef.collection("AI_Music");

            // 이미 같은 itemId를 가진 문서가 있는지 확인
            const querySnapshot = await aiMusicRef.where("itemId", "==", selectedItemId).get();

            if (!querySnapshot.empty) {
                // 이미 존재하는 문서가 있을 경우 해당 문서를 업데이트
                querySnapshot.forEach(doc => {
                    doc.ref.update({
                        song: newMusicName,
                        copyfilePath: copyfilePath,
                    });
                    console.log("기존에 있던 음악 데이터 업데이트 완료.");
                });
            } else {
                // 같은 itemId를 가진 문서가 없을 경우 새로운 문서 추가
                const aiMusicDoc = await aiMusicRef.add({
                    song: newMusicName,
                    copyfilePath: copyfilePath,
                    itemId: selectedItemId
                });

                console.log('New music file added successfully!');
                console.log("새로운 음원 파일 경로 저장 완료.");
            }
        } catch (error) {
            console.error("Error updating music data:", error);
        }
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
            console.log("itemid :", itemId);
            const userRef = firestore().collection("Users").doc(userId);
            const selectedMusicRef = userRef.collection("AI_Music");
            const musicSnapshot = await selectedMusicRef.where("itemId", '==', itemId).get();

            // Promise 배열 생성
            const promises = musicSnapshot.docs.map(async doc => {
                // 문서의 데이터를 콘솔에 출력
                console.log("data :", doc.data());

                const selectedSong = doc.data().song;
                const selectedUri = doc.data().copyfilePath;
                console.log("Song :", selectedSong);
                console.log("Uri :", selectedUri);

                // 음원이 선택되면 음원을 재생합니다.
                if (selectedUri) {
                    // 현재 재생 중인 음악이 선택된 음악과 동일한 경우, 일시 중지합니다.
                    if (currentPlayingId === itemId) {
                        await TrackPlayer.pause();
                        setCurrentPlayingId(null);
                        setIsPlaying(false);
                    } else {
                        // 다른 음악을 재생합니다.
                        if (currentPlayingId) {
                            await TrackPlayer.pause();
                            setIsPlaying(false);
                        }
                        console.log("음원 재생 시작");
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
                    // 선택된 음악에 대한 음원이 없는 경우 경고를 표시합니다.
                    console.log("음원이 없습니다.");
                    Alert.alert("음원이 없습니다.", ".mp3 음원을 업로드 해주세요.");
                }
            });
            console.log('>>>>>>>')
            // 모든 비동기 작업을 병렬로 실행
            await Promise.all(promises);
        } catch (error) {
            console.log("에러 발생");
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
