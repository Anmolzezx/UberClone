import { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
} from "react-native";
import { icons } from "@/constants";
import { GoogleInputProps, NominatimResult } from "@/types/type";

const CustomTextInput = ({
  icon,
  initialLocation,
  containerStyle,
  textInputBackgroundColor,
  handlePress,
}: GoogleInputProps) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<NominatimResult[]>([]);

  useEffect(() => {
    if (query.length < 3) return setResults([]);

    const timeout = setTimeout(() => {
      fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query,
        )}&format=json&addressdetails=1`,
        {
          headers: {
            "User-Agent": "MyUberCloneApp/1.0 (zezx90453@email.com)",
            Accept: "application/json",
          },
        },
      )
        .then((res) => res.json())
        .then((data) => setResults(data))
        .catch((err) => console.error("Nominatim error:", err));
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: textInputBackgroundColor || "#fff" },
      ]}
      className={`relative z-50 rounded-xl ${containerStyle}`}
    >
      <View className="flex-row items-center p-3">
        <Image
          source={icon || icons.search}
          style={{ width: 24, height: 24, marginRight: 8 }}
          resizeMode="contain"
        />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={initialLocation ?? "Where do you want to go?"}
          placeholderTextColor="gray"
          style={styles.input}
        />
      </View>

      {results.length > 0 && (
        <FlatList
          data={results}
          keyExtractor={(item) => item.place_id}
          style={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.item}
              onPress={() => {
                handlePress({
                  latitude: parseFloat(item.lat),
                  longitude: parseFloat(item.lon),
                  address: item.display_name,
                });
                setQuery(item.display_name);
                setResults([]);
              }}
            >
              <Text>{item.display_name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    borderRadius: 10,
    shadowColor: "#d4d4d4",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    paddingVertical: 10,
  },
  list: {
    maxHeight: 200,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginHorizontal: 10,
  },
  item: {
    padding: 10,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
});

export default CustomTextInput;
