import { ActivityIndicator, Text, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { useDriverStore, useLocationStore } from "@/store";
import {
  calculateDriverTimes,
  calculateRegion,
  generateMarkersFromData,
} from "@/lib/map";
import { useEffect, useState } from "react";
import { Driver, MarkerData } from "@/types/type";
import { icons } from "@/constants";
import { useFetch } from "@/lib/fetch";

const Map = () => {
  const { data: drivers, loading, error } = useFetch<Driver[]>("/(api)/driver");
  const {
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationLongitude,
  } = useLocationStore();

  const { selectedDriver, setDrivers } = useDriverStore();
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  const region = calculateRegion({
    userLongitude,
    userLatitude,
    destinationLatitude,
    destinationLongitude,
  });

  useEffect(() => {
    if (Array.isArray(drivers)) {
      if (!userLatitude || !userLongitude) return;
      const newMarkers = generateMarkersFromData({
        data: drivers,
        userLatitude,
        userLongitude,
      });
      setMarkers(newMarkers);
    }
  }, [drivers]);

  useEffect(() => {
    if (markers.length > 0 && destinationLongitude && destinationLongitude) {
      calculateDriverTimes({
        markers,
        userLongitude,
        userLatitude,
        destinationLatitude,
        destinationLongitude,
      }).then((drivers) => {
        setDrivers(drivers as MarkerData[]);
      });
    }
  }, [markers, destinationLongitude, destinationLatitude]);

  if (loading || !userLatitude || !userLongitude) {
    return (
      <View className="flex justify-between items-center w-full">
        <ActivityIndicator size="small" color="#000" />
      </View>
    );
  }
  if (error) {
    return (
      <View className="flex justify-between items-center w-full">
        <Text>Error: {error}</Text>
      </View>
    );
  }
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
        initialRegion={region}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={{
              latitude: marker.latitude,
              longitude: marker.longitude,
            }}
            title={marker.title}
            image={
              selectedDriver === marker.id ? icons.selectedMarker : icons.marker
            }
          />
        ))}
      </MapView>
      <Text className="absolute top-2 left-2 text-black z-10">Map</Text>
    </View>
  );
};
export default Map;
