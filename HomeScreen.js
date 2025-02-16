"use client"

import { useState, useEffect, useRef } from "react"
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
} from "react-native"
import * as Location from "expo-location"
import { Ionicons } from "@expo/vector-icons"

const { height, width } = Dimensions.get("window")

const services = [
  { id: "1", name: "Clinics", icon: "medkit" },
  { id: "2", name: "Physiotherapist", icon: "medical" },
  { id: "3", name: "Care Taker", icon: "heart" },
  { id: "4", name: "Home Maids", icon: "home" },
  { id: "5", name: "Electrician", icon: "flash" },
  { id: "6", name: "Plumber", icon: "water" },
  { id: "7", name: "Home Shifters", icon: "car" },
  { id: "8", name: "Painting", icon: "color-palette" },
  { id: "9", name: "Saloons", icon: "cut" },
  { id: "10", name: "Pest Control", icon: "bug" },
  { id: "11", name: "Mechanic", icon: "construct" },
  { id: "12", name: "Bike Rental", icon: "bicycle" },
]

const serviceImages = [
  require("./assets/1.jpg"),
  require("./assets/4.webp"),
  require("./assets/home2.jpg"),
  require("./assets/5..png"),
  require("./assets/shift.webp"),
]

export default function HomeScreen({ route, navigation }) {
  const [searchQuery, setSearchQuery] = useState("")
  const scrollViewRef = useRef()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [username, setUsername] = useState("User")
  const [location, setLocation] = useState("Fetching location...")

  useEffect(() => {
    // Fetch username from route params (passed from login page)
    if (route.params?.username) {
      setUsername(route.params.username)
    }
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        setLocation("Location permission denied")
        return
      }

      const locationData = await Location.getCurrentPositionAsync({})
      const reverseGeocode = await Location.reverseGeocodeAsync(locationData.coords)

      if (reverseGeocode.length > 0) {
        const address = reverseGeocode[0]
        setLocation(`${address.city}, ${address.region}, ${address.country}`)
      } else {
        setLocation("Location not found")
      }
    })()
  }, [route.params?.username])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = prevIndex === serviceImages.length - 1 ? 0 : prevIndex + 1
        scrollViewRef.current?.scrollTo({ x: nextIndex * width, animated: true })
        return nextIndex
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  const filteredServices = services.filter((service) => service.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const renderServiceItem = ({ item }) => (
    <TouchableOpacity
      style={styles.serviceItem}
      onPress={() => navigation.navigate("ServiceDetail", { service: item })}
    >
      <View style={styles.serviceIcon}>
        <Ionicons name={item.icon} size={32} color="#A855F7" />
      </View>
      <Text style={styles.serviceName}>{item.name}</Text>
    </TouchableOpacity>
  )

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.greeting}>Hi, {username}</Text>
          <Text style={styles.location}>
            <Ionicons name="location" size={16} color="white" /> {location}
          </Text>
          <Text style={styles.title}>Uni-Sphere</Text>
        </View>
        <View style={styles.headerRight}>
          <Image source={require("./assets/profile.png")} style={styles.profilePic} />
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search services..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.sliderWrapper}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          style={styles.sliderContainer}
        >
          {serviceImages.map((image, index) => (
            <View key={index} style={styles.slideWrapper}>
              <Image source={image} style={styles.slideImage} resizeMode="cover" />
            </View>
          ))}
        </ScrollView>

        <View style={styles.pagination}>
          {serviceImages.map((_, index) => (
            <View
              key={index}
              style={[styles.dot, { backgroundColor: currentIndex === index ? "#A855F7" : "#C4C4C4" }]}
            />
          ))}
        </View>
      </View>

      <FlatList
        data={filteredServices}
        renderItem={renderServiceItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={styles.servicesList}
        scrollEnabled={false}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingBottom: height * 0.02,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#A855F7",
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    justifyContent: "center", // Center the profile pic vertically
    alignItems: "center",
    marginTop: 30, // Adjust as needed
  },
  greeting: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  location: {
    fontSize: 14,
    color: "white",
    marginTop: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginTop: 8,
  },
  profilePic: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderColor: "white",
    borderWidth: 2,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginVertical: height * 0.015,
    borderWidth: 2,
    borderColor: "black",
  },
  searchInput: {
    flex: 1,
    height: height * 0.05,
    marginLeft: 8,
    fontSize: height * 0.02,
  },
  sliderWrapper: {
    alignItems: "center",
    marginTop: 10,
  },
  sliderContainer: {
    width: width,
    height: height * 0.35,
  },
  slideWrapper: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
  },
  slideImage: {
    width: width * 0.85,
    height: height * 0.28,
    borderRadius: 20,
  },
  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 6,
  },
  servicesList: {
    paddingHorizontal: 16,
    paddingBottom: height * 0.02,
  },
  serviceItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: height * 0.03,
    margin: 8,
    backgroundColor: "#F3F4F6",
    borderRadius: 12,
    height: height * 0.15,
  },
  serviceName: {
    marginTop: 5,
  },
  serviceIcon: {
    marginBottom: 5,
  },
})

