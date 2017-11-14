import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ART, ScrollView,
} from 'react-native';
import * as d3 from "d3-shape";
import {observer} from 'mobx-react';
import {observable, computed} from "mobx";

const {
    Surface,
    Group,
    Shape,
} = ART;

const generateData = (array) => {
    return [{index: 0, value: array[0]}, {index: 1, value: array[1]}]
};

preparePaths = (arcs) => {
    const paths = [];
    let arc = d3.arc()
        .outerRadius(80)  // Radius of the pie
        .padAngle(.05)    // Angle between sections
        .innerRadius(30);

    for (i = 0; i < arcs.length; i++) {
        paths[i] = arc(arcs[i])
    }

    return paths;
};

@observer
export class RAMShape extends Component {
    @observable data = [];
    timer;

    arcs = d3.pie()
        .value(function (d) {
            return d.value
        })
        (generateData(this.props.update()));

    colors;

    componentWillUnmount(){
        setTimeout(function () {
            clearInterval(this.timer);
        }, 0);
    }

    componentDidMount(){
        this.timer = setInterval(() => {
            this.arcs = d3.pie()
                .value(function (d) {
                    return d.value
                })
                (generateData(this.props.update()));
        }, 1000)
    }

    constructor(props) {
        super(props);
        this.colors = this.props.colors;
    }

    render() {
        let generatedPaths = preparePaths(this.arcs);
        return (
            <ScrollView>
                <View style={{flex: 1, alignItems: 'center'}}>
                    <View style={{margin: 20}}>
                        <Surface width={166} height={166}>
                            <Group x={80} y={80}>
                                {
                                    // pieChart has all the svg paths calculated in step 2)
                                    generatedPaths.map((item, index) =>
                                        (<Shape
                                            d={item}
                                            fill={this.colors[index]}
                                            stroke={'black'}
                                            key={index}
                                        />))
                                }
                            </Group>
                        </Surface>
                    </View>
                </View>
            </ScrollView>
        )
    }
}