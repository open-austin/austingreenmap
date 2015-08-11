import React from "react";
import {GeoJson}  from "react-leaflet";

export default class GeoJsonUpdatable extends GeoJson {
    componentWillReceiveProps(prevProps) {
        if (prevProps.data !== this.props.data) {
            console.log('GeoJsonUpdatable: Clearing previous GeoJson');
            this.leafletElement.clearLayers();
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.data !== this.props.data) {
            console.log('GeoJsonUpdatable: Rendering new GeoJson');
            this.leafletElement.addData(this.props.data);
        }
        
        if (prevProps.visibleIds !== this.props.visibleIds) {
            this.leafletElement.eachLayer((layer) => {
                if (this.props.visibleIds.indexOf(layer.feature.id) === -1) {
                    layer.setStyle({fillOpacity: 0, opacity: 0})
                }
                else {
                    layer.setStyle({fillOpacity: 0.4, opacity: 1})
                }
            });
        }
    }
}

GeoJsonUpdatable.propTypes = {
    data: React.PropTypes.object.isRequired,
    visibleIds: React.PropTypes.array,
};
