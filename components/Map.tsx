import { ActivityIndicator, Text, View } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from "react-native-maps";
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

import MapViewDirections from "react-native-maps-directions";
import polyline from "@mapbox/polyline";

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
  const [polylineCoords, setPolylineCoords] = useState<
    { latitude: number; longitude: number }[]
  >([]);

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
  }, [drivers, userLongitude, userLatitude]);

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

  // Fetch route from ORS
  useEffect(() => {
    const fetchRoute = async () => {
      if (
        !userLatitude ||
        !userLongitude ||
        !destinationLatitude ||
        !destinationLongitude
      ) {
        console.warn("Missing location data");
        return;
      }
      console.log("Sending to ORS:", {
        origin: [userLongitude, userLatitude],
        destination: [destinationLongitude, destinationLatitude],
      });

      try {
        const response = await fetch(
          "https://api.openrouteservice.org/v2/directions/driving-car",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.EXPO_PUBLIC_ORS_API_KEY}`,
            },
            body: JSON.stringify({
              coordinates: [
                [userLongitude, userLatitude],
                [destinationLongitude, destinationLatitude],
              ],
            }),
          },
        );

        const data = await response.json();
        const encoded = data.routes?.[0]?.geometry;

        if (encoded) {
          const coords = polyline
            .decode(encoded)
            .map(([lat, lon]) => ({ latitude: lat, longitude: lon }));

          setPolylineCoords(coords);
        } else {
          console.warn("Empty polyline from ORS");
        }
      } catch (err) {
        console.error("ORS error:", err);
      }
    };

    const timeout = setTimeout(fetchRoute, 800);
    return () => clearTimeout(timeout);
  }, [userLatitude, userLongitude, destinationLatitude, destinationLongitude]);

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
        {destinationLatitude && destinationLongitude && (
          <>
            <Marker
              key="destination"
              coordinate={{
                latitude: destinationLatitude,
                longitude: destinationLongitude,
              }}
              title="Destination"
              image={icons.pin}
            />
            {polylineCoords.length > 0 && (
              <Polyline
                coordinates={polylineCoords}
                strokeColor="#0286ff"
                strokeWidth={3}
              />
            )}

            {/*<MapViewDirections*/}
            {/*  origin={{*/}
            {/*    latitude: userLatitude!,*/}
            {/*    longitude: userLongitude!,*/}
            {/*  }}*/}
            {/*  destination={{*/}
            {/*    latitude: destinationLatitude,*/}
            {/*    longitude: destinationLongitude,*/}
            {/*  }}*/}
            {/*  apikey={process.env.EXPO_PUBLIC_GOOGLE_API_KEY}*/}
            {/*  strokeColor="#0286ff"*/}
            {/*  strokeWidth={3}*/}
            {/*/>*/}
          </>
        )}
      </MapView>
      <Text className="absolute top-2 left-2 text-black z-10">Map</Text>
    </View>
  );
};
export default Map;
