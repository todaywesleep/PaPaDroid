import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    StatusBar,
    AppState,
    NativeModules,
    Image,
} from 'react-native';
import {strings} from './../Strings/LocalizedStrings'
import {colors} from '../Utils/Consts';
import {observer} from 'mobx-react';
import {observable, computed} from 'mobx';
import {DoubleStyledText} from './DoubleStyledText';
import {DataBase} from "../Utils/DataBase";
import {LoadingView} from "./LoadingView";

export const backgroundBattery = () => {
    let battery = NativeModules.BatteryInf;
    let newObj = {};

    battery.returnValue(type, (result) => {
        switch (type) {
            case 'STATUS':
                newObj.status = result;
                break;
        }
    }, (error) => {
        console.warn(error);
        return error.toString();
    });

    return newObj;
};

@observer
export class BatteryInfo extends Component {
    battery = NativeModules.BatteryInf;
    @observable percentage = strings.loading;
    @observable status = strings.loading;
    @observable source;
    timer;
    timerRealm;

    constructor(props) {
        super(props);

        this.getBatteryInformation('PERCENTAGE');
        this.getBatteryInformation('STATUS');

        this.state = {
            isLoading: true,
        };

        this.initIntervals();
    }

    componentWillMount() {
        AppState.addEventListener('change', state => {
            if (state === 'background' || state === 'inactive') {
                DataBase.createBatteryWrite(this.status === 'Charging', new Date());
                clearInterval(this.timer);
                clearInterval(this.timerRealm);
            } else if (state === 'active') {
                this.initIntervals();
            }
        });

        setTimeout(() => {
            this.setState({isLoading: false})
        }, 2000);
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

    initIntervals() {
        this.timer = setInterval(() => {
            this.getBatteryInformation('PERCENTAGE');
            this.getBatteryInformation('STATUS');
            this.source = this.getImageBy(this.percentage);
        }, 2000);

        this.timerRealm = setInterval(() => {
            if (this.status !== 'Loading...')
                DataBase.createBatteryWrite(this.status === 'Charging' || this.status === 'Заряжается', new Date(), 'inApp');
        }, 60000);
    }

    getBatteryInformation(type) {
        this.battery.returnValue(type, strings.getLanguage(), (result) => {
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

                <LoadingView show={this.state.isLoading}/>
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