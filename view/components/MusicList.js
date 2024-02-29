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
import {TouchableOpacity} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";


export const MusicList = () => {
    const { isOpen, onOpen, onClose } = useDisclose();
    const [selectedItemId, setSelectedItemId] = useState("");
    const [fileExist, setFileExist] =useState(false)

    const music_icon = <Ionicons name="musical-notes-sharp" size={22} color={"#59BCFF"} />
    const folderMusic_icon = <MaterialCommunityIcons name={"folder"} size={22} color={"#FFC431"} />

    // 로컬 스토리지에서 데이터를 가져와서 data 상태를 업데이트합니다.
    useEffect(() => {
        const fetchData = async () => {
            try {
                const storedData = await AsyncStorage.getItem('musicData');
                console.log(storedData)
                if (storedData !== null) {
                    setData(JSON.parse(storedData));
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);


    // 데이터 확인을 위한 로그 출력
    useEffect(() => {
        console.log("Received data:", data);
    }, [data]);


    const [data, setData] = useState([
        {
            id: "song number 1",
            musicType: music_icon,
            stressLevel: 1,
            // Artist: "J.S Bach",
        },
        {
            id: "song number 2",
            musicType: music_icon,
            stressLevel: 2,
            // Artist: "Maroon",
        },
        {
            id: "song number 3",
            musicType: music_icon,
            stressLevel: 3,
            // Artist: "Adele",
        },
        {
            id: "song number 4",
            musicType: folderMusic_icon,
            stressLevel: 4,
            // Artist: "Mariah Carey",
        },
    ]);


    const openMusicActionSheet = (itemId) => {
        setSelectedItemId(itemId);
        onOpen();
    };
    console.log("선택된 data id: ", selectedItemId);

    const handleMusicData = async (name, uri) => {
        const newMusicName = name.replace('.mp3', '');
        console.log("name: ", newMusicName)
        console.log("uri: ", uri)
        // console.log("name: ", metaMusicTitleAI)
        // console.log("artist: ", metaMusicArtistAI)

        // 클릭된 음악의 id를 찾아서 해당 음악의 데이터를 업데이트합니다.
        const updatedData = data.map(item => {
            if (item.id === selectedItemId) {
                return {
                    ...item,
                    Song: newMusicName,
                    Url: uri,
                };
            }
            return item;
        });

        // 상태 업데이트
        setData(updatedData);

        handleClickMusic(newMusicName, '', uri);

        console.log("음원 이름, 주소 정보가 업데이트되었습니다.")
        
                // AsyncStorage에 업데이트된 데이터를 저장합니다.
            AsyncStorage.setItem('musicData', JSON.stringify(updatedData))
            .then(() => {
                console.log("Music data updated and saved successfully!");
            })
            .catch(error => {
                console.error("Error updating and saving music data:", error);
            });

        }

    const handleClickMusic = async (musicTitle, musicArtist, uri) => {
        console.log("노래가 클릭되었습니다.", musicTitle)
        console.log(url)
        if (url) {
            await TrackPlayer.reset(); // 재생 목록 초기화
            await TrackPlayer.add({
                Song: musicTitle,
                url: uri,
            });
            await TrackPlayer.play(); // 음원 재생
        } else {
            console.log("Error: URL is undefined.");
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

                              <TouchableOpacity activeOpacity={0.8} onPress={() => handleClickMusic(item.Song, item.Artist)}>
                              <Center flex={1} backgroundColor={'white'} paddingY={2} paddingX={1}>
                                  <HStack justifyContent={"space-between"} width={"94%"} marginY={1}>

                                      <HStack space={6} margin={2} width={"70%"} alignItems={"center"} justifyContent={'flex-start'}>
                                          {item.musicType}
                                          <VStack space={1.5} alignItems={'flex-start'} justifyContent={'center'}>
                                              <Text bold fontSize={'md'} color={"#222222"}>스트레스 레벨 {item.stressLevel}</Text>
                                            
                                              <Text color={"#616161"}>{item.Song}</Text>
                                            
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
                    url={data.find((item) => item.id === selectedItemId).Url}
                />
            )}
        </VStack>

    );
};

