import React, { useEffect } from 'react';

import * as Cesium from 'cesium';
import map from '../../map';
import loader from '../../loader';
import useTrainStore from "../../store/useTrainStore";
import useCameraStore from "../../store/useCameraStore";

const mapId = 'cesiumContainer';
const Map = () => {

    const { setEntity, removeEntity } = useTrainStore();
    const { setBearing, removeBearing, cameraEntity, setCameraEntity, removeCameraEntity } = useCameraStore();

    useEffect(() => {
        const viewer = map.getViewer();
        const mapContainer = document.getElementById(mapId);

        if (viewer) {
            viewer.destroy();
        }
        if (mapContainer && mapContainer.hasChildNodes()) {
            mapContainer.firstChild? mapContainer.removeChild(mapContainer.firstChild) : null;
        }
        map.initMap(mapId);
        map.setTrainHoverHandler(true, (entity: Cesium.Entity| null) => {
            entity == null ? removeEntity() : setEntity(entity);
        })
        map.setTrainClickHandler(true, (entity: Cesium.Entity| null, bearing: number | null) => {
            if(entity && bearing) {
                setCameraEntity(entity);
                setBearing(bearing);
            }else {
                removeCameraEntity();
                removeBearing();
            }

        })
        // map.store
        loader(map.getViewer());
    }, [mapId]);

    return <div id={mapId}/>;
};

export default Map;
