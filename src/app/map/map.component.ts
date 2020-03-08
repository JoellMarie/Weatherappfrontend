import { Component, OnInit } from '@angular/core';
import * as mapbox from 'mapbox-gl';
import {environment} from '../../environments/environment';
import axios from 'axios';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  constructor() { }
  map: mapbox.Map;

  title = 'My Weather Application';
   count = 0;
  style = 'mapbox://styles/mapbox/streets-v11';
   sendData(receiveData) {
     axios.get('http://localhost:3000/weather')
     .then(response => {
      console.log(response.data);
      const savedData = response.data;
     });

   }

  ngOnInit(): void {
    Object.getOwnPropertyDescriptor(mapbox, 'accessToken').set(environment.mapbox.apikey);
    // mapbox.accessToken= environment.mapbox.apikey
    this.map = new mapbox.Map({
      container: 'map',
      style: this.style,
      zoom: 13,
      center: [74.0060, 40.7128]
    });
    // Add map controls
    this.map.addControl(new mapbox.NavigationControl());
  }


  }


