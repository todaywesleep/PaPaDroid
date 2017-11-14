import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    StatusBar,
    DeviceEventEmitter,
    NativeModules,
} from 'react-native';
import {strings} from "./../Strings/LocalizedStrings"
import {colors} from "../Utils/Consts";
import {observer} from 'mobx-react';
import {observable, computed} from "mobx";

@observer
export class BatteryInfo extends Component {
    battery = NativeModules.BatteryInf;
    @observable percentage = "Loading...";
	@observable status = "Loading...";
	timer;

    constructor(props) {
        super(props);
		
		this.getBatteryInformation("PERCENTAGE");
		this.getBatteryInformation("STATUS");
		
		this.timer = setInterval(() => {
            this.getBatteryInformation("PERCENTAGE");
			this.getBatteryInformation("STATUS");
        }, 5000);
    }

    getBatteryInformation(type) {
        this.battery.returnValue(type, (result) => {
            switch (type) {
                case "PERCENTAGE":
                    this.percentage = result + "%";
                    break;
                case "STATUS":
                    this.status = result;
                    break;
            }
        }, (error) => {
            console.warn(error);
            return error.toString();
        });
    }


    render() {
        return (
            <View style={{backgroundColor: colors.mainBackgroundColor, flex: 1}}>
                <ScrollView
                    endFillColor={colors.mainBackgroundColor}
                    style={{backgroundColor: colors.mainBackgroundColor, marginTop: 2}}
                >
                    <StatusBar backgroundColor={colors.mainBackgroundColor} barStyle="light-content"/>
                    <View style={[styles.cardStyle, {marginBottom: 20}]}>
                        <Text style={styles.customTitle}>{strings.battery}</Text>
                        <Text style={styles.customFont}>{strings.batteryStatus}{this.status}</Text>
                        <Text style={styles.customFont}>{strings.batteryState}{this.percentage}</Text>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    customFont: {
        color: 'white',
        padding: 15,
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