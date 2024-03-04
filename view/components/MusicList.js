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
import React, {useState, useEffect} from "react";
import Music_ActionSheet from "./MusicActionSheet";
import {Alert, TouchableOpacity} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TrackPlayer from "react-native-track-player";


export const MusicList = () => {
    const { isOpen, onOpen, onClose } = useDisclose();
    const [selectedItemId, setSelectedItemId] = useState("");
    const [fileExist, setFileExist] =useState(false)
    const [currentPlayingId, setCurrentPlayingId] = useState(null);
    const [selectedSongID, setSelectedSongID] = useState()

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

    // 로컬 스토리지에서 데이터를 가져와서 data 상태를 업데이트합니다.
    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedData = await AsyncStorage.getItem("AImusicData");
                console.log("데이터가 성공적으로 가져와졌습니다1:", JSON.parse(storedData))
                if (storedData !== null) {
                    // const newestData = JSON.parse(storedData);
                    setData(JSON.parse(storedData));
                    console.log("데이터가 성공적으로 가져와졌습니다:", data)
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData().then(() => {
            console.log('Data fetched successfully',);
        }).catch(error => {
            console.error('Error fetching data:', error);
        });
    }, []);


    // 데이터 확인을 위한 로그 출력
    useEffect(() => {
        console.log("Received saved data:", data);
    }, [data]);


    const openMusicActionSheet = (itemId) => {
        setSelectedItemId(itemId);
        onOpen();
    };
    console.log("선택된 data id: ", selectedItemId);

    const handleMusicData = async (name, uri) => {
        const newMusicName = name.replace('.mp3', '');
        console.log("name: ", newMusicName)
        console.log("uri: ", uri)

        let temp = [];

        try {
            // 클릭된 음악의 id를 찾아서 해당 음악의 데이터를 업데이트합니다.
            const updatedData = data.map(item => {
                if (item.id === selectedItemId) {
                    // 새로운 객체를 생성하여 순환 참조를 방지합니다.
                    const updatedItem = { ...item };
                    updatedItem.Song = newMusicName;
                    updatedItem.Url = uri;
                    return updatedItem;
                }
                return item;
            });

            // 상태 업데이트
            setData(updatedData);
            console.log("Before save updatedData:", updatedData)

            console.log("음원 이름, 주소 정보가 업데이트되었습니다.");

            // AsyncStorage에 업데이트된 데이터를 저장합니다.
            await AsyncStorage.setItem("AImusicData", JSON.stringify(updatedData));
            console.log("Music data updated and saved successfully!");
        } catch (error) {
            console.error("Error updating and saving music data:", error);
        }
    };


    const handleInitialSelectedMusic = () => {
        console.log("설정 초기화 버튼 클릭");
        // 선택된 아이템의 ID를 가져옵니다.
        const itemId = selectedItemId;
        // 데이터를 복제하여 변경사항을 적용합니다.
        const updatedData = data.map(item => {
            if (item.id === itemId) {
                return {
                    ...item,
                    Song: "", // Song을 빈 문자열로 설정합니다.
                    Url: ""   // Url을 빈 문자열로 설정합니다.
                };
            }
            return item;
        });
        // 변경된 데이터로 상태를 업데이트합니다.
        setData(updatedData);
        // AsyncStorage에 업데이트된 데이터를 저장합니다.
        AsyncStorage.setItem("AImusicData", JSON.stringify(updatedData))
            .then(() => {
                console.log("음원 설정 초기화 완료");
                console.log("초기화된 데이터: ", data)
            })
            .catch(error => {
                console.error("음원 설정 초기화 실패:", error);
            });
    };



    const handleClickMusic = async (newMusicName, musicArtist, itemId, uri) => {
        console.log("노래가 클릭되었습니다.", newMusicName);
        console.log("selectedSongID", itemId)
        console.log("selected URl", uri)


        if (uri) {
            if (currentPlayingId === itemId) {
                await TrackPlayer.pause(); // 노래 일시정지
                setCurrentPlayingId(null); // 현재 재생 중인 ID 초기화
                console.log("currentPlayingId", currentPlayingId)
            } else {
                if (currentPlayingId) {
                    await TrackPlayer.pause(); // 현재 재생 중인 노래 정지
                }
                await TrackPlayer.reset(); // 재생 목록 초기화
                await TrackPlayer.add({
                    url: uri,
                    title: newMusicName,
                });
                await TrackPlayer.play(); // 음원 재생
                setCurrentPlayingId(itemId); // 현재 재생 중인 ID 설정
                console.log("currentPlayingId", currentPlayingId)
            }
        } else {
            // 노래가 없는 경우에는 알림 창을 표시
            Alert.alert("음원이 없습니다.", ".mp3 음원을 업로드 해주세요.");
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

                                              <Text color={"#616161"}>{item.Song ? (item.Song.length > 28 ? item.Song.substring(0, 26) + "..." : item.Song) : "등록된 음원이 없습니다"}
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
        </VStack>

    );
};

