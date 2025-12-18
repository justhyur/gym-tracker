import { useRef } from "react";
import MainHeader from "../components/MainHeader";
import { useGlobal } from "../context/GlobalContext";

export default function(){

    const global = useGlobal();

    function handleExport(e){
        e.preventDefault();
        const form = e.target;
        const data = {};
        ['routines', 'exercises', 'sessions'].forEach(key => {
            if(form[key].checked){
                data[key] = global[key];
            }
        });
        if(Object.keys(data).length === 0){
            alert("Seleziona almeno una categoria di dati da esportare.");
            return;
        }
        const blob = new Blob([JSON.stringify(data)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "export.gymtracker";
        a.click();
        URL.revokeObjectURL(url);
    }

    function handleImport(e){
        const file = e.target.files[0];
        if(!file) return;
        if(!file.name.endsWith('.gymtracker')){
            alert("Formato file non valido. Seleziona un file con estensione .gymtracker");
            return;
        }
        const reader = new FileReader();
        reader.onload = function(event){
            const text = event.target.result;
            const data = JSON.parse(text);
            global.importData(data);
        }
        reader.readAsText(file);
        alert("Dati importati con successo!");
    }

    const inputFileRef = useRef();

    return (<>
        <MainHeader/>
        <h1>⚙️ Impostazioni</h1>
        <div style={{
            margin: '2rem 0',
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap'
        }}>
            <button 
                onClick={() => inputFileRef.current.click()}
                style={{
                    background: 'var(--secondary-color)',
                    boxShadow: '0 2px 8px rgba(108, 92, 231, 0.3)'
                }}
            >
                📥 Importa file .gymtracker
            </button>
            <input 
                hidden
                ref={inputFileRef} 
                type="file" 
                accept=".gymtracker" 
                onChange={handleImport}
            />
        </div>
        <form className="export-form" onSubmit={handleExport}>
            <h3 style={{marginBottom: '1rem'}}>📤 Esporta i tuoi dati</h3>
            <label style={{
                flexDirection: 'row',
                padding: '0.75rem 1rem',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px',
                width: '100%',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
            }}>
                <input 
                    name="routines" 
                    type="checkbox"
                    style={{
                        width: '20px',
                        height: '20px',
                        cursor: 'pointer'
                    }}
                />
                <span>📋 Routine</span>
            </label>
            <label style={{
                flexDirection: 'row',
                padding: '0.75rem 1rem',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px',
                width: '100%',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
            }}>
                <input 
                    name="exercises" 
                    type="checkbox"
                    style={{
                        width: '20px',
                        height: '20px',
                        cursor: 'pointer'
                    }}
                />
                <span>💪 Esercizi</span>
            </label>
            <label style={{
                flexDirection: 'row',
                padding: '0.75rem 1rem',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '8px',
                width: '100%',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
            }}>
                <input 
                    name="sessions" 
                    type="checkbox"
                    style={{
                        width: '20px',
                        height: '20px',
                        cursor: 'pointer'
                    }}
                />
                <span>📅 Sessioni</span>
            </label>
            <button style={{
                width: '100%',
                background: 'var(--success-color)',
                boxShadow: '0 2px 8px rgba(0, 184, 148, 0.3)'
            }}>
                ⬇️ Esporta
            </button>
        </form>
    </>)
}