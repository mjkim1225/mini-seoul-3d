import Box, { BoxProps } from '@mui/joy/Box';

const Root = (props: BoxProps) => (
    <Box
        id={props?.id}
        {...props}
        sx={[
            {
                display: 'grid',
                gridTemplateColumns: {
                    xs: '1fr',
                    sm: 'minmax(64px, 200px) minmax(450px, 1fr)',
                    md: 'minmax(160px, 300px) minmax(300px, 500px) minmax(500px, 1fr)',
                },
                gridTemplateRows: '64px 1fr',
                minHeight: '100vh',
            },
            ...(Array.isArray(props?.sx) ? props?.sx : [props?.sx]),
        ]}
    />
);

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
                right: 0,
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

export default {
    Root,
    ToolBar,
    ToolGroup
};
