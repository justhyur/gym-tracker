import { createContext, useContext, useEffect, useState } from "react";

const GlobalContext = createContext();

export function GlobalContextProvider({children}){

    // -- Logiche per gestire le mie Routine --
    const [routine, setRoutine] = useState(() => {
        const localRoutineString = localStorage.getItem('routine');
        if(localRoutineString){
            const localRoutine = JSON.parse(localRoutineString);
            return localRoutine;
        }else{
            return [];
        }
    });
    useEffect(()=> {
        const localRoutineString = JSON.stringify(routine);
        localStorage.setItem('routine', localRoutineString);
    }, [routine]);


    // -- Logiche per gestire i miei Esercizi --
    
    return (
        <GlobalContext.Provider value={{
            routine, setRoutine
        }}>
            {children}
        </GlobalContext.Provider>
    )
}

export function useGlobal(){
    const value = useContext(GlobalContext);
    return value;
}