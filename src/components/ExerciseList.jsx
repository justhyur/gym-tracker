import { useMemo } from "react";
import { useGlobal } from "../context/GlobalContext";
import InputTitle from "./InputTitle";
import SetInput from "./SetInput";
import { formatSecondsToMMSS } from "../lib/utils";

function formatSeconds(seconds){
    const minutes = seconds / 60; 
    const intMinutes = String(Math.floor(minutes)); 
    const remainingSeconds = String(Math.round((minutes - intMinutes) * 60));
    return `${intMinutes.padStart(2, 0)}:${remainingSeconds.padStart(2, 0)}`;
}

export default function ({
    routines,
    exercises,
    routine, 
    isEditMode,
    onExerciseChange,
    onExerciseDelete,
    onSetCreation,
    onSetChange,
    onSetDelete,
    onRoutineChange,
}) {
    const globalContext = useGlobal();

    if(!routines){
        routines = globalContext.routines;
    }

    if(!exercises){
        exercises = globalContext.exercises;
    }

    const exerciseList = useMemo(() => {
        return routine ? routine.exerciseIds.map(exId => exercises.find(ex => ex.id === exId)).filter(ex => ex !== undefined) : exercises
    }, [routine, exercises]);

    const activeExercise = exerciseList.find(ex => ex.sets.find(s => s.endTime === null));

    function removeExerciseFromRoutine(index){
        const isConfirmed = window.confirm("Sei sicuro di voler rimuovere questo esercizio dalla routine?");
        if(!isConfirmed) return;
        const newExerciseIds = [...routine.exerciseIds];
        newExerciseIds.splice(index, 1);
        onRoutineChange(routine.id, { exerciseIds: newExerciseIds });
    }

    function moveExerciseInRoutine(index, direction){
        const newExerciseIds = [...routine.exerciseIds];
        const [movedExerciseId] = newExerciseIds.splice(index, 1);
        newExerciseIds.splice(index + direction, 0, movedExerciseId);
        onRoutineChange(routine.id, { exerciseIds: newExerciseIds });
    }

    function handleDelete(exercise, index){
        if(routine){
            removeExerciseFromRoutine(index);
        }else{
            const routinesWithExercise = routines.filter(r => r.exerciseIds.includes(exercise.id));
            if(routinesWithExercise.length > 0){
                alert(`Attenzione! Questo esercizio è presente nelle seguenti routine: ${routinesWithExercise.map(r => r.title).join(', ')}.`);
            }
            const isConfirmed = window.confirm(`Sei sicuro di voler eliminare definitivamente questo esercizio? ${routinesWithExercise.length > 0 ? `Verrà rimosso da tutte le routine.` : ''}`);
            if(!isConfirmed) return;
            onExerciseDelete(exercise.id);
        }
    }

    return (
        <div className="exercise-list">
            {exerciseList.map((ex, i) => {
                
                const unitValues = ex.sets.map(s => s.unitValue).filter(v => v !== null);
                const minUnit = Math.min(...unitValues);
                const maxUnit = Math.max(...unitValues);
                
                const repsValues = ex.sets.map(s => s.repsValue).filter(v => v !== null);
                const minRep = Math.min(...repsValues);
                const maxRep = Math.max(...repsValues);

                const timeValues = ex.sets.map(s => s.timeValue).filter(v => v !== null);
                const minTime = Math.min(...timeValues);
                const maxTime = Math.max(...timeValues);

                const activeSet = i === exerciseList.indexOf(activeExercise) && ex.sets.find(s => s.endTime === null);
                
                return (
                    <div key={i} className="exercise-card">
                        <div className="exercise-card-header">
                            <h3>
                                {(isEditMode && onExerciseChange) ?
                                    <input 
                                        type="text"
                                        value={ex.title}
                                        onChange={newTitle => onExerciseChange(ex.id, { title: newTitle })}
                                    />
                                    :
                                    ex.title
                                }
                            </h3>
                            {(isEditMode && (onExerciseChange || onExerciseDelete)) &&
                                <div className="exercise-card-controls">
                                    {routine && onExerciseChange &&
                                        <div className="arrows" style={{display: 'flex', flexDirection: 'column', gap: '.25rem'}}>
                                            {i !== 0 &&
                                                <button onClick={() => moveExerciseInRoutine(i, -1)}>↑</button>
                                            }
                                            {i !== exerciseList.length -1 &&
                                                <button  onClick={() => moveExerciseInRoutine(i, 1)}>↓</button>
                                            }
                                        </div>
                                    }
                                    {onExerciseDelete &&
                                        <button className="remove-exercise" onClick={() => handleDelete(ex, i)}>×</button>
                                    }
                                </div>
                            }
                        </div>
                        {!isEditMode &&
                            <div className="exercise-labels-list">
                                <div className="exercise-label">
                                    {ex.sets.length} serie
                                </div>
                                {ex.unitType !== null && unitValues.length > 0 &&
                                    <div className="exercise-label">
                                        {minUnit === maxUnit ? minUnit : `${minUnit}-${maxUnit}`} {ex.unitType}
                                    </div>
                                }
                                {ex.type === 'reps' && repsValues.length > 0 &&
                                    <div className="exercise-label">
                                        {minRep === maxRep ? minRep : `${minRep}-${maxRep}`} reps
                                    </div>
                                }
                                {ex.type === 'time' && timeValues.length > 0 &&
                                    <div className="exercise-label">
                                        {minTime === maxTime ? formatSecondsToMMSS(minTime, true) : `${formatSecondsToMMSS(minTime, true)} - ${formatSecondsToMMSS(maxTime, true)}`}
                                    </div>
                                }
                                {ex.restTime !== null &&
                                    <div className="exercise-label">
                                        Riposo: {formatSecondsToMMSS(ex.restTime, true)}
                                    </div>
                                }
                            </div>
                        }
                        {isEditMode && <>
                            <div className="exercise-card-config">
                                <label>
                                    <p>Tipologia:</p>
                                    {onExerciseChange ?
                                        <select
                                            value={ex.type}
                                            onChange={e => onExerciseChange(ex.id, { type: e.target.value })}
                                        >
                                            <option value="reps">Ripetizioni</option>
                                            <option value="time">Tempo</option>
                                        </select>
                                        :
                                        `${ex.type === 'reps' ? 'Ripetizioni' : 'Tempo'}`
                                    }
                                </label>
                                <label>
                                    <p>Unità di Misura:</p>
                                    {onExerciseChange ?
                                        <select 
                                            value={ex.unitType || ''} 
                                            onChange={e => onExerciseChange(ex.id, { unitType: e.target.value || null })} 
                                        >
                                            <option value="">Nessuna</option>
                                            <option value="Kg">Kg</option>
                                            <option value="Km">Km</option>
                                        </select>
                                        :
                                        ex.unitType || 'Nessuna'
                                    }
                                </label>
                                <label>
                                    <p>Riposo:</p>
                                    {onExerciseChange ?
                                        <select 
                                            value={ex.restTime ?? ''}
                                            onChange={(e) => {
                                                const restTime = e.target.value || null;
                                                onExerciseChange(ex.id, {restTime});
                                            }}
                                        >
                                            <option value="">Nessuno</option>
                                            {Array.from({length: 60}).map((_, i) => {
                                                const seconds = (i * 5) + 5;
                                                return <option key={i} value={seconds}>{formatSeconds(seconds)}</option>
                                            })}
                                        </select>
                                        :
                                        (ex.restTime ? formatSeconds(ex.restTime) : 'Nessuno')
                                    }
                                </label>
                            </div>
                            <div className="exercise-sets">
                                <p>Serie:</p>
                                <div className="sets">
                                    <div className="sets-header">
                                        <div className="set-type">
                                            SET
                                        </div>
                                        <div className="set-unitValue">
                                            {ex.unitType !== null &&
                                                ex.unitType
                                            }
                                        </div>
                                        {ex.type === 'reps' &&
                                            <div className="set-repsValue">
                                                REPS
                                            </div>
                                        }
                                        {ex.type === 'time' &&
                                            <div className="set-timeValue">
                                                TEMPO
                                            </div>
                                        }
                                    </div>
                                    {ex.sets.map((set, index) => (
                                        <SetInput
                                            key={index}
                                            exercise={ex}
                                            set={set}
                                            setIndex={index}
                                            onSetChange={onSetChange}
                                            onSetDelete={onSetDelete}
                                            isActive={activeSet && ex.sets.indexOf(activeSet) === index}
                                        />
                                    ))}
                                    {onSetCreation &&
                                        <div className="sets-footer">
                                            <button onClick={() => onSetCreation(ex.id)}>+ Aggiungi Set</button>
                                        </div>
                                    }
                                </div>
                            </div>
                        </>}
                    </div>
                )
            })}
        </div>
    )
}