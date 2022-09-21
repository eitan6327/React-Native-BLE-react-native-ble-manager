import BleManager from "react-native-ble-manager";

BleManager.start({ showAlert: false })
    .then(() => {
        console.log("Module initialized");
    })
    .catch((error) => {
        console.log(error)
    })

const connectDevice = async function (deviceId) {

    const val = await BleManager.connect(deviceId)
        .then(() => {
            console.log("Connected");
            return true
        })
        .catch((error) => {
            console.log(error);
            return false
        });

    await BleManager.retrieveServices(deviceId)
        .then((peripheralInfo) => {
            // console.log("Peripheral info:", peripheralInfo)
            // console.log("Services", peripheralInfo.services)
            // console.log("Chars", peripheralInfo.characteristics)
            // console.log(peripheralInfo.services[1].uuid + " : " + peripheralInfo.characteristics[1].characteristic)
            // console.log(peripheralInfo.services[1].uuid + " : " + peripheralInfo.characteristics[2].characteristic)
            // readData(deviceId, peripheralInfo.services[1].uuid, peripheralInfo.characteristics[2].characteristic)
            // console.log(peripheralInfo.services[1].uuid + " : " + peripheralInfo.characteristics[3].characteristic)
            // readData(deviceId, peripheralInfo.services[1].uuid, peripheralInfo.characteristics[3].characteristic)
            // console.log(peripheralInfo.services[1].uuid + " : " + peripheralInfo.characteristics[4].characteristic)
            // readData(deviceId, peripheralInfo.services[1].uuid, peripheralInfo.characteristics[4].characteristic)
            // notifyData(deviceId, peripheralInfo.services[2].uuid, peripheralInfo.characteristics[6].characteristic)
        })
        .catch((error) => {
            console.log(error);
        });

    return val
}

export { BleManager, connectDevice }