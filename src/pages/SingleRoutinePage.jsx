import { Link, Navigate, useParams } from "react-router-dom"
import { useGlobal } from "../context/GlobalContext";
import { useState } from "react";
import InputTitle from "../components/InputTitle";
import ExerciseList from "../components/ExerciseList";

export default function () {

    const { id } = useParams();
    const { routines, deleteRoutine, editRoutine, exercises, createExercise } = useGlobal();
    const routine = routines.find(routine => routine.id === Number(id));

    if(!routine){
        return <Navigate to="/routines"/>
    }

    const askDeleteConfirmation = () => {
        const confirmDelete = window.confirm(`Sei sicuro di voler eliminare la routine "${routine.title}"?`);
        if(!confirmDelete) return;
        deleteRoutine(routine.id);
    }

    const [isEditMode, setIsEditMode] = useState(false);

    function addExerciseToRoutine(exerciseId){
        editRoutine(routine.id, { exerciseIds: [...routine.exerciseIds, exerciseId] });
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

    return (
        <>
            <header>
                <Link to="/routines">← Torna alle Routine</Link>
                <div className="buttons">
                    <button onClick={() => setIsEditMode(c => !c)}>
                        {isEditMode ? "Esci da Modifica" : "Modifica"}
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
            {isEditMode && exercises.length !== 0 && 
                <select value="" onChange={e => addExerciseToRoutine(Number(e.target.value))}>
                    <option value="" disabled style={{display: 'none'}}>Aggiungi Esercizio</option>
                    {exercises.map(ex => (
                        <option key={ex.id} value={ex.id}>{ex.title}</option>
                    ))}
                </select>
            }
            {isEditMode && 
                <div className="buttons">
                    <button onClick={createNewExercise}>Crea Nuovo Esercizio</button>
                </div>
            }
            <ExerciseList 
                routine={routine} 
                isEditMode={isEditMode}
            />
        </>
    )
}