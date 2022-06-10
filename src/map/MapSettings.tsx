import mapboxgl from 'mapbox-gl';
import TOKEN from './Token';

const satellite = 'mapbox://styles/mapbox/satellite-v9'

export const InitMap = () => {
  const map = new mapboxgl.Map({
    container: document.getElementById('mapContainer') as HTMLElement,
    center: [141.6769, 42.7831],
    pitch: 60,
    zoom: 15,
    antialias: true,
    style: satellite,
    accessToken: TOKEN
  });
  return map;
}

export default InitMap;
