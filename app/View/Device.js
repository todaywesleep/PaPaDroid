import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    StatusBar
} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {strings} from "./../Strings/LocalizedStrings"
import {colors} from "../Utils/Consts";
import {observer} from 'mobx-react';
import {observable} from "mobx";
import {DoubleStyledText} from "./DoubleStyledText";

@observer
export class Device extends Component {
    @observable ip='';
    @observable mac='';

    constructor(props) {
        super(props);

        this.getInfo();
    }

    getInfo(){
        DeviceInfo.getIPAddress().then(ip => {
                this.ip = ip
        });

        DeviceInfo.getMACAddress().then(mac => {
                this.mac = mac
        })
    }

    render() {
        return (
            <View style={{backgroundColor: colors.mainBackgroundColor, flex: 1}}>
            <ScrollView
                endFillColor={colors.mainBackgroundColor}
                style={{backgroundColor: colors.mainBackgroundColor, marginTop: 2}}
            >
                <StatusBar backgroundColor={colors.mainBackgroundColor} barStyle="light-content" />
                <View style={styles.cardStyle}>
                    <Text style={styles.customTitle}>{strings.commonDevInfo}</Text>
                    <DoubleStyledText titleText={strings.uniqueID} regularText={DeviceInfo.getUniqueID()}/>
                    <DoubleStyledText titleText={strings.manufacturer} regularText={DeviceInfo.getManufacturer()}/>
                    <DoubleStyledText titleText={strings.brand} regularText={DeviceInfo.getBrand()}/>
                    <DoubleStyledText titleText={strings.model} regularText={DeviceInfo.getModel()}/>
                    <DoubleStyledText titleText={strings.deviceName} regularText={DeviceInfo.getModel()}/>
                    <DoubleStyledText titleText={strings.phoneNumber} regularText={DeviceInfo.getDeviceName()}/>
                    <DoubleStyledText titleText={strings.deviceID} regularText={DeviceInfo.getDeviceId()} isLast/>
                </View>
                <View style={styles.cardStyle}>
                    <Text style={styles.customTitle}>{strings.systemInfo}</Text>
                    <Text style={[styles.customFont, {marginTop: 10}]}>{strings.sysName}{DeviceInfo.getSystemName()}</Text>
                    <Text style={styles.customFont}>{strings.sysVer}{DeviceInfo.getSystemVersion()}</Text>
                    <Text style={styles.customFont}>{strings.bundleID}{DeviceInfo.getBundleId()}</Text>
                    <Text style={styles.customFont}>{strings.buildNumber}{DeviceInfo.getBuildNumber()}</Text>
                    <Text style={styles.customFont}>{strings.apiLevel}{DeviceInfo.getAPILevel()}</Text>
                    <Text style={styles.customFont}>{strings.appInstanceID}{DeviceInfo.getInstanceID()}</Text>
                    <Text style={[styles.customFont, {marginBottom: 15}]}>{strings.userAgent}{DeviceInfo.getUserAgent()}</Text>
                </View>
                <View style={styles.cardStyle}>
                    <Text style={styles.customTitle}>{strings.locInfo}</Text>
                    <Text style={[styles.customFont, {marginTop: 10}]}>{strings.deviceLocale}{DeviceInfo.getDeviceLocale()}</Text>
                    <Text style={styles.customFont}>{strings.deviceCountry}{DeviceInfo.getDeviceCountry()}</Text>
                    <Text style={[styles.customFont, {marginBottom: 15}]}>{strings.timeZone}{DeviceInfo.getTimezone()}</Text>
                </View>
                <View style={[styles.cardStyle, {marginBottom: 20}]}>
                    <Text style={styles.customTitle}>{strings.netInfo}</Text>
                    <Text style={[styles.customFont, {marginTop: 10}]}>{strings.ip}{this.ip}</Text>
                    <Text style={[styles.customFont, {marginBottom: 15}]}>{strings.mac}{this.mac}</Text>
                </View>
            </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    customFont: {
        color: 'white',
        marginLeft: 10,
        marginRight: 10,
    },

    customTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 20,
    },

    cardStyle: {
        backgroundColor: colors.cardBackgroundColor,
        marginTop: 20,
    }
});