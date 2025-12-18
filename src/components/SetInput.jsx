import { useGlobal } from "../context/GlobalContext";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import TimePicker from "./TimePicker";
import { formatSecondsToMMSS, getRestTimer } from "../lib/utils";

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
            restEndTime: !isCompleted ? new Date() : set.restEndTime,
            isCompleted,
        });
    }

    const handleEndTimer = () => {
        onSetChange(exercise.id, setIndex, { restEndTime: new Date() });
    }

    const restTimer = getRestTimer(set, exercise.restTime);

    return (
        <div className="set" style={{
            ...(isActive && {
                background: 'linear-gradient(135deg, rgba(74, 144, 226, 0.2), rgba(108, 92, 231, 0.2))',
                borderColor: 'var(--primary-color)',
                boxShadow: '0 0 20px rgba(74, 144, 226, 0.3)',
                transform: 'scale(1.02)'
            })
        }}>
            {onSetChange ? 
                <select 
                    className="set-type"
                    value={set.type}
                    onChange={(e) => editSetProperty('type', e.target.value)}
                    style={{
                        color: set.type === 'n' ? 'var(--primary-color)' : 
                               set.type === 'w' ? 'var(--warning-color)' : 
                               set.type === 'f' ? 'var(--danger-color)' : 
                               'var(--success-color)',
                        background: set.type === 'n' ? 'rgba(74, 144, 226, 0.15)' : 
                                   set.type === 'w' ? 'rgba(253, 203, 110, 0.15)' : 
                                   set.type === 'f' ? 'rgba(255, 118, 117, 0.15)' : 
                                   'rgba(0, 184, 148, 0.15)',
                        fontWeight: '700',
                        border: 'none',
                        padding: '0.5rem',
                        borderRadius: '6px'
                    }}
                >
                    <option value="n">{previousSets.filter(s => s.type === 'n' || s.type === 'f').length + 1}</option>
                    <option value="w">W</option>
                    <option value="f">F</option>
                    <option value="d">D</option>
                </select>
                :
                <span className={`set-type set-type-${set.type}`}>
                    {set.type === 'n' ? (previousSets.filter(s => s.type === 'n' || s.type === 'f').length + 1) : set.type.toUpperCase()}
                </span>
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
                        `${set.isCompleted ? (set.unitValue || set.defaultUnitValue || 'Nessun') : 'Nessun'} ${exercise.unitType}`
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
                    `${set.isCompleted ? (set.repsValue || set.defaultRepsValue || 'Nessuna') : 'Nessuna'} serie`
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
                    `${set.isCompleted ? (formatSecondsToMMSS(set.timeValue) || formatSecondsToMMSS(set.defaultTimeValue) || 'Nessun valore') : 'Nessun valore'}`
                }
            </>}
            {set.endTime && 
                <span 
                    onClick={() => onSetChange && editSetProperty('isCompleted', !set.isCompleted)} 
                    style={{
                        cursor: onSetChange ? 'pointer' : 'default',
                        fontSize: '1.25rem',
                        transition: 'transform 0.2s ease'
                    }}
                >
                    {set.isCompleted ? '✅' : '⤵️'}
                </span>
            }
            {isActive && onSetChange && <>
                {set.endTime === null && <>
                    <button onClick={() => endSet(true)} style={{
                        background: 'var(--success-color)',
                        boxShadow: '0 2px 8px rgba(0, 184, 148, 0.3)'
                    }}>✓ Completa</button>
                    <button onClick={() => endSet(false)} style={{
                        background: 'var(--warning-color)',
                        boxShadow: '0 2px 8px rgba(253, 203, 110, 0.3)'
                    }}>⤷ Salta</button>
                </>}
                {set.endTime && exercise.restTime !== null && <>
                    <span className={`rest-timer ${restTimer.startsWith('-') ? 'danger' : ''}`}>{restTimer}</span>
                    <button onClick={handleEndTimer} style={{
                        background: 'var(--primary-color)',
                        animation: 'pulse 2s ease-in-out infinite'
                    }}>→ Continua</button>
                </>}
            </>}
            {onSetDelete &&
                <button 
                    style={{
                        marginLeft: 'auto',
                        background: 'var(--danger-color)',
                        minWidth: '40px',
                        padding: '0.5rem 0.75rem'
                    }} 
                    onClick={() => onSetDelete(exercise.id, setIndex)}
                >🗑️</button>
            }
        </div>
    );
}