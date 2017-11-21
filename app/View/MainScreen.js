import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ScrollView, TouchableOpacity, TouchableHighlight
} from 'react-native';
import {colors} from "../Utils/Consts";
import {DataBase} from "../Utils/DataBase";
import {DoubleStyledText} from "./DoubleStyledText";
import {strings} from "../Strings/LocalizedStrings";
import {observer} from 'mobx-react';
import {observable, computed} from 'mobx';
import {Actions} from 'react-native-router-flux';

@observer
export class MainScreen extends Component {
    timer;
    @observable RAM;
    @observable Storage;
    @observable Battery;
    @observable Time;

    constructor(props) {
        super(props);
        this.RAM = DataBase.returnLastBlock('RAM') === undefined ? {freePercentage: 0, totalSpace: 0} : DataBase.returnLastBlock('RAM');
        this.Storage = DataBase.returnLastBlock('Storage') === undefined ? {freePercentage: 0, totalSpace: 0} : DataBase.returnLastBlock('Storage');
        this.Battery = DataBase.returnLastBlock('Battery') === undefined ? {lastChargeDate: new Date(), averageChargingTime: 0, isCharging: false, boofTime: 0,} : DataBase.returnLastBlock('Battery');

        this.timer = setInterval(() => {
            this.RAM = DataBase.returnLastBlock('RAM') === undefined ? {freePercentage: 0, totalSpace: 0} : DataBase.returnLastBlock('RAM');
            this.Storage = DataBase.returnLastBlock('Storage') === undefined ? {freePercentage: 0, totalSpace: 0} : DataBase.returnLastBlock('Storage');
            this.Battery = DataBase.returnLastBlock('Battery') === undefined ? {lastChargeDate: new Date(), averageChargingTime: 0, isCharging: false, boofTime: 0,} : DataBase.returnLastBlock('Battery');
        }, 60000);
    }

    @computed
    get getAverageRam() {
        return Math.floor(this.RAM.totalSpace * (this.RAM.freePercentage / 100)) + ' MB';
    }

    @computed
    get getAverageStorage() {
        return Math.floor(this.Storage.totalSpace - (this.Storage.totalSpace * (this.Storage.freePercentage / 100))) + ' MB';
    }

    @computed
    get getAverageCharge() {
        return Math.floor(this.Battery.averageChargingTime) + ' min';
    }

    @computed
    get getLastChargeTime(){
        let timer = new Date(this.Battery.lastChargeDate);
        return timer.getMonth() + '/' + timer.getDate() + ' ' + timer.getHours() + ':' + timer.getMinutes();
    }

    onPress(){
        Actions.reset('Home');
    }

    render() {
        return (
            <ScrollView style={styles.container}>
                <View style={[styles.cardStyle, {marginBottom: 20}]}>
                    <Text style={styles.customTitle}>{strings.statistic}</Text>
                </View>
                <View style={[styles.cardStyle, {backgroundColor: colors.mainBackgroundColor, marginBottom: 20}]}>
                    <DoubleStyledText titleText={strings.averageRAM} regularText={this.getAverageRam}/>
                    <DoubleStyledText titleText={strings.averageStorage} regularText={this.getAverageStorage}/>
                    <DoubleStyledText titleText={strings.averageChargingTime} regularText={this.getAverageCharge}/>
                    <DoubleStyledText titleText={strings.lastChargeTime} regularText={this.getLastChargeTime}
                                      isLast/>
                </View>
                <View style={styles.cardStyle}>
                    <TouchableHighlight
                        style={styles.buttonBox}
                        onPress={() => this.onPress()}
                        underlayColor={colors.cardBackgroundColor}
                    >
                        <Text style={styles.textStyle}> {strings.exit} </Text>
                    </TouchableHighlight>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.mainBackgroundColor,
    },

    customFont: {
        color: 'white',
        marginLeft: 10,
        marginRight: 10,
        fontSize: 15
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

    textStyle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        padding: 10,
    }
});