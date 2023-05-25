
import * as Cesium from 'cesium';
// @ts-ignore
import {Cartesian3, Entity, Viewer, JulianDate} from '@types/cesium';
import trainColor from "../data/trainColor.ts";

export default (viewer: Viewer) => {

    [
        {   "line": "line1",
            "file":'../dataTmp/railway_1.geojson'
        },
        {   "line": "line7",
            "file":'../dataTmp/railway_7.geojson'
        }
    ]
        .forEach((railway) => {
            const color = Cesium.Color.fromCssColorString(trainColor[railway.line]).withAlpha(0.8);
            viewer.dataSources.add(Cesium.GeoJsonDataSource.load(railway.file, {
                stroke: color,
                fill: color,
                strokeWidth: 4,
                clampToGround: true,
            }));
    });


}
