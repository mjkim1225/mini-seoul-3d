import React from "react";

import Box, { BoxProps } from '@mui/joy/Box';


const ToolBar = (props: BoxProps) => (
    <Box
        component="div"
        className="ToolBar"
        {...props}
        sx={[
            {
                position: 'absolute',
                m: 1,
                p: 1,
                top: 0,
                left: 0,
            },
            ...(Array.isArray(props?.sx) ? props?.sx : [props?.sx]),
        ]}
    />
);

const ToolGroup = (props: BoxProps) => (
    <Box
        component="div"
        className="ToolGroup"
        {...props}
        sx={[
            {
                mt: 2,
                // p: 1,
            },
            ...(Array.isArray(props?.sx) ? props?.sx : [props?.sx]),
        ]}
    />
);

const InfoBox = (props: BoxProps) => (
    <Box
        component="div"
        className="ToolBar"
        {...props}
        sx={[
            {
                position: 'absolute',
                m: 1,
                p: 1,
                top: 0,
                right: 0,
            },
            ...(Array.isArray(props?.sx) ? props?.sx : [props?.sx]),
        ]}
    />
)


export default {
    ToolBar,
    ToolGroup,
    InfoBox,
};
