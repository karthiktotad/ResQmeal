import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

interface MapMarker {
  id: string;
  position: google.maps.LatLngLiteral;
  type: 'donor' | 'receiver' | 'point' | 'agent';
  title: string;
  details?: string;
  status?: string;
}

interface MapProps {
  center?: google.maps.LatLngLiteral;
  zoom?: number;
  markers?: MapMarker[];
  showRoute?: { origin: google.maps.LatLngLiteral; destination: google.maps.LatLngLiteral };
  onMarkerClick?: (marker: MapMarker) => void;
  className?: string;
}

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '1.5rem'
};

const darkThemeStyles: google.maps.MapTypeStyle[] = [
  { elementType: "geometry", stylers: [{ color: "#212121" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#757575" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#212121" }] },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#757575" }],
  },
  {
    featureType: "administrative.country",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9e9e9e" }],
  },
  {
    featureType: "administrative.land_parcel",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#bdbdbd" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#757575" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#181818" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#616161" }],
  },
  {
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [{ color: "#2c2c2c" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#8a8a8a" }],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{ color: "#373737" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#3c3c3c" }],
  },
  {
    featureType: "road.highway.controlled_access",
    elementType: "geometry",
    stylers: [{ color: "#4e4e4e" }],
  },
  {
    featureType: "road.local",
    elementType: "labels.text.fill",
    stylers: [{ color: "#616161" }],
  },
  {
    featureType: "transit",
    elementType: "labels.text.fill",
    stylers: [{ color: "#757575" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#000000" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#3d3d3d" }],
  },
];

const markerIcons = {
  donor: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  receiver: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  point: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
  agent: "https://maps.google.com/mapfiles/kml/pal4/icon54.png" // Delivery truck icon
};

const MapContainer: React.FC<MapProps> = ({ 
  center = { lat: 12.9716, lng: 77.5946 }, 
  zoom = 12, 
  markers = [], 
  showRoute,
  onMarkerClick,
  className 
}) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
  });

  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);
  const [currentLocation, setCurrentLocation] = useState<google.maps.LatLngLiteral>(center);

  const onLoad = useCallback((_map: google.maps.Map) => {
    // Map instance available if needed
  }, []);

  const onUnmount = useCallback(() => {
    // Cleanup if needed
  }, []);

  // Use geolocation to center the map if no center is provided
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          console.warn("Geolocation permission denied. Using default center.");
        }
      );
    }
  }, []);

  const directionsCallback = useCallback((result: google.maps.DirectionsResult | null, status: google.maps.DirectionsStatus) => {
    if (status === 'OK' && result) {
      setDirections(result);
    } else {
      console.error(`Error fetching directions: ${status}`);
    }
  }, []);

  const options = useMemo(() => ({
    styles: darkThemeStyles,
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: true,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: true,
  }), []);

  if (!isLoaded) {
    return (
      <div className={`w-full h-full min-h-[400px] flex items-center justify-center bg-[#1E293B] rounded-3xl animate-pulse ${className}`}>
        <p className="text-[#94A3B8] font-bold">Loading Satellite Grid...</p>
      </div>
    );
  }

  return (
    <div className={`w-full h-full ${className}`}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentLocation}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={options}
      >
        {/* Render Markers */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={marker.position}
            icon={markerIcons[marker.type]}
            onClick={() => {
              setSelectedMarker(marker);
              if (onMarkerClick) onMarkerClick(marker);
            }}
          />
        ))}

        {/* Selected Marker InfoWindow */}
        {selectedMarker && (
          <InfoWindow
            position={selectedMarker.position}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="p-2 text-[#0F172A]">
              <h4 className="font-bold border-b border-[#E2E8F0] pb-1 mb-1">{selectedMarker.title}</h4>
              <p className="text-xs font-semibold capitalize text-[#64748B] mb-1">{selectedMarker.type}</p>
              {selectedMarker.details && <p className="text-xs mb-1">{selectedMarker.details}</p>}
              {selectedMarker.status && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#16A34A] text-white font-bold">
                  {selectedMarker.status}
                </span>
              )}
            </div>
          </InfoWindow>
        )}

        {/* Directions Service and Renderer */}
        {showRoute && (
          <>
            <DirectionsService
              options={{
                origin: showRoute.origin,
                destination: showRoute.destination,
                travelMode: google.maps.TravelMode.DRIVING,
              }}
              callback={directionsCallback}
            />
            {directions && (
              <DirectionsRenderer
                options={{
                  directions: directions,
                  polylineOptions: {
                    strokeColor: "#16A34A",
                    strokeWeight: 6,
                    strokeOpacity: 0.8,
                  },
                  markerOptions: {
                    visible: false // We use our own markers
                  }
                }}
              />
            )}
          </>
        )}
      </GoogleMap>
    </div>
  );
};

export default React.memo(MapContainer);
