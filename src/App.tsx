import React, { useEffect } from 'react';

// mui
import CssBaseline from '@mui/joy/CssBaseline';
import { CssVarsProvider } from '@mui/joy/styles';


import ToolBar from './components/toolbar/ToolBar';

// custom
import theme from './styled/theme';

import map from './map';
import loader from './loader';
import InfoBox from "./components/infobox";

const mapId = 'cesiumContainer';
const App = () => {
    useEffect(() => {
        const viewer = map.getViewer();
        if (viewer) {
            viewer.destroy();

            const mapContainer = document.getElementById(mapId);
            if (mapContainer && mapContainer.hasChildNodes()) {
                mapContainer.firstChild? mapContainer.removeChild(mapContainer.firstChild) : null;
            }
        }
        map.initMap(mapId);
        loader(map.getViewer());
    }, [mapId]);

    return (
        <CssVarsProvider
            defaultMode="light"
            disableTransitionOnChange
            theme={theme}
        >
            <CssBaseline />
            <div id={mapId}/>
            <ToolBar />
            <InfoBox />

        </CssVarsProvider>
    );
};

export default App;
