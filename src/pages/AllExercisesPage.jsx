import ExerciseList from "../components/ExerciseList";
import MainHeader from "../components/MainHeader";
import { useGlobal } from "../context/GlobalContext";

export default function(){

    const { editRoutine, editExercise, deleteExercise, createSetForExercise, editSetForExercise, deleteSetForExercise } = useGlobal();

    return (<>
        <MainHeader/>
        <h1>Lista Esercizi</h1>
        <ExerciseList 
            isEditMode={true}
            onExerciseChange={editExercise}
            onExerciseDelete={deleteExercise}
            onRoutineChange={editRoutine}
            onSetCreation={createSetForExercise}
            onSetChange={editSetForExercise}
            onSetDelete={deleteSetForExercise}
        />
    </>)
}