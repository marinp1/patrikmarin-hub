import { AsyncStorage } from 'react-native';

const STORAGE_NAME = '@MyHub';
const STORAGE_KEYS = {
  latitude: 'latitude',
  longitude: 'longitude',
  error: 'error',
  city: 'city',
  country: 'country',
  timestamp: 'timestamp',
  service: 'service',
}

const setLatLng = async (latitude, longitude) => {
  try {
    await AsyncStorage.setItem(`${STORAGE_NAME}:${STORAGE_KEYS.latitude}`, String(latitude));
    await AsyncStorage.setItem(`${STORAGE_NAME}:${STORAGE_KEYS.longitude}`, String(longitude));
  } catch (error) {
    // Error saving data
  }
}

const setError = async (error) => {
  try {
    await AsyncStorage.setItem(`${STORAGE_NAME}:${STORAGE_KEYS.error}`, String(error));
  } catch (error) {
    // Error saving data
  }
}

const setLocation = async (city, country) => {
  try {
    await AsyncStorage.setItem(`${STORAGE_NAME}:${STORAGE_KEYS.city}`, String(city));
    await AsyncStorage.setItem(`${STORAGE_NAME}:${STORAGE_KEYS.country}`, String(country));
    const date = new Date();
    const dateAsString = date.toLocaleString('fi-FI');
    await AsyncStorage.setItem(`${STORAGE_NAME}:${STORAGE_KEYS.timestamp}`, String(dateAsString));
  } catch (error) {
    // Error saving data
  }
}

const setServiceStatus = async (status) => {
  try {
    await AsyncStorage.setItem(`${STORAGE_NAME}:${STORAGE_KEYS.service}`, String(status));
  } catch (error) {
    // Error saving data
  }
}

const getLatLng = async () => {
  try {
    const latitude = await AsyncStorage.getItem(`${STORAGE_NAME}:${STORAGE_KEYS.latitude}`);
    const longitude = await AsyncStorage.getItem(`${STORAGE_NAME}:${STORAGE_KEYS.longitude}`);
    return {
      latitude: latitude !== 'null' ? latitude : null,
      longitude: longitude !== 'null' ? longitude : null,
    }
   } catch (error) {
      return {
        latitude: null,
        longitude: null,
      }
   }
}

const getError = async () => {
  try {
    const err = await AsyncStorage.getItem(`${STORAGE_NAME}:${STORAGE_KEYS.error}`);
    if (!!err) return err;
    return null;
   } catch (error) {
    return null;
   }
}

const getLocation = async () => {
  try {
    const city = await AsyncStorage.getItem(`${STORAGE_NAME}:${STORAGE_KEYS.city}`);
    const country = await AsyncStorage.getItem(`${STORAGE_NAME}:${STORAGE_KEYS.country}`);
    return {
      city: city !== 'null' ? city : null,
      country: country !== 'null' ? country : null
    }
   } catch (error) {
    return {
      city: null,
      country: null,
    }
   }
}

const getTimestamp = async () => {
  try {
    const ts = await AsyncStorage.getItem(`${STORAGE_NAME}:${STORAGE_KEYS.timestamp}`);
    if (!!ts) return ts;
    return null;
   } catch (error) {
    return null;
   }
}

const getServiceStatus = async () => {
  try {
    const status = await AsyncStorage.getItem(`${STORAGE_NAME}:${STORAGE_KEYS.service}`);
    if (status === 'true') return true;
    if (status === 'false') return false;
    return false;
   } catch (error) {
    return false;
   }
}

export default {
  setLatLng,
  setError,
  setLocation,
  setServiceStatus,
  getLatLng,
  getError,
  getLocation,
  getTimestamp,
  getServiceStatus,
}