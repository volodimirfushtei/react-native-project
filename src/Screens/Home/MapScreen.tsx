import React from 'react';
import {Alert, Linking, Platform, Pressable, StyleSheet, Text, View,} from 'react-native';
import type {RouteProp} from '@react-navigation/native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {Feather} from '@expo/vector-icons';
import MapView, {Marker} from 'react-native-maps';
import type {RootStackParamList} from '@/types/navigation.types';

type MapScreenRouteProp = RouteProp<RootStackParamList, 'MapScreen'>;

const MapScreen: React.FC = () => {
    const route = useRoute<MapScreenRouteProp>();
    const navigation = useNavigation();
    const {location, latitude, longitude} = route.params;

    // Дефолтні координати (Київ)
    const defaultLatitude = 50.4501;
    const defaultLongitude = 30.5234;

    const mapRegion = {
        latitude: latitude || defaultLatitude,
        longitude: longitude || defaultLongitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };

    const handleOpenInMaps = () => {
        const scheme = Platform.select({
            ios: 'maps:0,0?q=',
            android: 'geo:0,0?q=',
        });
        const latLng = `${latitude || defaultLatitude},${longitude || defaultLongitude}`;
        const label = location;
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`,
        });

        if (url) {
            Linking.openURL(url).catch(() => {
                Alert.alert('Помилка', 'Не вдалося відкрити мапу');
            });
        }
    };

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable style={styles.backButton} onPress={handleBack}>
                    <Feather name="arrow-left" size={24} color="#bdbdbd"/>
                </Pressable>
                <Text style={styles.headerTitle}>Мапа</Text>
                <View style={styles.headerRight}/>
            </View>

            {/* Map */}
            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    region={mapRegion}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                >
                    <Marker
                        coordinate={{
                            latitude: latitude || defaultLatitude,
                            longitude: longitude || defaultLongitude,
                        }}
                        title={location}
                        description="Місце зйомки"
                    />
                </MapView>
            </View>

            {/* Location Info */}
            <View style={styles.locationInfo}>
                <View style={styles.locationHeader}>
                    <Feather name="map-pin" size={20} color="#FF6C00"/>
                    <Text style={styles.locationTitle}>Локація</Text>
                </View>
                <Text style={styles.locationName}>{location}</Text>
                <Pressable style={styles.openMapsButton} onPress={handleOpenInMaps}>
                    <Text style={styles.openMapsText}>Відкрити в мапах</Text>
                    <Feather name="external-link" size={16} color="#FF6C00"/>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        height: 88,
        paddingTop: 44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E8E8E8',
        backgroundColor: '#fff',
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: '500',
        color: '#212121',
    },
    headerRight: {
        width: 40,
    },
    mapContainer: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    locationInfo: {
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#E8E8E8',
        backgroundColor: '#fff',
    },
    locationHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    locationTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#212121',
        marginLeft: 8,
    },
    locationName: {
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
    },
    openMapsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#FF6C00',
        borderRadius: 20,
    },
    openMapsText: {
        fontSize: 14,
        color: '#FF6C00',
        marginRight: 6,
        fontWeight: '500',
    },
});

export default MapScreen;