import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    StatusBar,
    DeviceEventEmitter,
    NativeModules, Image,
} from 'react-native';
import {strings} from './../Strings/LocalizedStrings'
import {colors} from '../Utils/Consts';
import {observer} from 'mobx-react';
import {observable, computed} from 'mobx';
import {DoubleStyledText} from './DoubleStyledText';
//import {DataBase} from "../Utils/DataBase";

@observer
export class BatteryInfo extends Component {
    battery = NativeModules.BatteryInf;
    @observable percentage = 'Loading...';
    @observable status = 'Loading...';
    @observable source;
    timer;

    constructor(props) {
        super(props);

        //DataBase.readWrites();
        this.getBatteryInformation('PERCENTAGE');
        this.getBatteryInformation('STATUS');
    }

    componentWillMount(){
        this.timer = setInterval(() => {
            this.getBatteryInformation('PERCENTAGE');
            this.getBatteryInformation('STATUS');
            this.source = this.getImageBy(this.percentage);
        }, 5000);
    }

    getImageBy(percentage) {
        switch (true) {
            case (percentage >= 90):
                return require('../../src/pics/battery/battery10.png');
            case (percentage >= 80):
                return require('../../src/pics/battery/battery9.png');
            case (percentage >= 70):
                return require('../../src/pics/battery/battery8.png');
            case (percentage >= 60):
                return require('../../src/pics/battery/battery7.png');
            case (percentage >= 50):
                return require('../../src/pics/battery/battery6.png');
            case (percentage >= 40):
                return require('../../src/pics/battery/battery5.png');
            case (percentage >= 30):
                return require('../../src/pics/battery/battery4.png');
            case (percentage >= 20):
                return require('../../src/pics/battery/battery3.png');
            case (percentage >= 10):
                return require('../../src/pics/battery/battery2.png');
            case (percentage >= 0):
                return require('../../src/pics/battery/battery1.png');
        }
    }

    getBatteryInformation(type) {
        this.battery.returnValue(type, (result) => {
            switch (type) {
                case 'PERCENTAGE':
                    this.percentage = result;
                    break;
                case 'STATUS':
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
                    <StatusBar backgroundColor={colors.mainBackgroundColor} barStyle='light-content'/>
                    <View style={[styles.cardStyle, {marginBottom: 20}]}>
                        <Text style={styles.customTitle}>{strings.battery}</Text>
                        <DoubleStyledText titleText={strings.batteryStatus} regularText={this.status}/>
                        <DoubleStyledText titleText={strings.batteryState} regularText={this.percentage + '%'} isLast/>
                        <View style={{alignItems: 'center', paddingBottom: 15, paddingTop: 10}}>
                            <Image source={this.source}/>
                        </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    customFont: {
        color: 'white',
        fontSize: 15,
        padding: 5,
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
    },

    img: {
        width: 100,
        height: 100,
    }
});