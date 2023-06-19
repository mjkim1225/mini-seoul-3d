import React, { useEffect, useState } from "react";
import map from "../../map";
import mapConfig from '../../map/config';

import useCameraStore from "../../store/useCameraStore";

import Box from '@mui/joy/Box';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListItemButton from '@mui/joy/ListItemButton';
import GpsFixedIcon from '@mui/icons-material/GpsFixed';
import CircleIcon from '@mui/icons-material/Circle';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import DirectionsRailwayFilledIcon from '@mui/icons-material/DirectionsRailwayFilled';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import Typography from "@mui/joy/Typography";

const {
    TRACK,
    TRACK_BACK,
    TRACK_BACK_UPWARD,
    TRACK_FRONT,
    TRACK_FRONT_UPWARD
} = mapConfig.CAMERA_MODE;

const tick = 0.5

const Index = () => {

    const { cameraEntity, bearing, setBearing } = useCameraStore();
    const [count, setCount] = useState(0);

    const { mode, setMode } = useCameraStore()
    const [ cameraMode, setCameraMode ] = useState(mode);

    useEffect(() => {
        const interval = setInterval(() => {
            setCount(prevCount => prevCount + tick);
        }, tick * 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if(cameraEntity && bearing !== null) {
            if(cameraMode !== mode) {
                if(mode == TRACK) {
                    setBearing(180);
                }else {
                    setBearing(bearing >= 180 ? bearing - 180 : bearing + 180)
                }
            }
            map.moveCamera(cameraEntity, bearing, mode, (bearing) => {
                setBearing(bearing);
                setCameraMode(mode)
            })
        }
    }, [count, mode, cameraEntity]); //TODO 진짜 이방법밖엔 없을까....

    const changeCameraMode = (mode) => {
        setMode(mode)
    }

    return (
        <Box
            sx={{
                width: 150,
                position: 'absolute',
                m: 1,
                p: 1,
                top: 400,
                left: 50,
            }}
        >
            <Box>
                <List
                    size='md'
                    variant="outlined"
                    sx={{
                        borderRadius: 'sm',
                        maxWidth: 150,
                        boxShadow: 'sm',
                        bgcolor: 'background.body',
                    }}
                >
                    <Typography
                        sx={{
                            ml: 2
                        }}
                    >
                        추적모드
                    </Typography>
                {(
                    [
                        { icon: <GpsFixedIcon />, text: '위치만', func: () => changeCameraMode(TRACK)},
                        { icon: <CircleIcon />, text: '후방', func: () => changeCameraMode(TRACK_BACK)},
                        { icon: <KeyboardDoubleArrowUpIcon />, text: '후방 상공', func: ()=>changeCameraMode(TRACK_BACK_UPWARD)},
                        { icon: <DirectionsRailwayFilledIcon />, text: '전방', func: ()=>changeCameraMode(TRACK_FRONT)},
                        { icon: <KeyboardDoubleArrowDownIcon />, text: '전방 상공', func: ()=>changeCameraMode(TRACK_FRONT_UPWARD)},
                    ]
                ).map((item) => (
                    <ListItem key={item.text} onClick={item.func}>
                        <ListItemButton>
                            <ListItemDecorator>
                                { item.icon }
                            </ListItemDecorator>
                            { item.text }
                        </ListItemButton>
                    </ListItem>
                ))}
                </List>
            </Box>
        </Box>
    )
}

export default Index;
