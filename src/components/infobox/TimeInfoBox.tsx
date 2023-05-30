import React, { useState, useEffect } from 'react';

import Card from '@mui/joy/Card';
import Typography from '@mui/joy/Typography';

const formatDate = (date) => {
    const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dayOfWeek = daysOfWeek[date.getDay()];
    return `${year}년 ${month}월 ${day}일 (${dayOfWeek})`;
};

const formatTime = (time) => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    const period = hours < 12 ? '오전' : '오후';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
    return `${period} ${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
};

const TimeInfoBox = () => {

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000); // 1초마다 현재 시간 업데이트

        return () => clearInterval(interval); // 컴포넌트 언마운트 시 타이머 정리
    }, []);

    return <>
            <Card variant="outlined" sx={{
                background: 'rgba(255, 255, 255, 0.5)',
                width: 180
            }}>
                <Typography level="body2" sx={{ mb: 1 }}>
                    {formatDate(currentTime)}
                </Typography>
                <Typography level="h2" sx={{ fontSize: 'md' }}>
                    {formatTime(currentTime)}
                </Typography>
            </Card>
    </>
}

export default TimeInfoBox;
