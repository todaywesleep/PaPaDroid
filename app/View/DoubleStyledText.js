import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import {observable, computed} from "mobx";
import {observer} from 'mobx-react';

@observer
export class DoubleStyledText extends Component{
    constructor(props){
        super(props);
    }

    render(){
        let padding = 5;
        let color = 'white';

        if (this.props.isLast)
            padding = 15;
        if (this.props.colors)
            color = this.props.colors;
        return(
            <View style={{paddingBottom: padding, paddingLeft: 10, paddingRight: 10}}>
                <Text style={[styles.customTitle, {color: color}]}>{this.props.titleText} <Text style={styles.customFont}>{this.props.regularText}</Text></Text>
            </View>
        )
    }
}

const styles=StyleSheet.create({
    customFont: {
        fontWeight: 'normal',
        color: 'white',
    },

    customTitle: {
        fontSize: 15,
        fontWeight: 'bold',
    },
});