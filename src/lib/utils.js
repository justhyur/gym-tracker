export function formatSecondsToMMSS(totalSeconds, showUnits = false){
    if(totalSeconds === null || totalSeconds === undefined || isNaN(totalSeconds)){
        return '';
    }
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.round(((totalSeconds / 60) - minutes) * 60);
    if(showUnits){
        return `${minutes !== 0 ? String(minutes) + ' min' : ''} ${seconds !== 0 ? String(seconds) + ' sec' : ''}`.trim() ;
    }
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}