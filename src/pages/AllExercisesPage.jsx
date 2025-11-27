import ExerciseList from "../components/ExerciseList";
import MainHeader from "../components/MainHeader";

export default function(){
    return (<>
        <MainHeader/>
        <h1>Lista Esercizi</h1>
        <ExerciseList 
            isEditMode={true}
        />
    </>)
}