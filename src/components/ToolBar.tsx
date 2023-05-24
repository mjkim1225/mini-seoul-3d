
// Icons import
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import RemoveRoundedIcon from '@mui/icons-material/RemoveRounded';
import ZoomOutMapRoundedIcon from '@mui/icons-material/ZoomOutMapRounded';
import PlayCircleFilledRoundedIcon from '@mui/icons-material/PlayCircleFilledRounded';
import BatterySaverRoundedIcon from '@mui/icons-material/BatterySaverRounded';
import LayersRoundedIcon from '@mui/icons-material/LayersRounded';
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';

import RemoveRedEyeRoundedIcon from '@mui/icons-material/RemoveRedEyeRounded';
import ToolButton from './TooButton';

import Layout from './Layout';

const searchRoundedIcon = () => <SearchRoundedIcon />;
const addRoundedIcon = () => <AddRoundedIcon />;
const removeRoundedIcon = () => <RemoveRoundedIcon />;
const zoomOutMapRoundedIcon = () => <ZoomOutMapRoundedIcon />;
const removeRedEyeRoundedIcon = () => <RemoveRedEyeRoundedIcon />;
const playCircleFilledRoundedIcon = () => <PlayCircleFilledRoundedIcon />;
const batterySaverRoundedIcon = () => <BatterySaverRoundedIcon />;
const layersRoundedIcon = () => <LayersRoundedIcon />;
const videocamRoundedIcon = () => <VideocamRoundedIcon />;
const infoRoundedIcon = () => <InfoRoundedIcon />;

const Haeder = () => {
    const test = () => {
        console.log('test');
    };

    return (
        <Layout.ToolBar>
            <Layout.ToolGroup>
                <ToolButton
                    icon={searchRoundedIcon}
                    onClick={test}
                />
            </Layout.ToolGroup>

            <Layout.ToolGroup>
                <ToolButton icon={addRoundedIcon} />
                <ToolButton icon={removeRoundedIcon} />
            </Layout.ToolGroup>

            <Layout.ToolGroup>
                <ToolButton icon={zoomOutMapRoundedIcon} />
            </Layout.ToolGroup>

            <Layout.ToolGroup>
                <ToolButton icon={removeRedEyeRoundedIcon} />
                <ToolButton icon={playCircleFilledRoundedIcon} />
                <ToolButton icon={batterySaverRoundedIcon} />
            </Layout.ToolGroup>

            <Layout.ToolGroup>
                <ToolButton icon={layersRoundedIcon} />
                <ToolButton icon={videocamRoundedIcon} />
                <ToolButton icon={infoRoundedIcon} />
            </Layout.ToolGroup>

        </Layout.ToolBar>
    );
};

export default Haeder;
