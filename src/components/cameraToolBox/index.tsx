import React, { useMemo, useEffect, useState } from "react";
import useTrainStore from "../../store/useTrainStore";
import map from "../../map";
import Layout from "../Layout";
import * as Cesium from 'cesium'

const Index = () => {

    const { entity } = useTrainStore();
    const [camera, setCamera] = useState(true);
    const [count, setCount] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCount(prevCount => prevCount + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const bearing = useMemo(() => {
        if(entity) {
            const now = Cesium.JulianDate.toDate(map.getCurrentTime()); //TODO 세슘객체를 여기서 부르는건 아닌것같아
            // @ts-ignore
            return entity?.description.getValue().bearing.getValue(now);
        }
    }, [count]);

    useEffect(() => {
        if(camera && entity) {
            map.movemove(entity)
        };
    }, [count,entity]); //TODO 진짜 이방법밖엔 없을까....


    return (
        <Layout.CameraToolBox>
            <div>야호</div>
        </Layout.CameraToolBox>
    )
}

export default Index;
