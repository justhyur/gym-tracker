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
        <header>
            <Link to={`/routine/${routine.id}`}>← Torna alla Routine</Link>
        </header>
        <h1><span style={{fontSize: '.75em'}}>{routine.title}</span> | {sessionTitle}</h1>
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
            <div className="buttons">
                <button onClick={() => endSession(session.id)}>Termina Sessione</button>
                <button onClick={handleDiscard}>Scarta Sessione</button>
            </div>
        }
    </>)
}