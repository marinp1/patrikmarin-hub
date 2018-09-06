import React from 'react';
import { StyleSheet, View, Text, TouchableNativeFeedback } from 'react-native';
import { Icon } from 'react-native-elements';

const listStyles = StyleSheet.create({
  listItem: {
    marginBottom: 20,
  },
  listTitleContainer: {
    flexDirection: "row",
    marginBottom: 6,
  },
  listTitle: {
    fontSize: 20,
    fontFamily: 'montserrat',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  listValue: {
    fontSize: 20,
    fontFamily: 'montserrat',
    fontWeight: '100',
  }
});

const TouchableWrapper = ({ onPress, children }) => (
  <TouchableNativeFeedback
    accessibilityLabel="MapOpener"
    accessibilityRole="button"
    accessibilityStates={[]}
    disabled={false}
    onPress={onPress}
  >
    {children}
  </TouchableNativeFeedback>
);

const ListItem = ({item}) => {
  return item.onPress ? (
    <TouchableWrapper onPress={item.onPress}>
      <View style={listStyles.listItem}>
        <View style={listStyles.listTitleContainer}>
          <Icon name={item.iconName} type="ionicon" size={24} />
          <Text style={listStyles.listTitle}>{item.key}</Text>
        </View>
        <Text style={listStyles.listValue}>{item.value}</Text>
      </View>
    </TouchableWrapper>
  ) :  (
    <View style={listStyles.listItem}>
      <View style={listStyles.listTitleContainer}>
        <Icon name={item.iconName} type="ionicon" size={24} />
        <Text style={listStyles.listTitle}>{item.key}</Text>
      </View>
      <Text style={listStyles.listValue}>{item.value}</Text>
    </View>
  );
}

export default ListItem;