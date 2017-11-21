import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    StatusBar,
    NativeModules,
    AppState,
} from 'react-native';
import {DoubleStyledText} from "./DoubleStyledText";
import {strings} from "./../Strings/LocalizedStrings"
import {colors} from "../Utils/Consts";
import {Utils} from "../Utils/Utils";
import {observer} from 'mobx-react';
import {observable, computed} from "mobx";
import {ShapesData} from "../Component/Shapes";
import {RAMShape} from "../Component/RAMShape";
import {DataBase} from "../Utils/DataBase";

export const backgroundTaskForMemory = () => {
    let env = NativeModules.Memory;
    let newObj = {};

    env.getInformation(type, (result) => {
        switch (type) {
            case "TOTALRAM":
                newObj.totalRam = Utils.kbTOmb(result, true);
                break;
            case "FREERAM":
                newObj.freeRam = Utils.kbTOmb(result, true);
                break;
            case "FREESTORAGE":
                newObj.freeStorage = result;
                break;
            case "TOTALSTORAGE":
                newObj.totalStorage = Utils.kbTOmb(result, true);
                break;
        }
    }, (error) => {
        console.warn(error);
        return error.toString();
    });

    return newObj
};

@observer
export class Memory extends Component {
    constructor(props) {
        super(props);
        this.initIntervals();

        this.state = {
            totalRam: -1,
            totalStorage: -1,
        };

        this.getRAMinformation("TOTALRAM");
        this.getRAMinformation("FREERAM");
        this.getRAMinformation("TOTALSTORAGE");
        this.getRAMinformation("FREESTORAGE");

        AppState.addEventListener('change', state => {
            if (state === 'background' || state === 'inactive') {
                DataBase.createStorageWrite(this.state.totalStorage, this.freeStorage);
                DataBase.createRAMWrite(this.state.totalRam, this.freeRam);

                clearInterval(this.timer);
                clearInterval(this.timerRealm);
            } else if (state === 'active') {
                this.initIntervals();
            }
        });
    }

    initIntervals() {
        this.timer = setInterval(() => {
            this.getRAMinformation("FREERAM");
            this.getRAMinformation("FREESTORAGE");
        }, 2000);

        this.timerRealm = setInterval(() => {
            DataBase.createStorageWrite(this.state.totalStorage, this.freeStorage);
            DataBase.createRAMWrite(this.state.totalRam, this.freeRam);
        }, 60000);
    }

    timer;
    timerRealm;
    @observable freeRam = -1;
    @observable freeStorage = -1;

    @computed
    get getFreeRam() {
        return this.freeRam + ' MB';
    }

    @computed
    get getFreeStorage() {
        return this.freeStorage + ' MB';
    }

    @computed
    get getTotalStorage() {
        return this.state.totalStorage + ' MB';
    }

    @computed
    get getTotalRam() {
        return this.state.totalRam + ' MB';
    }

    env = NativeModules.Memory;

    getRAMinformation(type) {
        this.env.getInformation(type, (result) => {
            switch (type) {
                case "TOTALRAM":
                    this.setState({
                        totalRam: Utils.kbTOmb(result, true)
                    });
                    break;
                case "FREERAM":
                    this.freeRam = Utils.kbTOmb(result);
                    break;
                case "FREESTORAGE":
                    this.freeStorage = result;
                    break;
                case "TOTALSTORAGE":
                    this.setState({
                        totalStorage: Utils.kbTOmb(result, true)
                    });
                    break;
            }
        }, (error) => {
            console.warn(error);
            return error.toString();
        });
    }

    sendData(free, all) {
        return [free, all];
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
                        <Text style={styles.customTitle}>{strings.ram}</Text>
                        <DoubleStyledText titleText={strings.totalRam} regularText={this.getTotalRam}/>
                        <DoubleStyledText titleText={strings.freeRam} regularText={this.getFreeRam} colors={'green'}
                                          isLast/>

                        <RAMShape data={[this.freeRam, this.state.totalRam]} colors={['white', 'green']}
                                  update={(data) => this.sendData(this.state.totalRam - this.freeRam, this.freeRam)}/>
                    </View>

                    <View style={[styles.cardStyle, {marginBottom: 20}]}>
                        <Text style={styles.customTitle}>{strings.storage}</Text>
                        <DoubleStyledText titleText={strings.totalStorage} regularText={this.getTotalStorage}/>
                        <DoubleStyledText titleText={strings.freeStorage} regularText={this.getFreeStorage}
                                          colors={'green'} isLast/>

                        <RAMShape data={[this.freeStorage, this.state.totalStorage]} colors={['white', 'green']}
                                  update={(data) => this.sendData(this.state.totalStorage - this.freeStorage, this.freeStorage)}/>
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
    }
});