import React, { useEffect, useRef } from 'react';
import { TweenMax } from 'gsap';
import MapboxGL from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './App.css';

const loadImage = (map, imgName) => {
  const img = document.createElement('img');
  img.src = `/${imgName}.png`;
  img.alt = 'Charmander';

  img.addEventListener('load', () => {
    map.addImage(imgName, img);
  });
};

const directions = {
  coordinates: [
    [-122.640945, 45.559196],
    [-122.640915, 45.561539],
    [-122.62989, 45.561512],
    [-122.629898, 45.562]
  ],
  type: 'LineString'
};

const tweenDirections = {
  lat1: -122.640915,
  lon1: 45.561539,
  lat2: -122.62989,
  lon2: 45.561512,
  lat3: -122.629898,
  lon3: 45.562
};

const position = { lat: -122.640945, long: 45.559196 };

function App() {
  const mapRef = useRef();

  // TODO env vars!
  MapboxGL.accessToken =
    'pk.eyJ1IjoiamxlbmdzdG9yZiIsImEiOiJ1RGdudElVIn0.mvDUX-HwJCJNvoSWMfI5Cw';

  useEffect(() => {
    const map = new MapboxGL.Map({
      container: mapRef.current,
      style: 'mapbox://styles/jlengstorf/ck5gzma3v08ae1iobx7fs2sd0',
      center: [-122.64083147048949, 45.559196330304715],
      zoom: 14
    });

    const geoJSON = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: [-122.64083147048949, 45.559196330304715]
          }
        }
      ]
    };

    map.on('load', () => {
      // CHARMANDER STUFF
      map.addSource('charmander-start', {
        type: 'geojson',
        data: geoJSON
      });

      map.addLayer({
        id: 'charmander',
        source: 'charmander-start',
        // type: 'circle',
        // paint: {
        //   'circle-radius': 4
        // }
        type: 'symbol',
        layout: {
          'icon-image': 'charmander-stand',
          'icon-offset': [0, -70],
          'icon-size': 0.2
        }
      });

      const images = [
        'charmander-stand',
        'charmander-left-foot',
        'charmander-stand',
        'charmander-right-foot'
      ];

      // TODO skip second stand load
      images.forEach(img => loadImage(map, img));

      let count = 0;
      setInterval(() => {
        map.setLayoutProperty('charmander', 'icon-image', images[count++ % 4]);
      }, 300);

      // DIRECTIONS STUFF
      map.addSource('walking-directions', {
        type: 'geojson',
        data: directions
      });

      map.addLayer({
        id: 'walking',
        source: 'walking-directions',
        type: 'line'
      });

      setTimeout(() => {
        TweenMax.to(position, {
          lat: tweenDirections.lat1,
          lon: tweenDirections.lon1,
          duration: 2,
          onUpdate: updateCharmander,
          delay: 0
        });
        TweenMax.to(position, {
          lat: tweenDirections.lat2,
          lon: tweenDirections.lon2,
          duration: 2,
          delay: 2,
          onUpdate: updateCharmander
        });
        TweenMax.to(position, {
          lat: tweenDirections.lat3,
          lon: tweenDirections.lon3,
          duration: 2,
          delay: 4,
          onUpdate: updateCharmander
        });
      }, 2000);
    });

    function updateCharmander() {
      map.getSource('charmander-start').setData({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: [position.lat, position.lon]
            }
          }
        ]
      });
    }
  }, [mapRef]);

  return (
    <div className="App">
      <div className="map" ref={mapRef} />
    </div>
  );
}

export default App;
