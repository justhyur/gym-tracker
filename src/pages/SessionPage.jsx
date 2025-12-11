import { Link, Navigate, useParams } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext";
import ExerciseList from "../components/ExerciseList";

export default function () {

    const { id } = useParams();
    const { sessions, routines, activeSession, exercises, endSession, editSetForSessionExercise, createSetForSessionExercise, deleteSetForSessionExercise } = useGlobal();
    const session = sessions.find(s => s.id === Number(id)); 
    if(!session){
        return <Navigate to="/routines"/>
    }
    const routine = routines.find(r => r.id === session.routineId);
    if(!routine){
        return <Navigate to="/routines"/>
    }

    const isActive = activeSession && activeSession.id === session.id;

    return (<>
        <header>
            <Link to={`/routine/${routine.id}`}>← Torna alla Routine</Link>
        </header>
        <h1>Workout | <span style={{fontSize: '.75em'}}>{routine.title}</span></h1>
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
        />
        {session.endTime === null &&
            <div className="buttons">
                <button onClick={() => endSession(session.id)}>Termina Sessione</button>
            </div>
        }
    </>)
}