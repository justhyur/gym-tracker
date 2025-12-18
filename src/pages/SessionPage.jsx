import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext";
import ExerciseList from "../components/ExerciseList";
import dayjs from "dayjs";
import { getSessionTitle } from "../lib/utils";
import { useEffect, useState } from "react";

export default function () {

    const navigate = useNavigate();
    const { id } = useParams();
    const { sessions, routines, activeSession, exercises, endSession, editSetForSessionExercise, createSetForSessionExercise, deleteSetForSessionExercise, deleteSession } = useGlobal();
    const session = sessions.find(s => s.id === Number(id)); 
    if(!session){
        return <Navigate to="/routines"/>
    }
    const routine = routines.find(r => r.id === session.routineId);
    if(!routine){
        return <Navigate to="/routines"/>
    }

    const isActive = activeSession && activeSession.id === session.id;

    const handleDiscard = () => {
        const confirmDiscard = window.confirm(`Sei sicuro di voler scartare la sessione iniziata il ${dayjs(session.startTime).format('DD/MM/YYYY HH:mm:ss')}? Questa operazione non può essere annullata.`);
        if(!confirmDiscard) return;
        deleteSession(session.id);
        navigate(`/routine/${routine.id}`);
    }

    const [sessionTitle, setSessionTitle] = useState(getSessionTitle(session));
    useEffect(() => {
        if(session?.endTime){
            setSessionTitle(getSessionTitle(session));
            return;
        }
        const id = setInterval(() => {
            setSessionTitle(getSessionTitle(session));
        }, 1000);
        return () => clearInterval(id);
    },[session?.endTime]);

    return (<>
        <header style={{
            background: 'rgba(0, 0, 0, 0.2)',
            padding: '1.25rem',
            borderRadius: '12px'
        }}>
            <Link to={`/routine/${routine.id}`}>← Torna alla Routine</Link>
        </header>
        <div style={{
            background: 'linear-gradient(135deg, rgba(74, 144, 226, 0.1), rgba(108, 92, 231, 0.1))',
            padding: '1.5rem',
            borderRadius: '12px',
            border: '1px solid var(--card-border)',
            marginTop: '1rem',
            marginBottom: '1rem'
        }}>
            <div style={{fontSize: '0.9rem', opacity: 0.7, marginBottom: '0.5rem'}}>📋 Routine</div>
            <h2 style={{margin: '0 0 1rem 0', padding: 0}}>{routine.title}</h2>
            <div style={{fontSize: '0.9rem', opacity: 0.7, marginBottom: '0.5rem'}}>⏱️ Durata Sessione</div>
            <div style={{
                fontSize: '1.5rem',
                fontWeight: '700',
                color: 'var(--success-color)',
                textShadow: '0 2px 8px rgba(0, 184, 148, 0.3)'
            }}>{sessionTitle}</div>
        </div>
        <ExerciseList
            routine={routine}
            isEditMode={true}
            exercises={session.exercises.map(se => {
                const exercise = exercises.find(e => e.id === Number(se.exerciseId));
                return {
                    ...exercise,
                    ...se,
                }
            })}
            onSetChange={isActive && ((...params) => editSetForSessionExercise(session.id, ...params))}
            onSetCreation={isActive && ((...params) => createSetForSessionExercise(session.id, ...params))}
            onSetDelete={isActive && ((...params) => deleteSetForSessionExercise(session.id, ...params))}
            onCompletion={() => {
                if(session.endTime === null){
                    endSession(session.id);
                }
            }}
        />
        {session.endTime === null &&
            <div className="buttons" style={{
                position: 'sticky',
                bottom: '1rem',
                background: 'rgba(26, 26, 46, 0.95)',
                padding: '1rem',
                borderRadius: '12px',
                backdropFilter: 'blur(10px)',
                boxShadow: 'var(--shadow-lg)',
                marginTop: '2rem'
            }}>
                <button onClick={() => endSession(session.id)} style={{
                    background: 'linear-gradient(135deg, var(--success-color), #00a077)',
                    fontSize: '1.1rem',
                    padding: '0.875rem 1.5rem'
                }}>✅ Termina Sessione</button>
                <button onClick={handleDiscard} style={{
                    background: 'var(--danger-color)'
                }}>❌ Scarta Sessione</button>
            </div>
        }
    </>)
}