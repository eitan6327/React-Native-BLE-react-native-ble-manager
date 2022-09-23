import React, { useEffect, useState } from 'react';
import { TouchableOpacity, PermissionsAndroid, View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import Toaster from '../components/Toaster';
import { BleManager, connectDevice } from '../components/BleManager';

const ListBleDevicesScreen = function App({ navigation }) {

    const [buttonTextState, setButtonTextState] = useState('Start Scanning')
    const [deviceList, setDeviceList] = useState([])
    const [isScanning, setIsScanning] = useState(false)
    const [isConnecting, setIsConnecting] = useState(false)

    useEffect(()=>{requestLocationPermission(), []})

    const requestLocationPermission = async function () {

        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Permission Localisation Bluetooth',
                message: 'Requirement for Bluetooth',
                buttonNeutral: 'Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Permission Granted. Try scanning again el');
        } else {
          console.log('Permission denied');
        }

        const granted_b = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
          {
            title: 'Permission Scanning Bluetooth',
            message: 'Requirement for Bluetooth',
            buttonNeutral: 'Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (granted_b === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Permission Granted. Try scanning again el 2');
        } else {
          console.log('Permission denied 2');
        }

        const granted_c = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          {
            title: 'Permission Connect Bluetooth',
            message: 'Requirement for Bluetooth',
            buttonNeutral: 'Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );

        if (granted_c === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Permission Granted. Try scanning again el 3');
        } else {
          console.log('Permission denied 3');
        }
    }

    const checkScanState = async () => {

        if (buttonTextState === 'Start Scanning') {
            setIsScanning(true)
            startScan()
            console.log("Scanning started")
            setButtonTextState("Stop Scanning")
        }
        else {
            stopScan()
        }
    }

    const startScan = async function () {

        deviceList.length = 0
        await BleManager.scan([], 5, true)
            .then(() => {
                console.log('Scan started');
            })
            .catch((error) => {
                console.log(error)
                Toaster(error)
            });
    }

    const stopScan = async function () {

        await BleManager.stopScan()
            .then(() => {
                console.log('Scan stopped');
            });

        await BleManager.getDiscoveredPeripherals()
            .then((peripheralsArray) => {
                //const list = peripheralsArray.map(item => item.id);
                //console.log(peripheralsArray);
                setDeviceList(peripheralsArray)
                if(peripheralsArray.length < 1)
                    Toaster("No BLE devices found. Please check if BLE and location are turned on. Also check if location permissions are granted")
            });

        setIsScanning(false)
        console.log("Scanning Stopped")
        setButtonTextState("Start Scanning")
    }

    const connect = async function (deviceId, deviceName) {
        const connection = await connectDevice(deviceId)
        if (connection) {
            Toaster("Connected with the device successfully");
            navigation.navigate("Device Action", { deviceId: deviceId, deviceName: deviceName })
            setIsConnecting(false)
        }
        else {
            Toaster("Some error occurred. Try again")
        }
    }

    return (
        <View style={styling.container}>
            <View style={styling.buttonContainer}>
                <TouchableOpacity style={styling.button} onPress={() => { checkScanState() }}>
                    <Text style={styling.buttonText}>{buttonTextState}</Text>
                </TouchableOpacity>
            </View>

            <View style={{ flex: 1 }} >
                <FlatList
                    data={deviceList}
                    keyExtractor={(item) => {
                        return item.id;
                    }}
                    renderItem={({ item }) => {
                        return (
                            <TouchableOpacity>
                                <View style={styling.row}>
                                    <View>
                                        <View style={styling.nameContainer}>
                                            <Text style={styling.nameTxt}>{item.id}</Text>
                                            <TouchableOpacity style={styling.buttonConnect} onPress={() => { connect(item.id, item.name); setIsConnecting(true) }}>
                                                <Text style={styling.buttonTextConnect}>Connect</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styling.msgContainer}>
                                            <Text style={styling.msgTxt}>{item.name}</Text>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        );
                    }} />
            </View>

            {isScanning ? <ActivityIndicator style={styling.pBar} size="large" /> : null}
            {isConnecting ? Toaster("Connecting to device..please wait") : null}

        </View>
    );
}

const styling = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    buttonContainer: {
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 10
    },
    button: {
        backgroundColor: '#0782F9',
        width: '100%',
        padding: 10,
        borderRadius: 13,
        alignItems: 'center',
    },
    buttonConnect: {
        backgroundColor: '#549F58',
        width: '30%',
        padding: 5,
        borderRadius: 13,
        alignItems: 'center',
        marginTop: 16,
    },
    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16,
    },
    buttonTextConnect: {
        color: 'white',
        fontWeight: '700',
        fontSize: 16
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#DCDCDC',
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        padding: 10,
    },
    pic: {
        borderRadius: 30,
        width: 60,
        height: 60,
    },
    nameContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 280,
    },
    nameTxt: {
        marginLeft: 15,
        fontWeight: '600',
        color: '#222',
        fontSize: 18,
        width: 170,
    },
    mblTxt: {
        fontWeight: '200',
        color: '#777',
        fontSize: 13,
    },
    msgContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: -20
    },
    msgTxt: {
        fontWeight: '400',
        color: '#008B8B',
        fontSize: 18,
        marginLeft: 15,
    },
    pBar: {
        borderColor: "black",
        position: "absolute",
        top: 300
    }
});


export default ListBleDevicesScreen