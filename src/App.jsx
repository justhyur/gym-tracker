import { Link, Navigate, Route, Routes } from "react-router-dom"
import AllRoutinesPage from "./pages/AllRoutinesPage"
import SingleRoutinePage from "./pages/SingleRoutinePage"
import AllExercisesPage from "./pages/AllExercisesPage"
import SettingsPage from "./pages/SettingsPage"
import SessionPage from "./pages/SessionPage"
import { useGlobal } from "./context/GlobalContext"

function App() {

  const {activeSession} = useGlobal();

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
