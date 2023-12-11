import * as React from "react";
import {useFocusEffect, useNavigation, useRoute} from "@react-navigation/native";
import {Box, Center, HStack, Icon, Pressable, Text} from "native-base";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

/**
 * Represents the Footer component.
 *
 * @returns {React.Component} The Footer component.
 * @example
 * ```jsx
 * <Footer />
 * ```
 */
export const Footer = () => {

    /**
     * Retrieves the navigation object.
     *
     * @returns {Object} The navigation object.
     */
    const navigation = useNavigation();


    // const route = useRoute();
    /**
     * Represents the currently selected item.
     *
     * @typedef {Object} Selected
     * @property {String} item - The name of the selected item.
     * @property {Number} quantity - The quantity of the selected item.
     * @property {Boolean} isActive - Indicates whether the item is currently active or not.
     */
    const [selected, setSelected] = React.useState(0);


    useFocusEffect(
        React.useCallback(() => {
            const routeName = navigation.toString();
            switch (routeName) {
                case 'Home':
                    setSelected(0);
                    break;
                case 'Music':
                    setSelected(1);
                    break;
                case 'Calendar':
                    setSelected(2);
                    break;
                case 'Settings':
                    setSelected(3);
                    break;
                default:
                    setSelected(null); // 혹은 초기화하지 않음
                    break;
            }
        }, [navigation])
    );

    return (
        <Box bg="white" safeAreaBottom width="100%">
            <HStack bg="indigo.600" alignItems="center" safeAreaBottom shadow={6}>
                <Pressable cursor="pointer" opacity={selected === 0 ? 1 : 0.5} py="3" flex={1}
                           onPress={() => {
                               setSelected(0);
                               navigation.navigate('Home');
                           }}>
                    <Center>
                        {/*<Icon name="home" />*/}
                        <Icon mb="1" as={<MaterialCommunityIcons name={selected === 0 ? 'home' : 'home-outline'}/>}
                              color="white" size="sm"/>
                        <Text color="white" fontSize="12">
                            Home
                        </Text>
                    </Center>
                </Pressable>
                <Pressable cursor="pointer" opacity={selected === 1 ? 1 : 0.5} py="2" flex={1}
                           onPress={() => {
                               setSelected(1);
                               navigation.navigate('Music');
                           }}>
                    <Center>
                        <Icon mb="1" as={<MaterialCommunityIcons
                            name={selected === 0 ? 'folder-music' : 'folder-music-outline'}/>} color="white"
                              size="sm"/>
                        <Text color="white" fontSize="12">
                            Music
                        </Text>
                    </Center>
                </Pressable>
                <Pressable cursor="pointer" opacity={selected === 2 ? 1 : 0.6} py="2" flex={1}
                           onPress={() => {
                               setSelected(2);
                               navigation.navigate('Calendar');
                           }}>
                    <Center>
                        <Icon mb="1" as={<MaterialCommunityIcons
                            name={selected === 2 ? 'calendar-month' : 'calendar-month-outline'}/>}
                              color="white" size="sm"/>
                        <Text color="white" fontSize="12">
                            Calendar
                        </Text>
                    </Center>
                </Pressable>
                <Pressable cursor="pointer" opacity={selected === 3 ? 1 : 0.5} py="2" flex={1}
                           onPress={() => {
                               setSelected(3);
                               navigation.navigate('Settings');
                           }}>
                    <Center>
                        <Icon mb="1"
                              as={<MaterialCommunityIcons name={selected === 3 ? 'cog' : 'cog-outline'}/>}
                              color="white" size="sm"/>
                        <Text color="white" fontSize="12">
                            Settings
                        </Text>
                    </Center>
                </Pressable>
            </HStack>
        </Box>
    );
}