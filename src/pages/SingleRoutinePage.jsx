import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import { useGlobal } from "../context/GlobalContext";
import { useState } from "react";
import InputTitle from "../components/InputTitle";
import ExerciseList from "../components/ExerciseList";
import ActiveSessionPopup from "../components/ActiveSessionPopup";
import dayjs from "dayjs";
import { formatSecondsToMMSS, getSessionTitle } from "../lib/utils";

export default function () {

    const navigate = useNavigate();
    const { id } = useParams(); 
    const { 
        routines, deleteRoutine, editRoutine, 
        exercises, createExercise, editExercise, deleteExercise, 
        createSetForExercise, editSetForExercise, deleteSetForExercise,
        sessions, createSession, deleteSession, activeSession 
    } = useGlobal();
    const routine = routines.find(routine => routine.id === Number(id));

    if(!routine){
        return <Navigate to="/routines"/>
    }

    const routineSessions = sessions.filter(s => s.routineId === routine.id && s.endTime).sort((a, b) => 
        dayjs(b.startTime).valueOf() - dayjs(a.startTime).valueOf())
    ;

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

    const [showRoutineSessions, setShowRoutineSessions] = useState(false);

    return (
        <>
            <header style={{
                background: 'rgba(0, 0, 0, 0.2)',
                padding: '1.25rem',
                borderRadius: '12px'
            }}>
                <Link to="/routines">← Torna alle Routine</Link>
                <div className="buttons" style={{margin: 0}}>
                    <button onClick={() => setIsEditMode(c => !c)} style={{
                        background: isEditMode ? 'var(--warning-color)' : 'var(--primary-color)'
                    }}>
                        {isEditMode ? "✓ Esci da Modifica" : "✏️ Modifica"}
                    </button>
                    <button onClick={askDeleteConfirmation} style={{
                        background: 'var(--danger-color)'
                    }}>🗑️ Elimina</button>
                </div>
            </header>
            <h1>
                <InputTitle
                    value={routine.title}
                    onChange={newTitle => editRoutine(routine.id, { title: newTitle })}
                />
            </h1>
            {isEditMode && exercises.length !== 0 && 
                <select 
                    value="" 
                    onChange={e => addExerciseToRoutine(Number(e.target.value))}
                    style={{
                        width: '100%',
                        maxWidth: '400px',
                        margin: '1rem auto',
                        display: 'block',
                        fontSize: '1rem',
                        padding: '0.75rem 1rem'
                    }}
                >
                    <option value="" disabled style={{display: 'none'}}>➕ Aggiungi Esercizio</option>
                    {exercises.map(ex => (
                        <option key={ex.id} value={ex.id}>{ex.title}</option>
                    ))}
                </select>
            }
            <div className="buttons">
                {isEditMode && 
                    <button onClick={createNewExercise} style={{
                        background: 'var(--success-color)'
                    }}>➕ Crea Nuovo Esercizio</button>
                }
                {!activeSession && !isEditMode && routine.exerciseIds.length > 0 &&
                    <button onClick={startNewSession} style={{
                        background: 'linear-gradient(135deg, var(--success-color), #00a077)',
                        fontSize: '1.1rem',
                        padding: '0.875rem 1.5rem'
                    }}>🚀 Avvia Sessione</button>
                }
                {!isEditMode && routineSessions.length > 0 &&
                    <button onClick={() => setShowRoutineSessions(c => !c)} style={{
                        background: 'var(--secondary-color)'
                    }}>{showRoutineSessions ? '👁️ Nascondi' : '📊 Mostra'} Sessioni</button>
                }
            </div>
            {!isEditMode && showRoutineSessions &&
                <div className="routine-sessions">
                    {routineSessions.map(session => (
                        <div key={session.id} className="routine-session">
                            <span style={{marginRight: '0.5rem'}}>📅</span>
                            <Link to={`/sessions/${session.id}`} style={{flex: 1}}>
                                {getSessionTitle(session)}
                            </Link>
                            <button onClick={() => deleteSession(session.id)}>🗑️</button>
                        </div>
                    ))}
                </div>
            }
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