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
                    <DoubleStyledText titleText={strings.sysName} regularText={DeviceInfo.getSystemName()}/>
                    <DoubleStyledText titleText={strings.sysVer} regularText={DeviceInfo.getSystemVersion()}/>
                    <DoubleStyledText titleText={strings.bundleID} regularText={DeviceInfo.getBundleId()}/>
                    <DoubleStyledText titleText={strings.buildNumber} regularText={DeviceInfo.getBuildNumber()}/>
                    <DoubleStyledText titleText={strings.apiLevel} regularText={DeviceInfo.getAPILevel()}/>
                    <DoubleStyledText titleText={strings.appInstanceID} regularText={DeviceInfo.getInstanceID()}/>
                    <DoubleStyledText titleText={strings.userAgent} regularText={DeviceInfo.getUserAgent()} isLast/>
                </View>
                <View style={styles.cardStyle}>
                    <Text style={styles.customTitle}>{strings.locInfo}</Text>
                    <DoubleStyledText titleText={strings.deviceLocale} regularText={DeviceInfo.getDeviceLocale()}/>
                    <DoubleStyledText titleText={strings.deviceCountry} regularText={DeviceInfo.getDeviceCountry()}/>
                    <DoubleStyledText titleText={strings.timeZone} regularText={DeviceInfo.getTimezone()} isLast/>
                </View>
                <View style={[styles.cardStyle, {marginBottom: 20}]}>
                    <Text style={styles.customTitle}>{strings.netInfo}</Text>
                    <DoubleStyledText titleText={strings.ip} regularText={this.ip}/>
                    <DoubleStyledText titleText={strings.mac} regularText={this.mac} isLast/>
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