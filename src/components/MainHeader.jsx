import { Link, useLocation } from "react-router-dom";

export default function () {

    const {pathname} = useLocation();

    return (
        <header>
            <Link to={pathname === '/routines' ? '/exercises' : '/routines'}>{pathname === '/routines' ? 'Vai a Esercizi' : 'Vai a Routines'}</Link>
        </header>
    )
}