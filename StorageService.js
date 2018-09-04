import { AsyncStorage } from 'react-native';

const STORAGE_NAME = '@MyHub';
const STORAGE_KEYS = {
  latitude: 'latitude',
  longitude: 'longitude',
  error: 'error',
  city: 'city',
  country: 'country',
  timestamp: 'timestamp',
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

const getLatLng = async () => {
  try {
    const lat = await AsyncStorage.getItem(`${STORAGE_NAME}:${STORAGE_KEYS.latitude}`);
    const lng = await AsyncStorage.getItem(`${STORAGE_NAME}:${STORAGE_KEYS.longitude}`);
    if (!!lat && !!lng) {
      return {
        lat,
        lng,
      }
    }
   } catch (error) {
      return {
        lat: null,
        lng: null,
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
      city: city || null,
      country: country || null,
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

export default {
  setLatLng,
  setError,
  setLocation,
  getLatLng,
  getError,
  getLocation,
  getTimestamp,
}