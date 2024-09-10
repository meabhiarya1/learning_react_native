import { Text, StyleSheet, View, TextInput, Button } from "react-native";
import { useState, useEffect } from "react";
import * as Location from "expo-location";

export default function Index() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [address, setAddress] = useState();


  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    })();
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }
  // console.log(location);

  const geocode = async () => {
    const geocodedlocation = await Location.geocodeAsync(address);
    console.log("geocodedlocation", geocodedlocation);
    return;
  };

  const reverseGeocode = async () => {
    const geocodedlocation = await Location.reverseGeocodeAsync(
      location.coords
    );
    console.log("reverseGeocodedlocation", geocodedlocation);
    return;
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Enter address"
        value={address}
        onChangeText={setAddress}
      />
      <Button title="Geocode Address" onPress={geocode} />
      <Button
        title="Rverse Geocode Current Location"
        onPress={reverseGeocode}
      />
      {/* <Text style={styles.paragraph}>{text}</Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "start",
    padding: 20,
    borderBlockColor: "red",
  },
  paragraph: {
    fontSize: 18,
    textAlign: "center",
  },
});
