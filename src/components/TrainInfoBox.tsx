import React from "react";

import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardOverflow from '@mui/joy/CardOverflow';
import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';

const TrainInfoBox = () => {

    return <>
        <Card variant="outlined" sx={{ width: 150 }}>
            <Typography level="h2" sx={{ fontSize: 'sm' }}>
                열차이름
            </Typography>
            <Typography level="body2" sx={{ mt: 0.5, mb: 1 }}>
                정보
            </Typography>
            <Divider />
            <CardOverflow
                variant="soft"
                sx={{
                    display: 'flex',
                    gap: 1.5,
                    py: 1.5,
                    px: 'var(--Card-padding)',
                    bgcolor: 'background.level1',
                }}
            >
                <Typography level="body3" sx={{ fontWeight: 'md', color: 'text.secondary' }}>
                    정보
                </Typography>
            </CardOverflow>
        </Card>
    </>
}

export default TrainInfoBox;
