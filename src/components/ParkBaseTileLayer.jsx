import {TileLayer} from "react-leaflet";
import React,{Component} from 'react';

export default class ParkBaseTileLayer extends Component  {
  render() {
    const isRetina = (window.devicePixelRatio && window.devicePixelRatio > 1);
    
    const url = isRetina ? 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png' : 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';

    return (
      <TileLayer url = {url} />
    )
  }
}
