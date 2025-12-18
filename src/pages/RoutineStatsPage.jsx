import { Link, Navigate, useNavigate, useParams } from "react-router-dom"
import { useGlobal } from "../context/GlobalContext";
import RoutineStats from "../components/RoutineStats";

export default function () {

    const navigate = useNavigate();
    const { id } = useParams();
    const { routines, sessions } = useGlobal();
    const routine = routines.find(routine => routine.id === Number(id));
    if(!routine){
        return <Navigate to="/routines"/>
    }

    const routineSessions = sessions.filter(s => s.routineId === routine.id && s.endTime);
    if(routineSessions.length < 2){
        return <Navigate to={`/routine/${routine.id}`}/>
    }

    console.log(routineSessions);

    return (
        <div>
            <header style={{
                background: 'rgba(0, 0, 0, 0.2)',
                padding: '1.25rem',
                borderRadius: '12px'
            }}>
                <Link to={`/routine/${routine.id}`}>← Torna alla Routine</Link>
            </header>
            <h1>Statistiche di {routine.title}</h1>
            <RoutineStats
                sessions={routineSessions}
            />
        </div>
    )
}