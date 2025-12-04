import { useState } from "react";
import { formatSecondsToMMSS } from "../lib/utils";

export default function ({value, onChange, ...rest}){

    const [isFocused, setIsFocused] = useState(false);

    const [localValue, setLocalValue] = useState(formatSecondsToMMSS(value));

    function handleChange(e){
        let currentValue = e.target.value.replace(':', '');
        let foundNotZero = false;
        while(!foundNotZero){
            if(currentValue.startsWith('0')){
                currentValue = currentValue.slice(1);
            } else {
                foundNotZero = true;
            }
        }
        let digits = currentValue.split('');
        while(digits.length < 4){
            digits.unshift('0');
        }
        digits = digits.map(d => isNaN(d) ? '0' : d);
        digits.splice(2, 0, ':');
        setLocalValue(digits.join(''));
        setTimeout(() => {
            if(currentValue.length === 4){
                e.target.blur();
            }
        }, 0);
    }

    function handleBlur(){
        setIsFocused(false);
        const [minutes, seconds] = localValue.split(':');
        const totalSeconds = Math.floor(seconds) + (Math.floor(minutes) * 60);
        onChange(totalSeconds);
    }

    return (
        <input 
            {...rest}
            onFocus={(e) => {
                setIsFocused(true);
                e.target.select();
            }}
            onBlur={handleBlur}
            value={isFocused ? localValue : formatSecondsToMMSS(value)} 
            onChange={handleChange}
            onKeyDown={e => {
                if(e.key === 'Enter'){
                    e.target.blur();
                }
            }}
        />
    )
}