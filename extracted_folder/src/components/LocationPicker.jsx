import react, { useState, useCallback, useRef } from "react";
import { GoogleMap, Marker, LoadScript, Autocomplete } from "@react-google-maps/api";

const LocationPicker = ({ onLoctionSelect }) => {
    const [selectedPosition, setSelectedPositicon] = useState(null);
    const autocompleteRef = useRef(null);

    const handleMapClick = useCallback((event) => {
        const lat = event.latlng.lat();
        const lng = event.latlng.lng();
        setSelectedPositicon({ lat, lng });
        onLocationSelect({ lat, lng }); // pass back to parent
    }, 
    [onLocationSelect]
);

const handlePlaceChanged = () => {
    const place = autocompleteRef.current.getPlace();
    if (place && place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometr.location.lng();
        setSelectedPositicon({ lat, lng });
        onlocationSelect({ lat, lng });
    }
};

    const mapContainerStyle = {
        height: "300px",
        width: "100%",
        borderRadius: "10px",
        border: "1px solid #ddd", 
    };

    const defaultCenter = { lat: -1.286389, lng: 36.817223 }; // Nairobi Center

    return (
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
         libraries={[places]}
        >
          <div className="mb-3">
            <Autocomplete
              onLoad={(ref) => (autocompleteRef.current = ref)}
              onPlaceChanged={handlePlaceChanged}
            >
             <input
               type="text"
               placeholder="Search location(e.g. Westlands, Nairobi)"
               className="w-full p-2 border rounded mb-2"
            /> 
            </Autocomplete>
            </div>
              
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={selectedPosition || defaultCenter}
              zoom={selectedPosition ? 15 : 12}
              onClick={handleMapClick}
              >
                {selectedPosition && <Marker position={selectedPosition} />}
                </GoogleMap>
                <div className="mt-2 text-sm text-gray-700">
                    {selectedPosition ? (
                        <>
                          &#128205; <strong>Lat:</strong>{selectedPosition.lat.toFixed(5)},{" "}
                          <strong>Lng:</strong>{selectedPosition.lng.toFixed(5)}
                          </>
                    ) : (
                       "Click on the map to select property location." 
                    )}
                </div> 
        </LoadScript>
    );
};