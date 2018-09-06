import React from 'react';
import { StyleSheet, View, Text, TouchableNativeFeedback } from 'react-native';
import Pulse from 'react-native-pulse';
import { COLORS } from '../styles';

const statusButtonStyles = StyleSheet.create({
  container: {
    height: 120,
    width: 120,
    borderRadius: 100,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 80,
    marginTop: 80,
  },
  button: {
    height: 120,
    width: 120,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 5,
  },
});

class StatusButton extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const buttonStyles = [statusButtonStyles.button];
    if (this.props.active) {
      buttonStyles.push({borderColor: COLORS.green});
    } else {
      buttonStyles.push({borderColor: COLORS.red});
    }

    const buttonText = this.props.active ? 'ON' : 'OFF';
    const buttonTextColor = this.props.active ? COLORS.green : COLORS.red;

    return (
      <React.Fragment>
        {this.props.active &&
          <Pulse color={COLORS.green} numPulses={3} diameter={200} speed={15} duration={1000} />
        }
        <View style={statusButtonStyles.container}>
          <TouchableNativeFeedback
            background={TouchableNativeFeedback.Ripple('#E1E1E1', true)}
            accessibilityLabel="Toggler"
            accessibilityRole="button"
            accessibilityStates={[]}
            disabled={false}
            onPress={this.props.onPress}
          >
            <View style={buttonStyles}>
              <Text style={{
                fontSize: 26,
                fontFamily: 'montserrat',
                fontWeight: 'bold',
                color: buttonTextColor,
              }}>{buttonText}</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      </React.Fragment>
    ) 
  }
}

export default StatusButton;
