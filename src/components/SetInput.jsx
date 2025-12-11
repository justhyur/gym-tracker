import { useGlobal } from "../context/GlobalContext";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import TimePicker from "./TimePicker";
import { formatSecondsToMMSS } from "../lib/utils";

export default function ({
    exercise, set, isActive, setIndex, 
    onSetChange, onSetDelete,
}) {

    function editSetProperty(property, value){
        onSetChange(exercise.id, setIndex, { [property]: value });
    }

    const previousSets = exercise.sets.slice(0, setIndex);

    const endSet = (isCompleted) => {
        onSetChange(exercise.id, setIndex, {
            endTime: new Date(),
            isCompleted,
        });
    }

    return (
        <div className="set">
            {onSetChange ? 
                <select 
                    className="set-type"
                    value={set.type}
                    onChange={(e) => editSetProperty('type', e.target.value)}
                >
                    <option value="n">{previousSets.filter(s => s.type === 'n' || s.type === 'f').length + 1}</option>
                    <option value="w">W</option>
                    <option value="f">F</option>
                    <option value="d">D</option>
                </select>
                :
                <span className="set-type">{set.type === 'n' ? (previousSets.filter(s => s.type === 'n' || s.type === 'f').length + 1) : set.type.toUpperCase()}</span>
            }
            <div className="set-unitValue">
                {exercise.unitType !== null && <>
                    {onSetChange ?
                        <input
                            type="number"
                            placeholder={set.defaultUnitValue || exercise.unitType}
                            value={set.unitValue || ''}
                            onChange={e => editSetProperty('unitValue', e.target.value ? Number(e.target.value) : null)}
                        />
                        :
                        `${set.unitValue || set.defaultUnitValue || 'Nessun'} ${exercise.unitType}`
                    }
                </>}
            </div>
            {exercise.type === 'reps' && <>
                {onSetChange ?
                    <input
                        className="set-repsValue"
                        type="number"
                        placeholder={set.defaultRepsValue || 'Reps'}
                        value={set.repsValue || ''}
                        onChange={e => editSetProperty('repsValue', e.target.value ? Number(e.target.value) : null)}
                    />
                    :
                    `${set.repsValue || set.defaultRepsValue || 'Nessuna'} reps`
                }
            </>}
            {exercise.type === 'time' && <>
                {onSetChange ?
                    <TimePicker
                        className="set-timeValue"
                        placeholder={set.defaultTimeValue || "mm:ss"}
                        value={set.timeValue || ''}
                        onChange={value => editSetProperty('timeValue', value || null)}
                    />
                    :
                    `${ (set.timeValue !== null || set.defaultTimeValue !== null) ? formatSecondsToMMSS(set.timeValue !== null ? set.timeValue : set.defaultTimeValue) : 'Nessun valore'}`
                }
            </>}
            {set.endTime && 
                <span onClick={() => editSetProperty('isCompleted', !set.isCompleted)}>{set.isCompleted ? '✅' : '⤵️'}</span>
            }
            {isActive && <>
                <button onClick={() => endSet(true)}>Completa</button>
                <button onClick={() => endSet(false)}>Salta</button>
            </>}
            {onSetDelete &&
                <button style={{marginLeft: 'auto'}} onClick={() => onSetDelete(exercise.id, setIndex)}>X</button>
            }
        </div>
    );
}