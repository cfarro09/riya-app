import { FC, useEffect, useRef, useState } from 'react';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import { IonInput, IonItem, IonLabel, IonList } from '@ionic/react';
import { ActivityForm, useActivityAppState } from '../../../store/ActivityProvider';

interface LocationProps {
  update: (activity: Partial<ActivityForm>) => void;
}

const Location: FC<LocationProps> = ({ update }) => {
  const { activityForm: { currentActivity } } = useActivityAppState();
  const mapRef = useRef<HTMLDivElement>(null);
  const [address, setAddress] = useState(currentActivity?.address || '');
  const [coordinates, setCoordinate] = useState({
    lat: currentActivity?.lat || 0,
    lng: currentActivity?.lng || 0,
  });
  const [reference, setReference] = useState(currentActivity?.reference || '');
  
  useEffect(() => {
    update( { currentActivity: { ...currentActivity, address, reference, ...coordinates } });
  }, [address, reference, coordinates]);

  async function handleSelect(address: string) {
    setAddress(address);
    try {
      const results = await geocodeByAddress(address);
      const latLng = await getLatLng(results[0]);
      setCoordinate(latLng);
    } catch (error) {
      console.error('Error', error);
    }
  }

  async function createMap() {
    if (!mapRef.current) return;
    const coords = coordinates.lat === 0 ? { lat: -6.7755422, lng: -79.8371669 } : coordinates;

    const map = new window.google.maps.Map(mapRef.current, {
      center: coords,
      streetViewControl: false,
      mapTypeControl: false,
      zoomControl: false,
      zoom: 17,
      draggable: false,
    });

    if (coordinates.lat !== 0) {
      const marker = new window.google.maps.Marker({
        position: coordinates,
        map: map,
        title: address,
        draggable: true,
      });

      marker.addListener('dragend', (event: any) => {
        const { latLng } = event;
        setCoordinate({ lat: latLng.lat(), lng: latLng.lng() });
      });
    }
  }

  useEffect(() => {
    createMap();
  }, [coordinates]);

  return (
    <div className="ion-padding">
      <PlacesAutocomplete
        value={address}
        onChange={setAddress}
        onSelect={handleSelect}
        searchOptions={{ componentRestrictions: { country: 'pe' } }}
      >
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div className='autocomplete-container'>
            <input
              style={{ marginBottom: '1rem', width: '100%' }}
              {...getInputProps({
                placeholder: 'Ingresa dirección',
                className: 'location-search-input',
              })}
            />
            <div className="autocomplete-dropdown-container">
              <IonList lines="full">
                {loading && <IonItem>Loading...</IonItem>}
                {suggestions.map((suggestion) => (
                  <IonItem {...getSuggestionItemProps(suggestion)} className="prediction-item">
                    <IonLabel>{suggestion.description} </IonLabel>
                  </IonItem>
                ))}
              </IonList>
            </div>
          </div>
        )}
      </PlacesAutocomplete>
      <div
        ref={mapRef}
        id="map"
        style={{ display: 'block', width: '100%', height: '200px', borderRadius: '10px' }}
      />
      <IonInput
        mode="md"
        label="Referencia de dirección"
        labelPlacement="floating"
        fill="outline"
        placeholder="Ingresa referencia"
        className="ion-margin-vertical"
        value={reference}
        debounce={200}
        onIonInput={(event) => setReference(String(event.target.value) ?? '')}
      />
    </div>
  );
};

export default Location;
