import React, {useMemo} from "react";

import Card from '@mui/joy/Card';
import CardOverflow from '@mui/joy/CardOverflow';
import Divider from '@mui/joy/Divider';
import Typography from '@mui/joy/Typography';

import useTrainStore from "../../store/useTrainStore";
import { plus9hours } from "../../utils/datetime";
import { StationInfo } from '../../utils/StationInfo'

const TrainInfoBox = () => {

    const { entity } = useTrainStore();

    const stationInfo = useMemo(() => {
        let info: StationInfo | null = null;
        if(entity) {
            let now = new Date()
            plus9hours(now);
            // @ts-ignore
            const infoList = entity?.info as StationInfo[];
            infoList.map( i => {
                if(i.period.contains(now)) {
                    info = i;
                }
            })
        }
        return info;
    }, [entity]);

    return <>
        {entity && stationInfo ?
            <Card variant="outlined" sx={{
                background: 'rgba(255, 255, 255, 0.5)',
                width: 180, mt: 1
            }}>
                <Typography level="h2" sx={{ fontSize: 'sm' }}>
                    {entity ? entity.id : '정보'}
                </Typography>
                <Typography level="body2" sx={{ mt: 0.5, mb: 1 }}>
                    {
                        entity ?
                            // @ts-ignore
                            stationInfo?.info
                            : '정보'
                    }
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
                        원하는 정보 추가
                    </Typography>
                </CardOverflow>
            </Card>
        : <></>}
    </>
}

export default TrainInfoBox;
