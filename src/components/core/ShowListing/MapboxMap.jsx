import  { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Home from '../../../assets/images/home.jpg'

// Define your Mapbox access token (replace with your actual token)
const mapToken =import.meta.env.VITE_REACT_APP_MAPBOX_API_KEY;
mapboxgl.accessToken = mapToken;

const MapboxMap = ({ listing }) => {
  const mapContainer = useRef(null); // Reference to the map container

  // Function to determine if it's nighttime in India (between 7 PM and 4 AM)
  const isNightTimeInIndia = () => {
    const now = new Date();
    const hours = (now.getUTCHours() + 5.5) % 24;  // Adjust for Indian Standard Time (UTC+5:30)
    return hours >= 19 || hours < 4;
  };

  useEffect(() => {
    if (!listing?.geometry?.coordinates) return;

    // Define the initial map style based on the current time
    let initialStyle = isNightTimeInIndia()
      ? 'mapbox://styles/mapbox/navigation-night-v1'
      : 'mapbox://styles/mapbox/streets-v12';

    // Initialize the map
    const map = new mapboxgl.Map({
      container: mapContainer.current, // container ID
      style: initialStyle, // initial style URL
      center: listing.geometry.coordinates, // starting position [lng, lat]
      zoom: 9 // starting zoom
    });

    // Create a custom marker element
    const customMarker = document.createElement('div');
    customMarker.className = 'custom-marker';
    customMarker.style.backgroundImage = `url(${Home})`; // Path to your custom icon
    customMarker.style.backgroundSize = '100%';
    customMarker.style.width = '32px';
    customMarker.style.height = '32px';

    // Add a marker to the map
    const marker = new mapboxgl.Marker(customMarker)
      .setLngLat(listing.geometry.coordinates)
      .setPopup(
        new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<h3>${listing.title}</h3>
          <p>Exact location will be provided after booking</p>`
        )
      )
      .addTo(map);

    // Update the map style based on the current time every 1 minute
    const intervalId = setInterval(() => {
      const newStyle = isNightTimeInIndia()
        ? 'mapbox://styles/mapbox/dark-v11'
        : 'mapbox://styles/mapbox/streets-v12';
      if (map.getStyle().name !== newStyle) {
        map.setStyle(newStyle);
      }
    }, 60000); // Check every minute for style update

    // Cleanup on component unmount
    return () => {
      clearInterval(intervalId);
      map.remove();
    };
  }, [listing]);

  return (
    <div>
      <div ref={mapContainer} className='transition-hover duration-300 hover:shadow-[2px_2px_16px_gray] rounded-[1rem] sm:max-w-[90%] mx-auto my-10 h-[450px] p-2' />
    </div>
  );
};

export default MapboxMap;
