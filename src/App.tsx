import React, { useEffect } from 'react';

// mui
import CssBaseline from '@mui/joy/CssBaseline';
import { CssVarsProvider } from '@mui/joy/styles';

import ToolBar from './components/toolbar/ToolBar';

// custom
import theme from './styled/theme';

import Map from './components/map';
import InfoBox from "./components/infobox";
import CameraToolBox from "./components/cameraToolBox";

const mapId = 'cesiumContainer';
const App = () => {

    return (
        <CssVarsProvider
            defaultMode="light"
            disableTransitionOnChange
            theme={theme}
        >
            <CssBaseline />
            <Map />
            <ToolBar />
            <InfoBox />
            <CameraToolBox />

        </CssVarsProvider>
    );
};

export default App;
