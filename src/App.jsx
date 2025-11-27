import { Link, Navigate, Route, Routes } from "react-router-dom"
import AllRoutinesPage from "./pages/AllRoutinesPage"
import SingleRoutinePage from "./pages/SingleRoutinePage"
import AllExercisesPage from "./pages/AllExercisesPage"

function App() {

  return (
    <div className="page-container">
      <Routes>
        <Route path='/' element={<Navigate to="/routines"/>} />
        <Route path='/routines' element={<AllRoutinesPage/>} />
        <Route path='/exercises' element={<AllExercisesPage/>} />
        <Route path='/routine/:id' element={<SingleRoutinePage/>} />
      </Routes>
    </div>
  )
}

export default App
