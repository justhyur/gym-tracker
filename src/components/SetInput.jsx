import { useGlobal } from "../context/GlobalContext";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import TimePicker from "./TimePicker";

export default function ({exercise, set, setIndex}) {

    const { editSetForExercise, deleteSetForExercise } = useGlobal();

    function editSetProperty(property, value){
        editSetForExercise(exercise.id, setIndex, { [property]: value });
    }

    return (
        <div className="set">
            <select 
                className="set-type"
                value={set.type}
                onChange={(e) => editSetProperty('type', e.target.value)}
            >
                <option value="n">{Number(setIndex) + 1}</option>
                <option value="w">W</option>
                <option value="f">F</option>
                <option value="d">D</option>
            </select>
            <div className="set-unitValue">
                {exercise.unitType !== null &&
                    <input
                        type="number"
                        placeholder={exercise.unitType}
                        value={set.unitValue || ''}
                        onChange={e => editSetProperty('unitValue', e.target.value ? Number(e.target.value) : null)}
                    />
                }
            </div>
            {exercise.type === 'reps' && 
                <input
                    className="set-repsValue"
                    type="number"
                    placeholder="Reps"
                    value={set.repsValue || ''}
                    onChange={e => editSetProperty('repsValue', e.target.value ? Number(e.target.value) : null)}
                />
            }
            {exercise.type === 'time' &&
                <TimePicker
                    className="set-timeValue"
                    placeholder="mm:ss"
                    value={set.timeValue || ''}
                    onChange={value => editSetProperty('timeValue', value || null)}
                />
            }
            <button onClick={() => deleteSetForExercise(exercise.id, setIndex)}>X</button>
        </div>
    );
}