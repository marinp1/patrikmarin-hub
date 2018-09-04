import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  infoContainer: {
    backgroundColor: 'white',
    width: '100%',
    padding: 20,
    borderRadius: 10,
    justifyContent: 'center',
    marginBottom: 20,
  },
  errorContainer: {
    backgroundColor: 'white',
    width: '100%',
    padding: 20,
    borderRadius: 10,
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  errorHeader: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  header: {
    marginBottom: 20,
  },
  listContainer: {
    backgroundColor: 'white',
    width: '100%',
    marginTop: 10,
    marginBottom: 20,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
  },
  lastUpdateStyle: {
    paddingLeft: 20,
    paddingTop: 15,
    paddingBottom: 0,
    alignSelf: 'flex-start',
    color: '#333',
    fontWeight: "bold",
    fontSize: 20,
  },
  clearButtonStyle: {
    backgroundColor: "#e1e1e1",
  },
  container: {
    backgroundColor: '#11001C',
    alignItems: 'center',
    padding: 24,
    flexDirection: 'column',
    flex: 1
  },
  refresh: {
    alignSelf: 'flex-end',
    position: 'absolute',
    top: 10,
    right: 10,
  }
});
