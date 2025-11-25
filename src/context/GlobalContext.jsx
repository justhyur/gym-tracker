import { createContext, useContext, useEffect, useState } from "react";

const GlobalContext = createContext();

export function GlobalContextProvider({children}){

    // -- Logiche per gestire le mie Routine --
    const [routines, setRoutines] = useState(() => {
        const localRoutinesString = localStorage.getItem('routines');
        if(localRoutinesString){
            const localRoutine = JSON.parse(localRoutinesString);
            return localRoutine;
        }else{
            return [];
        }
    });
    useEffect(()=> {
        const localRoutinesString = JSON.stringify(routines);
        localStorage.setItem('routines', localRoutinesString);
    }, [routines]);

    const createRoutine = title => {
        const ids = routines.map(r => r.id);
        const lastId = Math.max(-1, ...ids);
        const newRoutine = {
            id: lastId + 1,
            title,
            exerciseIds: [],
            gymId: null
        };
        setRoutines(rs => [...rs, newRoutine]);
        return newRoutine;
    }

    const editRoutine = (id, changes) => {
        setRoutines(rs => rs.map(r => {
            if(r.id !== Number(id)) return r;
            return { ...r, ...changes };
        }));
    }

    const deleteRoutine = id => {
        setRoutines(rs => rs.filter(r => r.id !== Number(id)));
    }


    // -- Logiche per gestire i miei Esercizi --
    const [exercises, setExercises] = useState(() => {
        const localExercisesString = localStorage.getItem('exercises');
        if(localExercisesString){
            const localExercise = JSON.parse(localExercisesString);
            return localExercise;
        }else{
            return [];
        }
    });
    useEffect(()=> {
        const localExercisesString = JSON.stringify(exercises);
        localStorage.setItem('exercises', localExercisesString);
    }, [exercises]);

    const createExercise = (title) => {
        const ids = exercises.map(r => r.id);
        const lastId = Math.max(-1, ...ids);
        const newExercise = {
            id: lastId + 1,
            title,
            restTime: null,
            unitType: 'Kg',
            type: 'reps',
            sets: []
        };
        setExercises(es => [...es, newExercise]);
        return newExercise;
    }

    const editExercise = (id, changes) => {
        setExercises(es => es.map(e => {
            if(e.id !== Number(id)) return e;
            return { ...e, ...changes };
        }));
    }

    const deleteExercise = id => {
        setExercises(es => es.filter(e => e.id !== Number(id)));
    }

    
    return (
        <GlobalContext.Provider value={{
            routines, createRoutine, editRoutine, deleteRoutine,
            exercises, createExercise, editExercise, deleteExercise
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export function useGlobal(){
    const value = useContext(GlobalContext);
    return value;
}