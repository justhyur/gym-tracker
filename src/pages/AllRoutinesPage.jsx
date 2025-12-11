import { Link, useNavigate } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext";
import MainHeader from "../components/MainHeader";
import ActiveSessionPopup from "../components/ActiveSessionPopup";

export default function () {

    const navigate = useNavigate();

    const { routines, createRoutine } = useGlobal();

    function createNewRoutine(){
        let newTitle = prompt("Inserisci il titolo della nuova routine:");
        while(!newTitle || newTitle.trim() === ""){
            if(newTitle === null) return;
            newTitle = prompt("Titolo non valido. Inserisci il titolo della nuova routine:");
        }
        const newRoutine = createRoutine(newTitle.trim());
        navigate(`/routine/${newRoutine.id}`);
    }

    return (
        <>
            <MainHeader/>
            <h1>Lista Routine</h1>
            <div className="buttons">
                <button onClick={createNewRoutine}>Aggiungi Routine</button>
            </div>
            <div className="routines-list">
                {routines.length === 0 && (
                    <p>Non ci sono routine disponibili. Aggiungine una!</p>
                )}
                {routines.map((routine) => (
                    <div className="routine" key={routine.id}>
                        <Link className="routine-title" to={`/routine/${routine.id}`}>{routine.title}</Link>
                    </div>
                ))}
            </div>
            <ActiveSessionPopup/>
        </>
    )
}