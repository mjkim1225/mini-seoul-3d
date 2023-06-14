import React, { useEffect, useState } from "react";
import map from "../../map";
import Layout from "../Layout";
import useCameraStore from "../../store/useCameraStore";

const Index = () => {

    const { cameraEntity, flag, setFlag, bearing, setBearing } = useCameraStore();
    const [count, setCount] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCount(prevCount => prevCount + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if(flag && cameraEntity && bearing !== null) {
            map.moveCamera(cameraEntity, bearing, (bearing) => {
                setBearing(bearing);
            })
        };
    }, [count, flag, cameraEntity]); //TODO 진짜 이방법밖엔 없을까....

    const handleCamera = () => {
        setFlag(!flag);
    }

    return (
        <Layout.CameraToolBox>
            <div>야호</div>
            <button onClick={handleCamera}>{
                flag? "카메라 멈춤" : "카메라 시작"
            }</button>
        </Layout.CameraToolBox>
    )
}

export default Index;
