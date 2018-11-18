import React from "react";
import {Button} from "react-native-elements";

export default class HomeButton extends React.Component {
    render() {

        let icon = '';

        let backgroundColor = "#0000FF";
        if (this.props.type === 'income'){
            backgroundColor = "#a4c639";
            icon = 'plus-circle';
        } else if (this.props.type === 'expenditure') {
            backgroundColor = "#cc0000";
            icon = 'minus-circle';
        } else if (this.props.type === 'balance') {
            icon = 'balance-scale';
        } else if (this.props.type === 'info') {
            icon = 'info-circle';
        }

        return (
            <Button
                icon={{name: icon, type: 'font-awesome'}}
                buttonStyle={{
                    backgroundColor: backgroundColor,
                    width: 130,
                    height: 70,
                    borderColor: "transparent",
                    borderWidth: 0,
                    borderRadius: 5
                }}
                containerStyle={{ marginTop: 20 }}
                title={this.props.title}
                onPress={() => {
                    this.props.onPress(this.props.screen);
                }}
            />
        )
    };
}