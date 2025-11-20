import { Link, Navigate, useParams } from "react-router-dom"
import { useGlobal } from "../context/GlobalContext";

export default function () {

    const { id } = useParams();
    const { routines, deleteRoutine } = useGlobal();
    const routine = routines.find(routine => routine.id === Number(id));

    if(!routine){
        return <Navigate to="/routines"/>
    }

    const askDeleteConfirmation = () => {
        const confirmDelete = window.confirm(`Sei sicuro di voler eliminare la routine "${routine.title}"?`);
        if(!confirmDelete) return;
        deleteRoutine(routine.id);
    }

    return (
        <>
            <header>
                <Link to="/routines">← Torna alle Routine</Link>
                <div className="buttons">
                    <button>Modifica</button>
                    <button onClick={askDeleteConfirmation}>Elimina</button>
                </div>
            </header>
            <h1>{routine.title}</h1>
        </>
    )
}