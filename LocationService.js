import base64 from 'base-64';
import StorageService from './StorageService';
import { GOOGLE_API_KEY, LOC_USERNAME, LOC_PASSWORD, POST_BASE_URL } from 'react-native-dotenv';
import Geolocation from 'react-native-geolocation-service';

const sendLocation = async (latitude, longitude) => {
  if (!latitude || !longitude) return;
  const location = await reverseGeolocate(latitude, longitude);
  const headers = new Headers();
  headers.append('Authorization', 'Basic ' + base64.encode(`${LOC_USERNAME}:${LOC_PASSWORD}`));
  headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');

  const formBody = Object.keys(location).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(location[key])).join('&');

  try {
    await fetch(`${POST_BASE_URL}/api/location`, {
      method: 'POST',
      headers: headers,
      body: formBody,
    });
  } catch (error) {
    console.log(error);
  }
}

const getInAccuratePosition = () => {
  Geolocation.getCurrentPosition(
    async (position) => {
      await StorageService.setLatLng(position.coords.latitude, position.coords.longitude);
      await StorageService.setError(null);
    },
    async (error) => await StorageService.setError(error.message),
    { enableHighAccuracy: false, timeout: 30000, maximumAge: 600000 },
  );
}

const getLocation = async () => {
  let coordinates = await StorageService.getLatLng();

  Geolocation.getCurrentPosition(
      async (position) => {
        await StorageService.setLatLng(position.coords.latitude, position.coords.longitude);
        await StorageService.setError(null);
      },
      (error) => {
        console.log(error.code, error.message);
        getInAccuratePosition();
      },
      { enableHighAccuracy: true, timeout: 30000, maximumAge: 600000 }
  );

  await sendLocation(coordinates.lat, coordinates.lng);
}


const reverseGeolocate = async (latitude, longitude) => {
  if (!latitude || !longitude) {
    await StorageService.setLocation(null, null);
    return {
      city: null,
      country: null,
    }
  }

  try {

    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude}, ${longitude}&key=${GOOGLE_API_KEY}&language=en`, {
      method: 'GET',
    })

    const responseJson = await response.json();
    const first = responseJson.results[0];

    let city = null;
    let country = null;

    for (addressComponent of first.address_components) {
      if (addressComponent.types.indexOf('locality') > -1) {
        city = addressComponent.long_name || addressComponent.short_name;
      } else if (addressComponent.types.indexOf('country') > -1) {
        country = addressComponent.long_name || addressComponent.short_name;
      }
    }

    if (country === 'Finland') {
      for (addressComponent of first.address_components) {
        if (addressComponent.types.indexOf('administrative_area_level_3') > -1) {
          city = addressComponent.long_name || addressComponent.short_name;
        }
      }
    }

    await StorageService.setLocation(city, country);

    return {
      city,
      country,
    }

  } catch (error) {
    console.log(error);
    await StorageService.setLocation(null, null);
    return {
      city: null,
      country: null,
    }
  }
}

const removeLocation = async () => {
  const headers = new Headers();
  headers.append('Authorization', 'Basic ' + base64.encode(`${LOC_USERNAME}:${LOC_PASSWORD}`));
  headers.append('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');

  const location = {
    city: null,
    country: null,
  }

  const formBody = Object.keys(location).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(location[key])).join('&');

  try {
    await fetch(`${POST_BASE_URL}/api/location`, {
      method: 'POST',
      headers: headers,
      body: formBody,
    });
    await StorageService.setLocation(null, null);
    await StorageService.setLatLng(null, null);
    await StorageService.setError(null);
  } catch (error) {
    console.log(error);
  }
}

export default {
  getLocation,
  reverseGeolocate,
  sendLocation,
  removeLocation,
}