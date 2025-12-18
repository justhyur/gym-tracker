import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import dayjs from 'dayjs';
import { Line } from 'react-chartjs-2';
import { useGlobal } from '../context/GlobalContext';
import { formatSecondsToMMSS } from '../lib/utils';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: 'rgba(255, 255, 255, 0.9)',
        font: {
          size: 12,
          weight: '500'
        },
        padding: 15,
        usePointStyle: true,
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      titleColor: 'rgba(255, 255, 255, 0.9)',
      bodyColor: 'rgba(255, 255, 255, 0.8)',
      borderColor: 'rgba(74, 144, 226, 0.5)',
      borderWidth: 1,
      cornerRadius: 8,
    }
  },
  scales: {
    y: {
      ticks: {
        color: 'rgba(255, 255, 255, 0.7)',
        font: {
          size: 11
        }
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.1)',
      }
    },
    x: {
      ticks: {
        color: 'rgba(255, 255, 255, 0.7)',
        font: {
          size: 11
        },
        maxRotation: 45,
        minRotation: 45
      },
      grid: {
        color: 'rgba(255, 255, 255, 0.05)',
      }
    }
  }
};

export default function ({sessions}) {

    const { exercises } = useGlobal();

    const sortedSessions = sessions.sort((a, b) => dayjs(a.startTime).valueOf() - dayjs(b.startTime).valueOf());
    const labels = sortedSessions.map(s => dayjs(s.startTime).format('DD/MM HH:mm'));

    // Calculate statistics
    const totalSessions = sessions.length;
    const totalDuration = sessions.reduce((acc, s) => {
        if (!s.endTime) return acc;
        return acc + (dayjs(s.endTime).valueOf() - dayjs(s.startTime).valueOf()) / 1000;
    }, 0);
    const avgDuration = totalSessions > 0 ? totalDuration / totalSessions : 0;

    const totalSets = sessions.reduce((acc, s) => {
        return acc + s.exercises.reduce((exAcc, ex) => exAcc + ex.sets.length, 0);
    }, 0);

    const completedSets = sessions.reduce((acc, s) => {
        return acc + s.exercises.reduce((exAcc, ex) => {
            return exAcc + ex.sets.filter(set => set.isCompleted).length;
        }, 0);
    }, 0);

    const completionRate = totalSets > 0 ? (completedSets / totalSets * 100).toFixed(1) : 0;

    const totalVolume = sessions.reduce((acc, s) => {
        return acc + s.exercises.reduce((exAcc, sessionEx) => {
            const ex = exercises.find(e => e.id === sessionEx.exerciseId);
            if (ex?.unitType !== 'Kg') return exAcc;
            return exAcc + sessionEx.sets.reduce((setAcc, set) => {
                return setAcc + (set.unitValue || 0) * (set.repsValue || 0);
            }, 0);
        }, 0);
    }, 0);

    const totalReps = sessions.reduce((acc, s) => {
        return acc + s.exercises.reduce((exAcc, sessionEx) => {
            const ex = exercises.find(e => e.id === sessionEx.exerciseId);
            if (ex?.type !== 'reps') return exAcc;
            return exAcc + sessionEx.sets.reduce((setAcc, set) => {
                return setAcc + (set.repsValue || 0);
            }, 0);
        }, 0);
    }, 0);

    // Calculate effort data for each session
    const effortData = sessions.map((session) => {
        let effort = 0;
        session.exercises.forEach(sessionEx => {
            const ex = exercises.find(e => e.id === sessionEx.exerciseId);
            if (!ex) return;
            sessionEx.sets.forEach((set, setIndex) => {
                const repsValue = ex.type === 'reps' ? (set.repsValue || 0) : (Number(set.timeValue || 0) / 3);
                const volume = ex.unitType !== null ? repsValue * (set.unitValue || 0) : repsValue * 70;
                const setExtraVolume = volume * (0.05 * (setIndex + 1));
                let setEffort = (volume + setExtraVolume) / 100;
                if(ex.restTime !== null && set.endTime && set.restEndTime){
                    const restIndex = Math.round((dayjs(set.restEndTime).valueOf() - dayjs(set.endTime).valueOf()) / 1000 / 30);
                    setEffort -= setEffort * (0.01 * restIndex);
                }
                effort += setEffort;
            });
        });
        return effort;
    });

    const maxEffort = Math.max(...effortData);
    const avgEffort = effortData.length > 0 ? effortData.reduce((a, b) => a + b, 0) / effortData.length : 0;

    const StatCard = ({ icon, label, value, subtitle, color }) => (
        <div className="stat-card" style={{
            background: `linear-gradient(135deg, ${color}15, ${color}05)`,
            borderColor: `${color}40`
        }}>
            <div className="stat-icon" style={{ color }}>{icon}</div>
            <div className="stat-content">
                <div className="stat-label">{label}</div>
                <div className="stat-value" style={{ color }}>{value}</div>
                {subtitle && <div className="stat-subtitle">{subtitle}</div>}
            </div>
        </div>
    );

    return (<>
        <div className="stats-header">
            <h2 style={{ margin: '0 0 1rem 0', padding: 0 }}>📊 Statistiche Routine</h2>
        </div>

        <div className="stats-grid">
            <StatCard 
                icon="🏋️" 
                label="Sessioni Totali" 
                value={totalSessions}
                color="var(--primary-color)"
            />
            <StatCard 
                icon="⏱️" 
                label="Durata Media" 
                value={formatSecondsToMMSS(avgDuration, true)}
                subtitle={`Totale: ${formatSecondsToMMSS(totalDuration, true)}`}
                color="var(--secondary-color)"
            />
            <StatCard 
                icon="✅" 
                label="Tasso Completamento" 
                value={`${completionRate}%`}
                subtitle={`${completedSets}/${totalSets} serie`}
                color="var(--success-color)"
            />
            <StatCard 
                icon="💪" 
                label="Volume Totale" 
                value={`${totalVolume.toLocaleString()} Kg`}
                color="var(--danger-color)"
            />
            <StatCard 
                icon="🔁" 
                label="Ripetizioni Totali" 
                value={totalReps.toLocaleString()}
                color="var(--warning-color)"
            />
            <StatCard 
                icon="🔥" 
                label="Sforzo Medio" 
                value={avgEffort.toFixed(1)}
                subtitle={`Max: ${maxEffort.toFixed(1)}`}
                color="var(--primary-color)"
            />
        </div>

        <div className="charts-container">
            <div className="chart-wrapper">
                <h3 className="chart-title">📈 Andamento Sforzo</h3>
                <div className="chart">
                    <Line options={options} data={{
                        labels,
                        datasets: [
                            {
                                label: 'Sforzo',
                                data: effortData,
                                borderColor: 'rgb(74, 144, 226)',
                                backgroundColor: 'rgba(74, 144, 226, 0.2)',
                                tension: 0.4,
                                fill: true,
                                pointRadius: 4,
                                pointHoverRadius: 6,
                                pointBackgroundColor: 'rgb(74, 144, 226)',
                                pointBorderColor: '#fff',
                                pointBorderWidth: 2,
                            },
                        ]
                    }} />
                </div>
            </div>

            <div className="chart-wrapper">
                <h3 className="chart-title">💪 Volume (Kg)</h3>
                <div className="chart">
                    <Line options={options} data={{
                        labels,
                        datasets: [
                            {
                                label: 'Volume (Kg)',
                                data: sessions.map((session) => {
                                    let volume = 0;
                                    session.exercises.forEach(sessionEx => {
                                        const ex = exercises.find(e => e.id === sessionEx.exerciseId);
                                        if(ex?.unitType !== 'Kg') return;
                                        sessionEx.sets.forEach(set => {
                                            volume += (set.unitValue || 0) * (set.repsValue || 0);
                                        });
                                    });
                                    return volume;
                                }),
                                borderColor: 'rgb(255, 118, 117)',
                                backgroundColor: 'rgba(255, 118, 117, 0.2)',
                                tension: 0.4,
                                fill: true,
                                pointRadius: 4,
                                pointHoverRadius: 6,
                                pointBackgroundColor: 'rgb(255, 118, 117)',
                                pointBorderColor: '#fff',
                                pointBorderWidth: 2,
                            },
                        ]
                    }} />
                </div>
            </div>

            <div className="chart-wrapper">
                <h3 className="chart-title">🔁 Ripetizioni Totali</h3>
                <div className="chart">
                    <Line options={options} data={{
                        labels,
                        datasets: [
                            {
                                label: 'Ripetizioni',
                                data: sessions.map((session) => {
                                    let reps = 0;
                                    session.exercises.forEach(sessionEx => {
                                        const ex = exercises.find(e => e.id === sessionEx.exerciseId);
                                        if(ex?.type !== 'reps') return;
                                        sessionEx.sets.forEach(set => {
                                            reps += (set.repsValue || 0);
                                        });
                                    });
                                    return reps;
                                }),
                                borderColor: 'rgb(0, 184, 148)',
                                backgroundColor: 'rgba(0, 184, 148, 0.2)',
                                tension: 0.4,
                                fill: true,
                                pointRadius: 4,
                                pointHoverRadius: 6,
                                pointBackgroundColor: 'rgb(0, 184, 148)',
                                pointBorderColor: '#fff',
                                pointBorderWidth: 2,
                            },
                        ]
                    }} />
                </div>
            </div>
        </div>
    </>)
}