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
import {DoubleStyledText} from "./DoubleStyledText";

@observer
export class CPU extends Component {
    timer;
    env = NativeModules.CPU;

    @observable cpuMax = 0.0;
    @observable cpuMin = 0.0;
    @observable temp = 0;
    @observable cpuStats = [1, 2, 3, 4];

    constructor(props) {
        super(props);

        this.state = {
            cpuName: '',
            cpuCount: '',
            cpuMin: '',
        };

        this.getCurrentCPUInformation("CPU");
        this.getCurrentCPUInformation("CPU_COUNT");
        this.getCurrentCPUInformation("CPU_ARCH");
        this.getCurrentCPUInformation("CPU_MAX_SPEED");
        this.getCurrentCPUInformation("CPU_MIN_SPEED");
    }

    componentWillMount() {
        this.timer = setInterval(() => {
            this.getCurrentCPUInformation("CPU_TEMP");
            this.getCurrentCPUInformation("CPU_STATISTIC");
        }, 1000);
    }

    componentWillUnmount() {
        setTimeout(function () {
            clearInterval(this.timer);
        }, 0);
    }

    @computed
    get userLoad() {
        if (this.cpuStats.length >= 3) {
            return this.cpuStats[0] + "%";
        }
    }

    @computed
    get sysLoad() {
        if (this.cpuStats.length >= 3) {
            return this.cpuStats[1] + "%";
        }
    }

    @computed
    get idleLoad() {
        if (this.cpuStats.length >= 3) {
            return this.cpuStats[2] + "%";
        }
    }

    @computed
    get otherLoad() {
        if (this.cpuStats.length >= 3) {
            return this.cpuStats[3] + "%";
        }
    }

    @computed
    get totalLoad() {
        return (Utils.computeAllProcesses(this.cpuStats) + " %")
    }

    @computed
    get correctMaxFreq() {
        return this.cpuMax / 1000000 + " MHZ"
    }

    @computed
    get correctMinFreq() {
        return this.cpuMin / 1000000 + " MHZ"
    }

    @computed
    get temperature() {
        return this.temp + " °C"
    }

    getCurrentCPUInformation(type) {
        this.env.returnValue(type, (result) => {
            switch (type) {
                case "CPU":
                    this.setState({
                        cpuName: Utils.cpuInfoParser(result)
                    });
                    break;
                case "CPU_ARCH":
                    this.setState({
                        cpuArch: result
                    });
                    break;
                case "CPU_COUNT":
                    this.setState({
                        cpuCount: result
                    });
                    break;
                case "CPU_MAX_SPEED":
                    this.cpuMax = result;
                    break;
                case "CPU_MIN_SPEED":
                    this.cpuMin = result;
                    break;
                case "CPU_TEMP":
                    this.temp = result;
                    break;
                case "CPU_STATISTIC":
                    this.cpuStats = Utils.parseCpuStats(result);
                    break;
            }
        }, (error) => {
            console.warn(error);
            return error.toString();
        });
    }

    sendData(data) {
        return data;
    }

    render() {
        return (
            <View style={{backgroundColor: colors.mainBackgroundColor, flex: 1}}>
                <ScrollView
                    endFillColor={colors.mainBackgroundColor}
                    style={{backgroundColor: colors.mainBackgroundColor, marginTop: 2}}
                >
                    <StatusBar backgroundColor={colors.mainBackgroundColor} barStyle="light-content"/>
                    <View style={styles.cardStyle}>
                        <Text style={styles.customTitle}>{strings.cpu}</Text>
                        <DoubleStyledText titleText={strings.cpuName} regularText={this.state.cpuName}/>
                        <DoubleStyledText titleText={strings.cpuArch} regularText={this.state.cpuArch}/>
                        <DoubleStyledText titleText={strings.cpuCount} regularText={this.state.cpuCount}/>
                        <DoubleStyledText titleText={strings.temp} regularText={this.temperature}/>
                        <DoubleStyledText titleText={strings.cpuMin} regularText={this.correctMinFreq}/>
                        <DoubleStyledText titleText={strings.cpuMax} regularText={this.correctMaxFreq} isLast/>
                    </View>

                    <View style={[styles.cardStyle, {marginBottom: 20}]}>
                        <Text style={styles.customTitle}>{strings.usage}</Text>
                        <DoubleStyledText titleText={strings.userProcesses} regularText={this.userLoad} colors={'green'}/>
                        <DoubleStyledText titleText={strings.sysProcesses} regularText={this.sysLoad} colors={'red'}/>
                        <DoubleStyledText titleText={strings.idle} regularText={this.idleLoad} colors={'orange'}/>
                        <DoubleStyledText titleText={strings.other} regularText={this.otherLoad} colors={'gray'}/>
                        <DoubleStyledText titleText={strings.totalCpu} regularText={this.totalLoad} colors={'blue'} isLast/>
                        <Shapes data={this.cpuStats} colors={['green', 'red', 'orange', 'gray', 'white']}
                                update={(data) => this.sendData(this.cpuStats)}/>
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