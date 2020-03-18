import {
  Component,
  OnInit
} from '@angular/core';
import * as mapbox from 'mapbox-gl';
import {
  environment
} from '../../environments/environment';
import axios from 'axios';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  constructor() {}
  map: mapbox.Map;

  title = 'My Weather Application';
  count = 0;
  style = 'mapbox://styles/mapbox/streets-v11';
  sendData(receiveData) {
    axios.get(`http://localhost:3000/weather?count=${receiveData}`)
      .then(response => {
        console.log(response.data);
        const savedData = response.data;
        for (let i = 0; i < savedData.data.length; i++) {
          const geocoordinates = [savedData.data[i].coord.lon, savedData.data[i].coord.lat]
          const weatherInfo = savedData.data[i].weather[0].description;
          this.map.addSource('point' + i, {
            type: 'geojson',
            data: {
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: geocoordinates

              },
              properties: {
                title: 'Mapbox DC',
                'marker-symbol': 'monument'
              }
            }


          });
          this.map.addLayer({
            id: 'firstlayer' + i,
            type: 'circle',
            source: 'point' + i,
            paint: {
              'circle-radius': 10,
              'circle-color': '#FFFF00'
            }

          })

          // Create a popup, but don't add it to the map yet.
          const popup = new mapbox.Popup({
            closeButton: false,
            closeOnClick: false
          });
          

          this.map.on('mouseenter', 'firstlayer' + i,(e)=> {

            // Change the cursor style as a UI indicator.

            this.map.getCanvas().style.cursor = 'pointer';

             // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.

            while (Math.abs(e.lngLat.lng - geocoordinates[0]) > 180) {
              geocoordinates[0] += e.lngLat.lng > geocoordinates[0] ? 360 : -360;
            }

            // Populate the popup and set its coordinates
            // based on the feature found.
            
            popup
              .setLngLat([geocoordinates[0],geocoordinates[1]])
              .setHTML(weatherInfo)
              .addTo(this.map);
          });

          this.map.on('mouseleave', 'firstlayer' + i, () => {
            this.map.getCanvas().style.cursor = '';
            popup.remove();
          });

        }
      });
  }
  ngOnInit(): void {
    Object.getOwnPropertyDescriptor(mapbox, 'accessToken').set(environment.mapbox.apikey);
    // mapbox.accessToken= environment.mapbox.apikey
    this.map = new mapbox.Map({
      container: 'map',
      style: this.style,
      zoom: 10,
      center: [74.0060, 40.7128]
    });
    // Add map controls
    this.map.addControl(new mapbox.NavigationControl());
  }
}
