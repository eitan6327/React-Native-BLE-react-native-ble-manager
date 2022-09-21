import React from "react";
import { Text, View, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native"
import Toaster from "../components/Toaster";
import { BleManager, connectDevice } from "../components/BleManager";
import { Buffer } from "buffer";

const DeviceActionScreen = function ({ route }) {

    const { deviceId, deviceName } = route.params
    const serviceId = "1800"
    const characId = "2a00"

    const readData = async function () {

        BleManager.isPeripheralConnected(deviceId, [])
            .then(async (isConnected) => {
                console.log(isConnected)
                if (!isConnected) {
                    console.log("Peripheral is NOT connected!");
                    Toaster("Peripheral not connected. Try reconnecting.")
                    return
                }
                await BleManager.read(deviceId, serviceId, characId)
                    .then((readData) => {
                        console.log("Read: " + readData);
                        const data = Buffer.from(readData).toString();
                        console.log(data)
                        Toaster("Data read successfully : " + data)
                        // const buffer = Buffer.Buffer.from(readData); //https://github.com/feross/buffer#convert-arraybuffer-to-buffer
                        // const sensorData = buffer.readUInt8(1, true);
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            });
    }

    // const notifyData = async function () {
    //     BleManager.startNotification(deviceId, serviceId, characId)
    //         .then(() => {
    //             console.log("Notification started");
    //             Toaster("Notification started")
    //         })
    //         .catch((error) => {
    //             console.log(error);
    //         });
    // }

    // const writeData = async function () {
    //     // Convert data to byte array before write/writeWithoutResponse
    //     // import { stringToBytes } from "convert-string";
    //     // const data = stringToBytes(yourStringData);

    //     BleManager.write(deviceId, serviceId, characId, data)
    //         .then(() => {
    //             // Success code
    //             console.log("Write: " + data);
    //         })
    //         .catch((error) => {
    //             // Failure code
    //             console.log(error);
    //         });
    // }


    const reconnect = async function () {

        BleManager.isPeripheralConnected(deviceId, [])
            .then(async (isConnected) => {
                console.log(isConnected)
                if (!isConnected) {
                    console.log("Peripheral is already connected!");
                    Toaster("Peripheral is already connected.")
                    return
                }
            });

        Toaster("Trying to reconnect with the device...Please wait..")
        const connection = await connectDevice(deviceId)
        if (connection) {
            Toaster("Reconnected with the device successfully")
        }
        else {
            Toaster("Some error occurred. Try again")
        }
    }

    const disconnect = async function () {
        Toaster("Disconnecting device...Please wait..")
        BleManager.disconnect(deviceId)
            .then(() => {
                console.log("Disconnected");
                Toaster("Device has been disconnected successfully")
            })
            .catch((error) => {
                console.log(error);
                Toaster(error)
            });
    }

    return (
        <View style={styling.header}>
            <View style={styling.avatarOutline} >
                <Image style={styling.avatar} source={require('../../assets/ble_connected.png')} />
            </View>

            <ScrollView style={{ marginTop: 180 }}>
                <View style={styling.body}>
                    <View style={styling.bodyContent}>
                        <Text style={styling.name}>{deviceId}</Text>
                        <Text style={styling.info}>{deviceName}</Text>

                        <View style={styling.buttonContainer}>
                            <TouchableOpacity style={styling.button} onPress={() => { readData() }}>
                                <Text style={styling.buttonText}>Read data</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styling.button} onPress={() => { }} >
                                <Text style={styling.buttonText}>Write data</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styling.button} onPress={() => { }} >
                                <Text style={styling.buttonText}>Notify</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styling.button2} onPress={() => { reconnect() }} >
                                <Text style={styling.buttonText}>Reconnect</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styling.button3} onPress={() => { disconnect() }} >
                                <Text style={styling.buttonText}>Disconnect</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>

        </View>
    )
}

const styling = StyleSheet.create({
    header: {
        flex: 1,
        backgroundColor: "white"
    },
    avatarOutline: {
        width: 120,
        height: 120,
        borderRadius: 73,
        borderWidth: 4,
        borderColor: "#19d219",
        alignSelf: 'center',
        position: 'absolute',
        marginTop: 30,
        padding: 65
    },
    avatar: {
        width: 120,
        height: 120,
        alignSelf: 'center',
        position: 'absolute',
        marginTop: 5
    },
    bodyContent: {
        flex: 1,
        alignItems: 'center'
    },
    name: {
        fontSize: 23,
        color: "black",
        fontWeight: "900"
    },
    info: {
        fontSize: 19,
        color: "black",
        marginTop: 5
    },
    buttonContainer: {
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 51,
    },
    button: {
        backgroundColor: '#0782F9',
        width: '100%',
        padding: 8,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10
    },
    button2: {
        backgroundColor: 'green',
        width: '100%',
        padding: 8,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 80
    },
    button3: {
        backgroundColor: 'red',
        width: '100%',
        padding: 8,
        borderRadius: 16,
        alignItems: 'center',
        marginTop: 10
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    }
})


export default DeviceActionScreen