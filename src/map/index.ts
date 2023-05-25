import * as Cesium from 'cesium';
// @ts-ignore
import {Viewer} from '@types/cesium';
import config from './config';

let viewer: Viewer | null = null;


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

const korTimeSetting = (timeStr: string) => {
    // ex time "08:10:05"
    let today = new Date();
    if(timeStr) {
        const [hours, minutes, seconds] = timeStr.split(':').map(Number);
        today = new Date(today.getFullYear(), today.getMonth(), today.getDate(), hours, minutes, seconds);
    }
    today.setHours(today.getHours() + 9)
    const julianDate = Cesium.JulianDate.fromDate(today);
    viewer.clock.currentTime = julianDate;
}

export default {
    viewer,
    getViewer: (): Viewer | null => viewer,
    setCameraView: (params: CameraOption) => setCameraView(params),
    initMap: (mapId: string) => {
        Cesium.Ion.defaultAccessToken = config.ACCESS_TOKEN;

        viewer = new Cesium.Viewer(mapId, {
            imageryProvider: new Cesium.UrlTemplateImageryProvider({
                url: `https://api.maptiler.com/maps/dataviz/{z}/{x}/{y}.png?key=XSHSlYSeKVmyAEfR1ema`,
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
                url: `https://api.maptiler.com/tiles/terrain-quantized-mesh-v2/?key=XSHSlYSeKVmyAEfR1ema`,
                requestVertexNormals: true
            }),
            // 영상
            showRenderLoopErrors: false,
            shouldAnimate: true,
        });


        viewer.scene.primitives.add(
            new Cesium.Cesium3DTileset({
                url: Cesium.IonResource.fromAssetId(96188),
            })
        );

        viewer.bottomContainer.style.visibility = 'hidden';

        viewer.camera.percentageChanged = 0.01;

        // const cameraAggregator = new Cesium.CameraEventAggregator(viewer.canvas);
        //
        // viewer.clock.onTick.addEventListener(function(){
        //     var rightDrag = cameraAggregator.isButtonDown(Cesium.CameraEventType.RIGHT_DRAG);
        //     if (rightDrag) {
        //         console.log("Zooming");
        //     }
        // });

        setCameraView(config.DEFAULT_CAMERA_OPTION);
        korTimeSetting('05:30:30');
    },

};
