import {TileLayer} from "react-leaflet";

export default class ParkBaseTileLayer extends TileLayer  {
  componentWillMount() {
    const isRetina = (window.devicePixelRatio && window.devicePixelRatio > 1);

    this.props.url = isRetina ? 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png' : 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png';
    this.props.attribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>';

    super.componentWillMount();
  }
}

ParkBaseTileLayer.propTypes = {};
