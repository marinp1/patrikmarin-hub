import React from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import { COLORS } from '../styles';

const RefreshButton = ({ onPress }) => (
  <View style={{
    elevation: 100,
    position: 'absolute',
    right: 30,
    top: 320,
  }}>
    <Icon
      reverse
      name='md-refresh'
      type='ionicon'
      color={COLORS.blue}
      onPress={onPress}
    />
  </View>
);

export default RefreshButton;
