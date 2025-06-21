import { Text, View } from "react-native";
import MapView, { PROVIDER_DEFAULT } from "react-native-maps";

const Map = () => {
  // const region = {};
  return (
    <View className="w-full h-full rounded-2xl">
      <MapView
        provider={PROVIDER_DEFAULT}
        showsPointsOfInterest={false}
        style={{ flex: 1 }}
        tintColor="black"
        showsUserLocation={true}
        userInterfaceStyle="light"

        // mapType="mutedStandard"
        //initialRegion={region}
      ></MapView>
      <Text className="absolute top-2 left-2 text-black z-10">Map</Text>
    </View>
  );
};
export default Map;
