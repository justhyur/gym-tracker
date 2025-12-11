import { Link, Navigate, useParams } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext";
import ExerciseList from "../components/ExerciseList";

export default function () {

    const { id } = useParams();
    const { sessions, routines, exercises } = useGlobal();
    const session = sessions.find(s => s.id === Number(id)); 
    if(!session){
        return <Navigate to="/routines"/>
    }
    const routine = routines.find(r => r.id === session.routineId);
    if(!routine){
        return <Navigate to="/routines"/>
    }

    return (<>
        <header>
            <Link to={`/routine/${routine.id}`}>← Torna a {routine.title}</Link>
        </header>
        <h1>Workout | {routine.title}</h1>
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
        />
    </>)
}