import React from "react";
import Layout from "../Layout";
import TimeInfoBox from "./TimeInfoBox";
import TrainInfoBox from "./TrainInfoBox";

const InfoBox = () => (
    <Layout.InfoBox>
        <TimeInfoBox />
        <TrainInfoBox />
    </Layout.InfoBox>
)

export default InfoBox;
