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

const trackEntity = (entity) => {
    if(viewer.trackedEntity) {
        viewer.trackedEntity = undefined;
    }

    const now = Cesium.JulianDate.toDate(viewer.clock.currentTime);
    if(!entity.description) return;

    let bearing = entity.description.getValue().bearing.getValue(now);

    if(!bearing) return;
    bearing = bearing < 0 ? bearing + 360 : bearing;
    bearing = bearing >= 180 ? bearing - 180 : bearing + 180;

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

const movemove = (entity) => {
    if(viewer.trackedEntity) {
        viewer.trackedEntity = undefined;
    }

    const now = Cesium.JulianDate.toDate(viewer.clock.currentTime);
    if(!entity.description) return;

    let bearing = entity.description.getValue().bearing.getValue(now);

    if(!bearing) return;
    bearing = bearing < 0 ? bearing + 360 : bearing;
    bearing = bearing >= 180 ? bearing - 180 : bearing + 180;

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

    const originViewFrom = entity.viewFrom;
    entity.viewFrom =  Cesium.Cartesian3.multiplyByScalar(position, distance, position);
    const changedViewFrom = entity.viewFrom;
    animateCamera2(originViewFrom.getValue(), entity.viewFrom.getValue(), entity);
}

const animateCamera2 = (startPosition: Cesium.Cartesian3, endPosition: Cesium.Cartesian3, entity) => {
    let numberOfSteps = 50; // 이동을 위한 중간 지점 수
    const stepDuration = 0.001; // 각 단계의 지속 시간 (초)

    const currentPosition = Cesium.Cartesian3.clone(startPosition);
    const stepVector = Cesium.Cartesian3.subtract(endPosition, startPosition, new Cesium.Cartesian3());
    const step = Cesium.Cartesian3.divideByScalar(stepVector, numberOfSteps, new Cesium.Cartesian3());

    const animate = (entity) => {
        if (numberOfSteps > 0) {
            Cesium.Cartesian3.add(currentPosition, step, currentPosition);
            if(viewer.trackedEntity) {
                viewer.trackedEntity = undefined;
            }
            entity.viewFrom = currentPosition;
            viewer.trackedEntity = entity;
            numberOfSteps--;
            setTimeout(animateCamera2, stepDuration * 1000);
        }
    }
    animate(entity);
}

const animateCamera = (startPosition: Cesium.Cartesian3, endPosition: Cesium.Cartesian3) => {
    let numberOfSteps = 50; // 이동을 위한 중간 지점 수
    const stepDuration = 0.001; // 각 단계의 지속 시간 (초)

    const currentPosition = Cesium.Cartesian3.clone(startPosition);
    const stepVector = Cesium.Cartesian3.subtract(endPosition, startPosition, new Cesium.Cartesian3());
    const step = Cesium.Cartesian3.divideByScalar(stepVector, numberOfSteps, new Cesium.Cartesian3());

    const animate = () => {
        if (numberOfSteps > 0) {
            Cesium.Cartesian3.add(currentPosition, step, currentPosition);
            viewer.camera.setView({
                destination: currentPosition
            });
            numberOfSteps--;
            setTimeout(animateCamera, stepDuration * 1000);
        }
    }
    animate();
}

const viewFromRelativeToAbsolute = (relativePosition) => {
    const cameraPosition = viewer.camera.positionWC.clone();
    const absolutePosition = Cesium.Cartesian3.add(cameraPosition, relativePosition, new Cesium.Cartesian3());
    return absolutePosition;
};

const moveCamera = (entity) => {
    console.log("move")

    const startPosition = viewer.camera.positionWC.clone();

    const now = Cesium.JulianDate.toDate(viewer.clock.currentTime);
    if(!entity.description) return;

    let bearing = entity.description.getValue().bearing.getValue(now);

    if(!bearing) return;
    bearing = bearing < 0 ? bearing + 360 : bearing;
    bearing = bearing >= 180 ? bearing - 180 : bearing + 180;

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

    animateCamera(startPosition, viewFromRelativeToAbsolute(position));
}

const test = (entity, bearing) => {
    if(!entity || !bearing) return;
    const initialCameraPosition = viewer.camera.positionWC.clone();
    const initialAngleFromNorth = bearing; // 초기 북쪽 방향으로부터의 각도
    const targetAngleFromNorth = bearing > 180? bearing - 180 : bearing + 180; // 이동 후 북쪽 방향으로부터의 각도
    console.log(initialAngleFromNorth, targetAngleFromNorth)
    const distance = 100; // 카메라와 물체 사이의 거리

// 카메라의 초기 방향을 계산
    const initialDirection = Cesium.Cartesian3.UNIT_X; // 초기 방향은 X 축 방향으로 가정
    const initialRotation = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(initialAngleFromNorth)); // 초기 북쪽 방향으로부터의 회전을 적용
    const initialDirectionRotated = Cesium.Matrix3.multiplyByVector(initialRotation, initialDirection, new Cesium.Cartesian3());
    const initialHeading = Math.atan2(initialDirectionRotated.y, initialDirectionRotated.x);
    const initialPitch = Math.atan2(initialDirectionRotated.z, Math.sqrt(initialDirectionRotated.x * initialDirectionRotated.x + initialDirectionRotated.y * initialDirectionRotated.y));

// 카메라의 이동 후 방향을 계산
    const targetHeading = initialHeading;
    const targetPitch = initialPitch - Cesium.Math.toRadians(initialAngleFromNorth - targetAngleFromNorth);

// 카메라의 이동 후 위치를 계산
    const direction = new Cesium.Cartesian3(Math.cos(targetHeading) * Math.cos(targetPitch), Math.sin(targetHeading) * Math.cos(targetPitch), Math.sin(targetPitch));
    const targetCameraPosition = Cesium.Cartesian3.add(initialCameraPosition, Cesium.Cartesian3.multiplyByScalar(direction, distance, new Cesium.Cartesian3()), new Cesium.Cartesian3());

    animateCamera(initialCameraPosition, targetCameraPosition);
    viewer.camera.setView({
        orientation: {
            pitch: Cesium.Math.toRadians(-15)
        }
    });
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

const setTrainClickHandler = (set: boolean, callback: (entity: Cesium.Entity | null) => void) => {
    const map = this;
    if(set) {
        if(!entityClickHandler) {
            entityClickHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
            entityClickHandler.setInputAction(function (movement) {
                const trainDataSource = findDataSourceByName(DATASOURCE_NAME.TRAIN);
                const pickedObject = viewer.scene.pick(movement.position);
                if(Cesium.defined(pickedObject) && pickedObject.id) {
                    const pickedEntity = pickedObject.id;
                    viewer.clock.shouldAnimate = true;
                    trackEntity(pickedEntity);
                    callback(pickedEntity);
                }else {
                    viewer.trackedEntity = undefined;
                    callback(null);
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
    test,movemove,
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
