import * as Cesium from 'cesium';
// @ts-ignore
import {Viewer} from '@types/cesium';
import config from './config';

import datetimeUtils from "../utils/datetime";

let viewer: Viewer | null = null;

const TRAIN_SIZE = {
    min: 50,
    max: 1000,
}

const setCameraView = (params: CameraOption) => {
    viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(
            params.longitude,
            params.latitude,
            params.altitude
        ),
        orientation: {
            heading: Cesium.Math.toRadians(params.heading),
            pitch: Cesium.Math.toRadians(params.pitch),
            roll: params.roll
        },
    });
};

const setKorDateTime = (timeStr: string) => {
    // ex time "08:10:05"
    const today = timeStr? datetimeUtils.getTodayWithTime(timeStr) : new Date();
    datetimeUtils.plus9hours(today);
    const julianDate = datetimeUtils.getJulianDate(today);
    viewer.clock.currentTime = julianDate;
}

const getSizeByZoom = () => {
    const zoomLevel = viewer.camera.positionCartographic.height;
    let size = zoomLevel/100;
    size = size > TRAIN_SIZE.max ? TRAIN_SIZE.max :
            size < TRAIN_SIZE.min ? TRAIN_SIZE.min : size;
    return new Cesium.Cartesian3(size*2, size, size);
}

export default {
    viewer,
    getViewer: (): Viewer | null => viewer,
    getSizeByZoom,
    setCameraView: (params: CameraOption) => setCameraView(params),
    initMap: (mapId: string) => {
        Cesium.Ion.defaultAccessToken = config.ACCESS_TOKEN;

        viewer = new Cesium.Viewer(mapId, {
            imageryProvider: new Cesium.UrlTemplateImageryProvider({
                url: `${config.MAP_TILER.url}/maps/dataviz/{z}/{x}/{y}.png?key=${config.MAP_TILER.key}`,
                minimumLevel: 0,
                maximumLevel: 20
            }),
           //animation: false,
            fullscreenButton: false,
            // timeline: false,
            geocoder: false, // toolbar
            homeButton: false, // toolbar
            baseLayerPicker: true, // toolbar
            sceneModePicker: false, // toolbar
            infoBox: false,
            selectionIndicator: false,
            navigationHelpButton: false, // toolbar,
            // terrain
            terrainProvider: new Cesium.CesiumTerrainProvider({
                url: `${config.MAP_TILER.url}/tiles/terrain-quantized-mesh-v2/?key=${config.MAP_TILER.key}`,
                requestVertexNormals: true
            }),
            // 영상
            showRenderLoopErrors: false,
            shouldAnimate: true,
        });

        viewer.scene.primitives.add(
            new Cesium.Cesium3DTileset({
                // @ts-ignore
                url: Cesium.IonResource.fromAssetId(96188),
            })
        );

        viewer.bottomContainer.style.visibility = 'hidden';

        viewer.camera.percentageChanged = 0.01;

        setCameraView(config.DEFAULT_CAMERA_OPTION);
        setKorDateTime('05:30:30');
    },

};
