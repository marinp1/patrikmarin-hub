import React from 'react';
import { Button } from 'react-native-elements';
import { COLORS } from '../styles';

const RemoveLocationButton = ({ onPress }) => (
  <Button
    large
    backgroundColor={COLORS.red}
    fontFamily='montserrat'
    fontWeight='bold'
    borderRadius={50}
    containerViewStyle={{
      padding: 0,
      margin: 0,
      borderRadius: 50,
      left: 20,
      right: 25,
      bottom: 40,
      position: 'absolute',
    }}
    icon={{name: 'md-trash', type: 'ionicon'}}
    title='REMOVE LOCATION'
    onPress={onPress}
  />
)

export default RemoveLocationButton;
