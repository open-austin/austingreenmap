import React from "react";
import {GeoJson}  from "react-leaflet";

export default class GeoJsonUpdatable extends GeoJson {
    componentWillReceiveProps(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.leafletElement.clearLayers();
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            this.leafletElement.addData(this.props.data);
        }
    }
}

GeoJsonUpdatable.propTypes = {
    data: React.PropTypes.object.isRequired
};
