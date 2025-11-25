import { Link, Navigate, useParams } from "react-router-dom"
import { useGlobal } from "../context/GlobalContext";
import { useState } from "react";
import InputTitle from "../components/InputTitle";

function formatSeconds(seconds){
    const minutes = seconds / 60; 
    const intMinutes = String(Math.floor(minutes)); 
    const remainingSeconds = String(Math.round((minutes - intMinutes) * 60));
    return `${intMinutes.padStart(2, 0)}:${remainingSeconds.padStart(2, 0)}`;
}

export default function () {

    const { id } = useParams();
    const { routines, deleteRoutine, editRoutine, exercises, createExercise, editExercise } = useGlobal();
    const routine = routines.find(routine => routine.id === Number(id));

    if(!routine){
        return <Navigate to="/routines"/>
    }

    const askDeleteConfirmation = () => {
        const confirmDelete = window.confirm(`Sei sicuro di voler eliminare la routine "${routine.title}"?`);
        if(!confirmDelete) return;
        deleteRoutine(routine.id);
    }

    const [editRoutineMode, setRoutineEditMode] = useState(true);

    const routineExercises = routine.exerciseIds.map(exId => exercises.find(ex => ex.id === exId)).filter(ex => ex !== undefined);
    console.log(routineExercises);

    function addExerciseToRoutine(exerciseId){
        editRoutine(routine.id, { exerciseIds: [...routine.exerciseIds, exerciseId] });
    }

    function removeExerciseFromRoutine(index){
        const isConfirmed = window.confirm("Sei sicuro di voler rimuovere questo esercizio dalla routine?");
        if(!isConfirmed) return;
        const newExerciseIds = [...routine.exerciseIds];
        newExerciseIds.splice(index, 1);
        editRoutine(routine.id, { exerciseIds: newExerciseIds });
    }

    function createNewExercise(){
        let newTitle = prompt("Inserisci il titolo del nuovo esercizio:");
        while(!newTitle || newTitle.trim() === ""){
            if(newTitle === null) return;
            newTitle = prompt("Titolo non valido. Inserisci il titolo del nuovo esercizio:");
        }
        const newExercise = createExercise(newTitle.trim());
        addExerciseToRoutine(newExercise.id);
    }

    function moveExerciseInRoutine(index, direction){
        const newExerciseIds = [...routine.exerciseIds];
        const [movedExerciseId] = newExerciseIds.splice(index, 1);
        newExerciseIds.splice(index + direction, 0, movedExerciseId);
        editRoutine(routine.id, { exerciseIds: newExerciseIds });
    }

    return (
        <>
            <header>
                <Link to="/routines">← Torna alle Routine</Link>
                <div className="buttons">
                    <button onClick={() => setRoutineEditMode(c => !c)}>
                        {editRoutineMode ? "Esci da Modifica" : "Modifica"}
                    </button>
                    <button onClick={askDeleteConfirmation}>Elimina</button>
                </div>
            </header>
            <h1>
                <InputTitle
                    value={routine.title}
                    onChange={newTitle => editRoutine(routine.id, { title: newTitle })}
                />
            </h1>
            {exercises.length !== 0 && 
                <select value="" onChange={e => addExerciseToRoutine(Number(e.target.value))}>
                    <option value="" disabled style={{display: 'none'}}>Aggiungi Esercizio</option>
                    {exercises.map(ex => (
                        <option key={ex.id} value={ex.id}>{ex.title}</option>
                    ))}
                </select>
            }
            <div className="buttons">
                <button onClick={createNewExercise}>Crea Nuovo Esercizio</button>
            </div>
            <div className="exercise-list">
                {routineExercises.map((ex, i) => (
                    <div key={i} className="exercise-card">
                        <div className="exercise-card-header">
                            <h3>
                                <InputTitle
                                    value={ex.title}
                                    onChange={newTitle => editExercise(ex.id, { title: newTitle })}
                                />
                            </h3>
                            {editRoutineMode && 
                                <div className="exercise-card-controls">
                                    <div className="arrows" style={{display: 'flex', flexDirection: 'column', gap: '.25rem'}}>
                                        {i !== 0 &&
                                            <button onClick={() => moveExerciseInRoutine(i, -1)}>↑</button>
                                        }
                                        {i !== routineExercises.length -1 &&
                                            <button  onClick={() => moveExerciseInRoutine(i, 1)}>↓</button>
                                        }
                                    </div>
                                    <button className="remove-exercise" onClick={() => removeExerciseFromRoutine(i)}>×</button>
                                </div>
                            }
                        </div>
                        {editRoutineMode && 
                            <div className="exercise-card-config">
                                <label>
                                    <p>Tipologia:</p>
                                    <select
                                        value={ex.type}
                                        onChange={e => editExercise(ex.id, { type: e.target.value })}
                                    >
                                        <option value="reps">Ripetizioni</option>
                                        <option value="time">Tempo</option>
                                    </select>
                                </label>
                                <label>
                                    <p>Unità di Misura:</p>
                                    <select 
                                        value={ex.unitType || ''} 
                                        onChange={e => editExercise(ex.id, { unitType: e.target.value || null })} 
                                    >
                                        <option value="">Nessuna</option>
                                        <option value="Kg">Kg</option>
                                        <option value="Km">Km</option>
                                    </select>
                                </label>
                                <label>
                                    <p>Riposo:</p>
                                    <select 
                                        value={ex.restTime ?? ''}
                                        onChange={(e) => {
                                            const restTime = e.target.value || null;
                                            editExercise(ex.id, {restTime});
                                        }}
                                    >
                                        <option value="">Nessuno</option>
                                        {Array.from({length: 60}).map((_, i) => {
                                            const seconds = (i * 5) + 5;
                                            return <option key={i} value={seconds}>{formatSeconds(seconds)}</option>
                                        })}
                                    </select>
                                </label>
                            </div>
                        }
                    </div>
                ))}
            </div>

        </>
    )
}