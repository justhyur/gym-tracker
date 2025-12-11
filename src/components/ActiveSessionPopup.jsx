import { Link } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext";

export default function (){

    const { activeSession } = useGlobal();

    return !activeSession ? null : (
        <div className="session-popup">
            <Link to={`/sessions/${activeSession.id}`}>Torna alla sessione attiva</Link>
        </div>
    )
}