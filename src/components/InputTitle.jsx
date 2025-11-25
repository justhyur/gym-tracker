import { useState } from "react";

export default function({value, onChange}){
    const [editTitleMode, setEditTitleMode] = useState(false);
    const saveTitle = (e) => {
        const newTitle = e.target.value.trim();
        if(newTitle){
            onChange(newTitle)
        }
        setEditTitleMode(false);
    }
    return (<>
        { !editTitleMode && 
            <span onClick={() => setEditTitleMode(true)}>{value}</span>
        }
        { editTitleMode && (
            <input
                autoFocus
                type="text"
                defaultValue={value}
                onBlur={saveTitle}
                onKeyDown={e => {
                    if(e.key === 'Enter'){
                        saveTitle(e);
                    }
                }}
            />
        )}
    </>)
}