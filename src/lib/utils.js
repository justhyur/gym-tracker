import dayjs from "dayjs";

export function formatSecondsToMMSS(totalSeconds, showUnits = false){
    if(totalSeconds === null || totalSeconds === undefined || isNaN(totalSeconds)){
        return '';
    }
    const isNegative = totalSeconds < 0;
    totalSeconds = Math.abs(totalSeconds);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.round(((totalSeconds / 60) - minutes) * 60);
    if(showUnits){
        return `${minutes !== 0 ? String(minutes) + ' min' : ''} ${seconds !== 0 ? String(seconds) + ' sec' : ''}`.trim() ;
    }
    return `${isNegative ? '-' : ''}${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function getSessionTitle(session){
    const endTime = session.endTime || new Date();
    const durationMs = dayjs(endTime).valueOf() - dayjs(session.startTime).valueOf();
    return `${dayjs(session.startTime).format('DD/MM/YYYY')} | ${formatSecondsToMMSS(Math.round(durationMs / 1000), true)}`
}

export function getRestTimer(set, restTime){
    const elapsedTimeMs = dayjs().valueOf() - dayjs(set.endTime).valueOf();
    const timerS = Number(restTime) - (elapsedTimeMs / 1000);
    return formatSecondsToMMSS(Math.round(timerS));
}