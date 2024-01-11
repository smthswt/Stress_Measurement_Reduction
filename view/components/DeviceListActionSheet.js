import {Actionsheet, Box, Button, HStack, Pressable, Text, useDisclose, View, VStack} from "native-base";
import React, {useState} from "react";


const DeviceListActionSheet  = ({onOpen, onClose, isOpen}) => {

    const handleCancelConnection = () => {
        console.log("연결이 해제되었습니다")
        onClose();
    };

    const handleOnClose = () => {
        console.log("actionsheet close")
        onClose();
    };

    return(

        <Actionsheet isOpen={isOpen} onClose={handleOnClose} hideDragIndicator>

            <Actionsheet.Content paddingBottom={5} paddingTop={4} justifyContent={"center"} alignItems={"center"} >
                <VStack w="100%" h={60} px={4} justifyContent="center" alignItems={"center"}>
                    <Text fontSize={18} color="black" fontWeight={"bold"} lineHeight={32}>
                        디바이스 연결을
                    </Text>
                    <Text fontSize={18} color="black" fontWeight={"bold"}>
                        해제하시겠습니까?
                    </Text>
                </VStack>

                <Box marginY={6}>
                <Text color={"#EB5147"} fontSize={16}>연결 해제 이후 복원이 불가능합니다.</Text>
                </Box>
                
                {/*<Actionsheet.Item onPress={handleCancelConnection}>연결해제</Actionsheet.Item>*/}
                <Box width={"92%"} mb={2} mt={2}>
                    <Button onPress={handleCancelConnection} bg={"#2785F4"} size={"lg"}>
                        <Text fontWeight={"bold"} color={"white"} fontSize={18}>해제 하기</Text>
                    </Button>
                </Box>


            </Actionsheet.Content>

        </Actionsheet>
    )
};

export default DeviceListActionSheet;

