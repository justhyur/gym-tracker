import { Navigate, Route, Routes } from "react-router-dom"
import AllRoutinesPage from "./pages/AllRoutinesPage"
import SingleRoutinePage from "./pages/SingleRoutinePage"

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={<Navigate to="/routines"/>} />
        <Route path='/routines' element={<AllRoutinesPage/>} />
        <Route path='/routine/:id' element={<SingleRoutinePage/>} />
      </Routes>
    </>
  )
}

export default App
