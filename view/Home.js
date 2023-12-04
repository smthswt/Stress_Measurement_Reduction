import {Avatar, Card} from "react-native-paper";
import {
    Button,
    Center,
    Container,
    Heading,
    Text,
    Stack,
    HStack,
    VStack,
    Progress,
    Box,
    Spacer,
    ScrollView
} from "native-base";
import {View} from "react-native";
import React from "react";

const LeftContent = props => <Avatar.Icon {...props} icon="folder"/>

const ItemComponent = () => (
    <Box borderRadius="sm" borderWidth={0} bgColor="blueGray.300" p={3}>
        <VStack>
            <Text fontWeight={'bold'}>2023/12/02</Text>
            <HStack w="100%" space={'3'} alignItems={'center'} justifyItems={'center'}>
                <Text w={"30%"}>BPM</Text>
                <Progress flex={1} colorScheme="secondary" shadow={2} value={65}/>
                <Text>20</Text>
            </HStack>
            <HStack w="100%" space={'3'} alignItems={'center'} justifyItems={'center'}>
                <Text w={"30%"}>Stress Level</Text>
                <Progress flex={1} shadow={2} value={45}/>
                <Text>20</Text>
            </HStack>
        </VStack>
    </Box>
);

const AnalysisResultItemComponent = () => (
    <Center>
        <Container>
            <Heading>2023/03/10</Heading>
            <Stack direction="column" mb="1.5" mt="1.5" space={1}>
                <Box w="100%">
                    <HStack space="md">
                        <Text>BPM</Text>
                        <Box w="100%">
                            <Progress w="100" shadow={2} value={45} mx="4"/>
                        </Box>
                        {/*<Progress colorScheme="primary" value={35} />*/}
                        {/*<Progress colorScheme="secondary" value={45} />*/}
                        {/*<Progress colorScheme="emerald" value={55} />*/}
                        {/*<Progress colorScheme="warning" value={65} />*/}
                        <Text>75</Text>
                    </HStack>
                </Box>
                <Box w="100%">
                    <HStack space="md">
                        <Text>Stress Level</Text>
                        <Progress w="60%" colorScheme="secondary" value={45}/>
                        <Text>75</Text>
                    </HStack>
                </Box>
                <Stack>
                    <Text>Stress Level</Text>
                </Stack>
            </Stack>
        </Container>
    </Center>
);

const MyComponent = () => (
    <Card type={'contained'}>
        <Card.Title title="Card Title" subtitle="Card Subtitle" left={LeftContent}/>
        <Card.Content>
            <Text variant="titleLarge">Card title</Text>
            <Text variant="bodyMedium">Card content</Text>
        </Card.Content>
        <Card.Cover source={{uri: 'https://picsum.photos/700'}}/>
        <Card.Actions>
            <Button>Cancel</Button>
            <Button>Ok</Button>
        </Card.Actions>
    </Card>
);

export const HomeScreen = ({navigation}) => (
    <View>
        <ScrollView>
            {/*<MyComponent/>*/}
            {/*<Button>측정시작</Button>*/}
            <VStack space={1} m={2}>
                <Text fontWeight={'bold'}>최근 측정 데이터 비교</Text>
                <ItemComponent/>
                <ItemComponent/>
                <ItemComponent/>
            </VStack>
        </ScrollView>
        <Button onPress={() => navigation.navigate('Details')}>Go to Details</Button>
    </View>
);