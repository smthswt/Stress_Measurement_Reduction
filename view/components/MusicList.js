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
import React, {useState} from "react";
import Music_ActionSheet from "./MusicActionSheet";
import {TouchableOpacity} from "react-native";


export const MusicList = () => {
    const { isOpen, onOpen, onClose } = useDisclose();
    const [selectedItemId, setSelectedItemId] = useState("");
    const [fileExist, setFileExist] =useState(false)

    const music_icon = <Ionicons name="musical-notes-sharp" size={22} color={"#59BCFF"} />
    const folderMusic_icon = <MaterialCommunityIcons name={"folder"} size={22} color={"#FFC431"} />


    const data = [{
        id: "song number 1",
        musicType : music_icon,
        stressLevel : 1,
        Song : "Air on the G String",
        Artist : "J.S Bach",
    }, {
        id: "song number 2",
        musicType : music_icon,
        stressLevel : 2,
        Song : "Memories",
        Artist : "Maroon",
    }, {
        id: "song number 3",
        musicType : music_icon,
        stressLevel : 3,
        Song : "Rolling in the Deep",
        Artist : "Adele",
    }, {
        id: "song number 4",
        musicType : folderMusic_icon,
        stressLevel : 4,
        Song : "All I Want for Christmas Is You",
        Artist : "Mariah Carey",
    },
    ];

    const openMusicActionSheet = (itemId) => {
        setSelectedItemId(itemId);
        onOpen();
    };
    console.log("선택된 data id: ", selectedItemId);

    const handleMusicData = (name, uri, artist) => {
        console.log("name: ", name)
        console.log("uri: ", uri)
        console.log("artist: ", artist)
        console.log("음원 이름, 주소, 아티스트 정보가 전달되었습니다.")
    }

    const handleClickMusic = (musicTitle, musicArtist) => {
        console.log("노래가 클릭되었습니다.", musicArtist, "-", musicTitle)
    }

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
                                              {(fileExist) ?
                                              <Text color={"#616161"}>{item.Artist} - {item.Song}</Text>
                                                  :
                                                  <Text color={"#616161"}>--</Text>
                                              }
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
                />
            )}
        </VStack>

    );
};

