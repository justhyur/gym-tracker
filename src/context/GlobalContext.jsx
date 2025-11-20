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
            exercisesIds: [],
            gymId: null
        };
        setRoutines(rs => [...rs, newRoutine]);
        return newRoutine;
    }

    const deleteRoutine = id => {
        setRoutines(rs => rs.filter(r => r.id !== Number(id)));
    }


    // -- Logiche per gestire i miei Esercizi --
    
    return (
        <GlobalContext.Provider value={{
            routines, createRoutine, deleteRoutine
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export function useGlobal(){
    const value = useContext(GlobalContext);
    return value;
}