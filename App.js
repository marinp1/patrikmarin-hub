import React from 'react';
import BackgroundTask from 'react-native-background-task'
import { Alert, FlatList, StyleSheet, View, StatusBar, Text } from 'react-native';
import LocationService from './LocationService';
import StorageService from './StorageService';
import RefreshButton from './components/RefreshButton';
import StatusButton from './components/StatusButton';
import RemoveLocationButton from './components/RemoveLocationButton';
import ListItem from './components/ListItem';
import { COLORS } from './styles';

BackgroundTask.define(async () => {
  LocationService.getLocation();
  BackgroundTask.finish();
});

export default class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      trackingActive: false,
      timestamp: null,
      coordinates: {
        latitude: null,
        longitude: null,
      },
      location: {
        city: null,
        country: null,
      },
      error: null,
    }
    this.refreshData = this.refreshData.bind(this);
    this.toggleTrackingService = this.toggleTrackingService.bind(this);
    this.removeLocation = this.removeLocation.bind(this);
  }

  async refreshData() {
    try {
      const coordinates = await StorageService.getLatLng();
      const error = await StorageService.getError();
      const location = await StorageService.getLocation();
      const timestamp = await StorageService.getTimestamp();
      const trackingActive = await StorageService.getServiceStatus();
      this.setState({
        coordinates,
        error,
        location,
        timestamp,
        trackingActive,
      });
    } catch (e) {
      console.log(e);
    }
  }

  async toggleTrackingService() {
    const checkStatus = async () => {
      const status = await BackgroundTask.statusAsync();
      if (status.available) return true;

      const reason = status.unavailableReason;
      if (reason === BackgroundTask.UNAVAILABLE_DENIED) {
        Alert.alert('Denied', 'Please enable background "Background App Refresh" for this app');
      } else if (reason === BackgroundTask.UNAVAILABLE_RESTRICTED) {
        Alert.alert('Restricted', 'Background tasks are restricted on your device');
      }
      return false;
    }

    if (this.state.trackingActive) {
      BackgroundTask.cancel();
      await StorageService.setServiceStatus(false);
      await this.refreshData();
    } else {
      if (checkStatus()) {
        LocationService.getLocation();
        BackgroundTask.cancel();
        BackgroundTask.schedule({
          period: 1800, // Aim to run every 30 mins - more conservative on battery
        });
        await StorageService.setServiceStatus(true);
        await this.refreshData();
      }
    }
  }

  async removeLocation() {
    await LocationService.removeLocation();
    await this.refreshData();
  }

  async componentDidMount() {
    await this.refreshData();
    if (this.state.trackingActive) {
      BackgroundTask.cancel();
      BackgroundTask.schedule({
        period: 1800,
      });
    } else {
      BackgroundTask.cancel();
    }
  }

  stateToData(state) {
    const ts = state.timestamp ? state.timestamp : 'Not set';
    const coords = state.coordinates.latitude && state.coordinates.longitude ?
      `${state.coordinates.latitude}, ${state.coordinates.longitude}` : 'Not set';
    const location = state.location.city && state.location.country ?
      `${state.location.city}, ${state.location.country}` : 'Not set';

    return [
      {
        iconName: 'md-clock',
        key: 'Timestamp',
        value: ts,
      },
      {
        iconName: 'md-compass',
        key: 'Coordinates',
        value: coords,
      },
      {
        iconName: 'md-pin',
        key: 'Location',
        value: location,
      },
    ]
  }

  render() {
    const data = this.stateToData(this.state);

    return (
      <React.Fragment>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#FFFFFF"
        />
        <View style={styles.header}>
          <Text style={styles.title}>LOCATION TRACKER</Text>
        </View>
        <View style={{ justifyContent: 'center', alignItems: 'center' }}>
          <StatusButton
            active={this.state.trackingActive}
            onPress={this.toggleTrackingService}
          />
        </View>
        <RefreshButton onPress={this.refreshData}/>
        <View style={styles.lastContainer}>
          <Text style={styles.lastTitle}>LAST LOCATION</Text>
          <FlatList
            data={data}
            renderItem={({item}) => <ListItem item={item}/>}
          />
          <RemoveLocationButton onPress={this.removeLocation} />
        </View>
      </React.Fragment>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    elevation: 2,
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 26,
    fontFamily: 'montserrat',
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  lastContainer: {
    elevation: 10,
    flexGrow: 1,
    backgroundColor: COLORS.lightGray,
    padding: 40,
  },
  lastTitle: {
    fontSize: 24,
    marginBottom: 30,
    fontFamily: 'montserrat',
    fontWeight: 'bold',
  },
});
