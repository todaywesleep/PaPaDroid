import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    StatusBar,
    Modal,
    ActivityIndicator
} from 'react-native';
import {strings} from "./../Strings/LocalizedStrings"
import {colors} from "../Utils/Consts";

export class LoadingView extends Component{
    constructor(props) {
        super(props);
        this.state = {
            show: this.props.show,
        };
    }

    componentWillReceiveProps(nextProps) {
        this.props = nextProps;
        this.setState({ show: this.props.show });
    }

    render() {
        return (
            <Modal
                animationType={"fade"}
                transparent={true}
                visible={this.state.show}
                onRequestClose={() => {this.setState({show: false})}}>

                <View style={styles.modalContainer}>
                    <View style={{backgroundColor: colors.mainBackgroundColor, borderRadius: 5, margin: 20, padding: 5}}>

                        <ActivityIndicator
                            animating={true}
                            style={{height: 60}}
                            size="large"
                            color={colors.cardBackgroundColor}
                        />

                        <Text style={[styles.dialogText]}>{strings.loading}</Text>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    dialogText: {
        fontSize: 18,
        color: 'white',
        padding: 6
    }
});