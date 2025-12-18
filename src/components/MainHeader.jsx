import { Link, useLocation } from "react-router-dom";

export default function () {

    const {pathname} = useLocation();

    return (
        <header style={{
            background: 'rgba(0, 0, 0, 0.2)',
            padding: '1.25rem',
            borderRadius: '12px',
            marginBottom: '1.5rem'
        }}>
            <Link to={pathname === '/routines' ? '/exercises' : '/routines'}>
                {pathname === '/routines' ? '💪 Vai a Esercizi' : '📋 Vai a Routines'}
            </Link>
            <Link to="/settings">⚙️ Impostazioni</Link>
        </header>
    )
}