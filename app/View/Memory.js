import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableHighlight,
    Image,
    Dimensions,
    StatusBar,
    NativeModules
} from 'react-native';
import {DoubleStyledText} from "./DoubleStyledText";
import {strings} from "./../Strings/LocalizedStrings"
import {colors} from "../Utils/Consts";
import {Utils} from "../Utils/Utils";
import {observer} from 'mobx-react';
import {observable, computed} from "mobx";
import {Shapes, ShapesData} from "../Component/Shapes";
import {RAMShape} from "../Component/RAMShape";

@observer
export class Memory extends Component {
    constructor(props) {
        super(props);

        this.state = {
            totalRam: -1,
            totalStorage: -1,
        };

        this.getRAMinformation("TOTALRAM");
        this.getRAMinformation("FREERAM");
        this.getRAMinformation("TOTALSTORAGE");
        this.getRAMinformation("FREESTORAGE");
    }

    timer;
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

    componentWillMount() {
        this.timer = setInterval(() => {
            this.getRAMinformation("FREERAM");
            this.getRAMinformation("FREESTORAGE");
        }, 1000);
    }

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

                        <RAMShape data={[this.freeRam, this.state.totalRam]} colors={['green', 'white']}
                                  update={(data) => this.sendData(this.freeRam, this.state.totalRam)}/>
                    </View>

                    <View style={[styles.cardStyle, {marginBottom: 20}]}>
                        <Text style={styles.customTitle}>{strings.storage}</Text>
                        <DoubleStyledText titleText={strings.totalStorage} regularText={this.getTotalStorage}/>
                        <DoubleStyledText titleText={strings.freeStorage} regularText={this.getFreeStorage}
                                          colors={'green'} isLast/>

                        <RAMShape data={[this.freeStorage, this.state.totalStorage]} colors={['green', 'white']}
                                  update={(data) => this.sendData(this.freeStorage, this.state.totalStorage)}/>
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