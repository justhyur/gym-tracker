import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import { useGlobal } from "../context/GlobalContext";
import { useState } from "react";
import InputTitle from "../components/InputTitle";
import ExerciseList from "../components/ExerciseList";
import ActiveSessionPopup from "../components/ActiveSessionPopup";

export default function () {

    const navigate = useNavigate();
    const { id } = useParams(); 
    const { 
        routines, deleteRoutine, editRoutine, 
        exercises, createExercise, editExercise, deleteExercise, 
        createSetForExercise, editSetForExercise, deleteSetForExercise,
        createSession, activeSession 
    } = useGlobal();
    const routine = routines.find(routine => routine.id === Number(id));

    if(!routine){
        return <Navigate to="/routines"/>
    }

    console.log('exercises', exercises);

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

    function startNewSession(){
        const newSession = createSession(routine.id);
        navigate(`/sessions/${newSession.id}`);
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
            <div className="buttons">
                {isEditMode && 
                    <button onClick={createNewExercise}>Crea Nuovo Esercizio</button>
                }
                {!activeSession && !isEditMode && routine.exerciseIds.length > 0 &&
                    <button onClick={startNewSession}>Avvia Sessione</button>
                }
            </div>
            <ExerciseList 
                routine={routine} 
                isEditMode={isEditMode}
                onExerciseChange={editExercise}
                onExerciseDelete={deleteExercise}
                onRoutineChange={editRoutine}
                onSetCreation={createSetForExercise}
                onSetChange={editSetForExercise}
                onSetDelete={deleteSetForExercise}
            />
            <ActiveSessionPopup/>
        </>
    )
}