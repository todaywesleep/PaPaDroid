import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    ScrollView,
    TouchableHighlight,
} from 'react-native';

export class CustomButton extends Component{
    render(){
        return(
            <View style={styles.rootViewStyle}>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    rootViewStyle:{
        backgroundColor: 'blue'
    }
});