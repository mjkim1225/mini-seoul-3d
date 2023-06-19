/*
* map config
* */
import {CameraOption} from "./types";

const ACCESS_TOKEN: string = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIzYTM3ODhlNC1jOWUxLTRhOTYtYTgwZC1iMDA3OGJiMTQwZDciLCJpZCI6MTI5NDU5LCJpYXQiOjE2ODIwNTc4NjN9.GC-W9QfAFa9rXMh2Ow2rSC5UvLcwtS_qjWJ1v454z1A';
const DEFAULT_CAMERA_OPTION: CameraOption = {
    longitude: 126.89465233162544,
    latitude: 37.393248730001874,
    altitude: 8000,
    heading: 0.0,
    pitch: -40.0,
    roll: 0.0
};
const MAP_TILER = {
    url: 'https://api.maptiler.com',
    key: 'XSHSlYSeKVmyAEfR1ema',
}

const CAMERA_MODE = {
    TRACK: 'track',
    TRACK_BACK: 'trackBack',
    TRACK_BACK_UPWARD: 'trackBackUpward',
    TRACK_FRONT: 'trackFront',
    TRACK_FRONT_UPWARD: 'trackFrontUpward',
}

export default {
    ACCESS_TOKEN,
    DEFAULT_CAMERA_OPTION,
    MAP_TILER,
    CAMERA_MODE
};
