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
import {Actions} from "react-native-router-flux";
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
                        <Text style={styles.customFont}>{strings.totalRam}{this.state.totalRam} MB</Text>
                        <Text style={[styles.customFont, {marginBottom: 15}]}>
                            <Text style={{color: 'green'}}>{[strings.freeRam]}</Text>{this.freeRam} MB
                        </Text>

                        <RAMShape data={[this.freeRam, this.state.totalRam]} colors={['green', 'white']}
                                  update={(data) => this.sendData(this.freeRam, this.state.totalRam)}/>
                    </View>

                    <View style={[styles.cardStyle, {marginBottom: 20}]}>
                        <Text style={styles.customTitle}>{strings.storage}</Text>
                        <Text style={styles.customFont}>{strings.totalStorage}{this.state.totalStorage} MB</Text>
                        <Text style={[styles.customFont, {marginBottom: 15}]}>
                            <Text style={{color: 'green'}}>{[strings.freeStorage]}</Text>{this.freeStorage} MB
                        </Text>

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