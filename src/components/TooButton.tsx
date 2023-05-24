import {ReactNode} from 'react';

import Box from '@mui/joy/Box';
import IconButton from '@mui/joy/IconButton';

type PropsType = {
    icon: () => ReactNode, //SvgIconProps,
    onClick?: () => void,
}
const ToolButton = (props: PropsType) => (
    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1.5 }}>
        <IconButton
            size="md"
            variant="soft"
            color="success"
            component="a"
            onClick={props?.onClick}
        >
            {props?.icon()}
        </IconButton>
    </Box>
);

export default ToolButton;
