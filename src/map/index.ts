import * as Cesium from 'cesium';
// @ts-ignore
import {Viewer} from '@types/cesium';
import config from './config';

import { getTodayWithTime, plus9hours, getJulianDate } from "../utils/datetime";
import {ScreenSpaceEventHandler} from "cesium";
import {CameraOption} from "./types";

let viewer: Viewer | null = null;

let pickedEntity: Cesium.Entity | null = null;

const TRAIN_SIZE = {
    min: 10,
    max: 1000,
}

const DATASOURCE_NAME = {
    TRAIN: 'train',
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

const setKorDateTime = (timeStr: string | void) => {
    // ex time "08:10:05"
    const today = timeStr? getTodayWithTime(timeStr) : new Date();
    plus9hours(today);
    const julianDate = getJulianDate(today);
    viewer.clock.currentTime = julianDate;
}

const getSizeByZoom = () => {
    const zoomLevel = viewer.camera.positionCartographic.height;
    let size = zoomLevel/100;
    size = size > TRAIN_SIZE.max ? TRAIN_SIZE.max :
            size < TRAIN_SIZE.min ? TRAIN_SIZE.min : size;
    return size
}

const zoom = (flag) => {
    const camera = viewer.camera;
    const currentHeight = camera.positionCartographic.height;
    if (flag) {
        if (currentHeight < 0) return;
        camera.zoomIn(currentHeight * 0.3);
    } else {
        camera.zoomOut(currentHeight * 0.3);
    }
}

const findDataSourceByName = (name) => {
    let dataSource = viewer.dataSources.getByName(name);
    if (dataSource.length === 0) {
        dataSource = new Cesium.CustomDataSource();
        dataSource.name = name;
        viewer.dataSources.add(dataSource);
    } else {
        dataSource = dataSource[0];
    }
    return dataSource;
}

const getCartesianFromBearingAndDistance = (bearing: number, distance:number) => {
    //distance unit: meter
    const heading = Cesium.Math.toRadians(bearing);  // 북쪽에서 10도
    const pitch = Cesium.Math.toRadians(-75);  // 수평 방향
    const roll = 0;  // 회전 없음

    const quaternion = Cesium.Transforms.headingPitchRollQuaternion(
        new Cesium.Cartesian3(0, 0, 0),
        new Cesium.HeadingPitchRoll(heading, pitch, roll)
    );

    const direction = new Cesium.Cartesian3(0, 0, 3);  // 북쪽 방향

    const position = Cesium.Matrix3.multiplyByVector(
        Cesium.Matrix3.fromQuaternion(quaternion),
        direction,
        new Cesium.Cartesian3()
    );
    return Cesium.Cartesian3.multiplyByScalar(position, distance, position);
}

const getEntityBearing = (entity) => {
    const now = Cesium.JulianDate.toDate(viewer.clock.currentTime);
    if(!entity.description) return;

    let bearing = entity.description.getValue().bearing.getValue(now);

    if(!bearing) return;
    bearing = bearing < 0 ? bearing + 360 : bearing;
    bearing = bearing >= 180 ? bearing - 180 : bearing + 180;
    return bearing;
}

const trackEntity = (entity, bearing) => {
    if(!bearing) return;

    if(viewer.trackedEntity) {
        viewer.trackedEntity = undefined;
    }

    //cartesian 계산
    const distance = 100;
    const heading = Cesium.Math.toRadians(bearing);
    const pitch = Cesium.Math.toRadians(-75);  // 수평 방향
    const roll = 0;  // 회전 없음

    const quaternion = Cesium.Transforms.headingPitchRollQuaternion(
        new Cesium.Cartesian3(0, 0, 0),
        new Cesium.HeadingPitchRoll(heading, pitch, roll)
    );

    const direction = new Cesium.Cartesian3(0, 0, 3);  // 북쪽 방향

    const position = Cesium.Matrix3.multiplyByVector(
        Cesium.Matrix3.fromQuaternion(quaternion),
        direction,
        new Cesium.Cartesian3()
    );

    entity.viewFrom =  Cesium.Cartesian3.multiplyByScalar(position, distance, position);
    viewer.trackedEntity = entity;

}

const moveCamera = (entity, fromBearing, callback) => {
    if(viewer.trackedEntity) {
        viewer.trackedEntity = undefined;
    }
    const bearing = getEntityBearing(entity);
    if(!bearing) return;
    callback(bearing);
    animateCamera(entity, fromBearing, bearing);
}

const animateCamera = (entity, fromBearing, toBearing) => {
    let currentStep = 0;
    const steps = 20;

    const bearingDiff = toBearing - fromBearing;
    const bearingStep = bearingDiff / steps;

    const stepDuration = 0.02; // 각 단계의 지속 시간 (초)

    function animate() {
        if (currentStep < steps) {
            trackEntity(entity, fromBearing + bearingStep * currentStep);
            currentStep++;
            setTimeout(animate, stepDuration*1000);
        }
    }
    animate();
}




let entityHoverHandler: ScreenSpaceEventHandler | void | null = null;
let entityClickHandler: ScreenSpaceEventHandler | void | null = null;

const setTrainHoverHandler = (set: boolean, callback: (entity: Cesium.Entity | null) => void) => {
    if(set) {
        if(!entityHoverHandler) {
            let pickedObject;
            const trainDataSource = findDataSourceByName(DATASOURCE_NAME.TRAIN);
            entityHoverHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
            entityHoverHandler.setInputAction(function (movement) {
                if(pickedObject?.id) {
                    callback(null)
                }
                pickedObject = viewer.scene.drillPick(movement.endPosition)[0];
                if(Cesium.defined(pickedObject) && pickedObject.id && !(trainDataSource.entities.values.indexOf(pickedObject.id) < 0)) {
                    pickedEntity = pickedObject.id as Cesium.Entity;
                    callback(pickedEntity);
                }

            }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        }
    }else {
        entityHoverHandler = entityHoverHandler && entityHoverHandler.destroy();
    }
}

const setTrainClickHandler = (set: boolean, callback: (entity: Cesium.Entity | null, bearing: number | null) => void) => {
    const map = this;
    if(set) {
        if(!entityClickHandler) {
            entityClickHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
            entityClickHandler.setInputAction(function (movement) {
                const trainDataSource = findDataSourceByName(DATASOURCE_NAME.TRAIN); //TODO
                const pickedObject = viewer.scene.pick(movement.position);
                if(Cesium.defined(pickedObject) && pickedObject.id) {
                    const pickedEntity = pickedObject.id;
                    viewer.clock.shouldAnimate = true;
                    const bearing = getEntityBearing(pickedEntity);
                    trackEntity(pickedEntity, bearing);
                    callback(pickedEntity, bearing);
                }else {
                    viewer.trackedEntity = undefined;
                    callback(null, null);
                }
            }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
        }
    }else {
        entityClickHandler = entityClickHandler && entityClickHandler.destroy();
    }
}

export default {
    viewer,
    getCurrentTime: () : Cesium.JulianDate => viewer.clock.currentTime,
    DATASOURCE_NAME,
    getViewer: (): Viewer | null => viewer,
    setCameraView,
    getSizeByZoom,
    zoom,
    findDataSourceByName,
    trackEntity,
    moveCamera,
    setTrainHoverHandler,
    setTrainClickHandler,
    initMap: (mapId: string) => {
        Cesium.Ion.defaultAccessToken = config.ACCESS_TOKEN;

        viewer = new Cesium.Viewer(mapId, {
                imageryProvider: new Cesium.UrlTemplateImageryProvider({
                    url: `${config.MAP_TILER.url}/maps/dataviz/{z}/{x}/{y}.png?key=${config.MAP_TILER.key}`,
                    minimumLevel: 0,
                    maximumLevel: 20
                }
            ),
            shouldAnimate: true,
            // animation: true,
            fullscreenButton: false,
            // timeline: false,
            geocoder: false, // toolbar
            homeButton: false, // toolbar
            baseLayerPicker: false, // toolbar
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
        });

        // TODO: terrain 과 건물이 떨어져있음. 건물의 z값 조절 필요..
        // viewer.scene.primitives.add(
        //     new Cesium.Cesium3DTileset({
        //         // @ts-ignore
        //         url: Cesium.IonResource.fromAssetId(96188),
        //     })
        // );

        viewer.bottomContainer.style.visibility = 'hidden';

        viewer.camera.percentageChanged = 0.01;

        setCameraView(config.DEFAULT_CAMERA_OPTION);
        setKorDateTime();
    },

};
