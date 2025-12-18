import { Link, Navigate, Route, Routes, useLocation } from "react-router-dom"
import AllRoutinesPage from "./pages/AllRoutinesPage"
import SingleRoutinePage from "./pages/SingleRoutinePage"
import AllExercisesPage from "./pages/AllExercisesPage"
import SettingsPage from "./pages/SettingsPage"
import SessionPage from "./pages/SessionPage"
import { useGlobal } from "./context/GlobalContext"
import { useEffect } from "react"

function App() {

  const {activeSession} = useGlobal();
  const location = useLocation();

  // Update document title based on current route
  useEffect(() => {
    const titles = {
      '/': 'Gym Tracker',
      '/routines': 'Routine | Gym Tracker',
      '/exercises': 'Esercizi | Gym Tracker',
      '/settings': 'Impostazioni | Gym Tracker'
    };
    
    if (location.pathname.startsWith('/routine/')) {
      document.title = 'Dettaglio Routine | Gym Tracker';
    } else if (location.pathname.startsWith('/sessions/')) {
      document.title = 'Sessione | Gym Tracker';
    } else {
      document.title = titles[location.pathname] || 'Gym Tracker';
    }
  }, [location]);

  return (
    <div className="page-container">
      <Routes>
        <Route path='/' element={<Navigate to="/routines"/>} />
        <Route path='/routines' element={<AllRoutinesPage/>} />
        <Route path='/exercises' element={<AllExercisesPage/>} />
        <Route path='/routine/:id' element={<SingleRoutinePage/>} />
        <Route path='/sessions/:id' element={<SessionPage/>} />
        <Route path='/settings' element={<SettingsPage/>} />
      </Routes>
    </div>
  )
}

export default App
