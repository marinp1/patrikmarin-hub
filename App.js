import React from 'react';
import BackgroundTask from 'react-native-background-task'
import { Alert, View } from 'react-native';
import { Button, Icon, Text, List, ListItem } from 'react-native-elements';

import LocationService from './LocationService';
import StorageService from './StorageService';

import { styles } from './Styles';

BackgroundTask.define(async () => {
  LocationService.getLocation();
  BackgroundTask.finish();
});

const Light = ({color}) => (
  <View style={{
    position: 'absolute',
    right: 20,
    height: 15,
    width: 15,
    backgroundColor: color,
    borderRadius: 50,
  }}/>
);

const CustomButton = ({color, backgroundColor, title, onPress}) => (
  <Button
    raised
    large
    buttonStyle={{
      backgroundColor,
    }}
    title={title}
    containerViewStyle={{width: '100%', marginBottom: 10}}
    borderRadius={10}
    color={color}
    onPress={onPress}
    underlayColor={'black'}
  />
);

const RefreshButton = ({onPress}) => (
  <View style={styles.refresh}>
    <Icon
      onPress={onPress}
      size={20}
      reverse
      raised
      name='refresh'
      type='font-awesome'
      color='#9C27B0'
      underlayColor={'black'}
    />
  </View>
);

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      scheduled: false,
      coordinates: {
        lat: null,
        lng: null,
      },
      error: null,
      location: {
        city: null,
        country: null,
      },
      timestamp: null,
    };
    this.toggleSchedule = this.toggleSchedule.bind(this);
    this.refreshData = this.refreshData.bind(this);
    this.clearData = this.clearData.bind(this);
  }

  async toggleSchedule() {
    if (this.state.scheduled) {
      BackgroundTask.cancel();
      this.setState({scheduled: false});
    } else {
      if (this.checkStatus()) {
        LocationService.getLocation();
        BackgroundTask.schedule({
          period: 1800, // Aim to run every 30 mins - more conservative on battery
        });
        this.setState({scheduled: true});
      }
    }
    await this.refreshData();
  }

  async refreshData() {
    try {
      const coordinates = await StorageService.getLatLng();
      const error = await StorageService.getError();
      const location = await StorageService.getLocation();
      const timestamp = await StorageService.getTimestamp();
      this.setState({
        coordinates,
        error,
        location,
        timestamp,
      });
    } catch (e) {
      console.log(e);
    }
  }

  async clearData() {
    await LocationService.removeLocation();
    await this.refreshData();
  }

  async checkStatus() {
    const status = await BackgroundTask.statusAsync();
    
    if (status.available) {
      // Everything's fine
      return true;
    }
    
    const reason = status.unavailableReason;
    if (reason === BackgroundTask.UNAVAILABLE_DENIED) {
      Alert.alert('Denied', 'Please enable background "Background App Refresh" for this app');
    } else if (reason === BackgroundTask.UNAVAILABLE_RESTRICTED) {
      Alert.alert('Restricted', 'Background tasks are restricted on your device');
    }

    return false;
  }

  async componentDidMount() {
    await this.refreshData();
  }


  render() {

    const toggleButtonBg = this.state.scheduled ? '#F4511E' : '#009688';
    const toggleButtonTitle = this.state.scheduled ? "Disable location services" : "Enable location services";
    const lightColor = this.state.scheduled ? '#009688' : '#F4511E';

    const lastUpdate = [
      {
        title: 'Timestamp',
        content: `${this.state.timestamp}`
      },
      {
        title: 'Coordinates',
        content: `${this.state.coordinates.lat}, ${this.state.coordinates.lng}`
      },
      {
        title: 'Location',
        content: `${this.state.location.city}, ${this.state.location.country}`
      },
    ]

    return (
      <React.Fragment>
        <View style={styles.container}>
          <View style={styles.infoContainer}>
              <Text>Location services {this.state.scheduled ? 'ON' : 'OFF'}</Text>
              <Light color={lightColor} />
          </View>
          <CustomButton
            color="#fff"
            backgroundColor={toggleButtonBg}
            title={toggleButtonTitle}
            onPress={this.toggleSchedule}
          />
          {this.state.error && this.state.error !== 'null' &&
            <View style={styles.errorContainer}>
              <Text style={styles.errorHeader}>Unable to send location!</Text>
              <Text>{this.state.error}</Text>
            </View>
          }
          <View style={styles.listContainer}>
            <Text h4 style={styles.lastUpdateStyle}>Last update</Text>
            <List containerStyle={{width: '100%'}}>
              {lastUpdate.map((l) => (
                  <ListItem
                    hideChevron
                    key={l.title}
                    subtitle={l.content}
                    title={l.title}
                  />
                ))}
            </List>
            <RefreshButton onPress={this.refreshData}/>
          </View>
          <CustomButton
            color="#333"
            backgroundColor="#e1e1e1"
            title="Remove location"
            onPress={this.clearData}
          />
        </View>
      </React.Fragment>
    )
  }
}
