import { useEffect, useMemo, useState } from 'react'

const initialTasks = [
  ["Monat 1 · Python", "Woche 1 – Variablen, Datentypen, Input/Output", "Begrüßungsprogramm, Taschenrechner, Alter-in-Tagen-Rechner"],
  ["Monat 1 · Python", "Woche 2 – if/else und Vergleichsoperatoren", "Notenrechner, Login-Simulation, Gerade/Ungerade"],
  ["Monat 1 · Python", "Woche 3 – Schleifen", "FizzBuzz, Zahlen 1–100, Passwortversuche begrenzen"],
  ["Monat 1 · Python", "Woche 4 – Funktionen + ToDo-App", "Parameter, Rückgabewerte, Konsolen-ToDo-App"],
  ["Monat 2 · Python Praxis", "Woche 5 – Listen und Dictionaries", "Einkaufsliste, Kontaktliste, XP-System"],
  ["Monat 2 · Python Praxis", "Woche 6 – Strings und Dateien", "Log-Auswerter, Notizspeicher"],
  ["Monat 2 · Python Praxis", "Woche 7 – Fehlerbehandlung und Module", "Dateisortierer bauen"],
  ["Monat 2 · Python Praxis", "Woche 8 – Abschlussprojekt Python", "Mini-Admin-Tool mit Menü, Logs und Dateifunktionen"],
  ["Monat 3 · C#", "Woche 9 – C# Basics", "Syntax, Variablen, Datentypen, Schleifen"],
  ["Monat 3 · C#", "Woche 10 – Klassen und Objekte", "Benutzer-, Produkt- und Fahrzeug-Klasse"],
  ["Monat 3 · C#", "Woche 11 – Collections", "Inventarverwaltung in der Konsole"],
  ["Monat 3 · C#", "Woche 12 – Dateien und JSON", "Ticket-Tool mit Speichern in JSON"],
  ["Monat 4 · C# + SQL", "Woche 13 – OOP sauber strukturieren", "Benutzer- und Rollenverwaltung"],
  ["Monat 4 · C# + SQL", "Woche 14 – SQL Grundlagen", "Tabellen, Schlüssel, SELECT, WHERE"],
  ["Monat 4 · C# + SQL", "Woche 15 – SQL Daten ändern", "INSERT, UPDATE, DELETE, LIKE"],
  ["Monat 4 · C# + SQL", "Woche 16 – JOIN und Auswertungen", "Ticketsystem-Datenbank"],
  ["Monat 5 · Web", "Woche 17 – HTML und CSS Basics", "Startseite oder Dashboard-Layout bauen"],
  ["Monat 5 · Web", "Woche 18 – JavaScript Basics", "Variablen, Funktionen, Arrays, Objekte"],
  ["Monat 5 · Web", "Woche 19 – DOM und Events", "Web-ToDo-App oder kleines Frontend"],
  ["Monat 5 · Web", "Woche 20 – Fetch und JSON", "Dashboard oder Statusseite mit Daten"],
  ["Monat 6 · Portfolio", "Woche 21 – Hauptprojekt wählen", "Ticketsystem, Inventarverwaltung oder Dashboard"],
  ["Monat 6 · Portfolio", "Woche 22 – Projekt verbessern", "Fehlerbehandlung, Oberfläche, Speichern"],
  ["Monat 6 · Portfolio", "Woche 23 – GitHub aufsetzen", "README, Projektbeschreibung, Upload"],
  ["Monat 6 · Portfolio", "Woche 24 – Optionaler Ausblick", "TypeScript oder C++ oder Luau anschauen"]
].map(([phase, title, notes], index) => ({
  id: `task-${index + 1}`,
  phase,
  title,
  notes,
  done: false,
}))

const STORAGE_KEY = 'lernplan-checkliste-v1'

export default function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : initialTasks
  })
  const [newTask, setNewTask] = useState('')
  const [selectedPhase, setSelectedPhase] = useState('Alle')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const phases = useMemo(() => ['Alle', ...new Set(tasks.map((task) => task.phase))], [tasks])
  const filteredTasks = selectedPhase === 'Alle' ? tasks : tasks.filter((task) => task.phase === selectedPhase)
  const doneCount = tasks.filter((task) => task.done).length
  const progress = Math.round((doneCount / tasks.length) * 100) || 0

  const groupedTasks = filteredTasks.reduce((acc, task) => {
    acc[task.phase] ??= []
    acc[task.phase].push(task)
    return acc
  }, {})

  const toggleTask = (id) => {
    setTasks((prev) => prev.map((task) => task.id === id ? { ...task, done: !task.done } : task))
  }

  const addTask = () => {
    const title = newTask.trim()
    if (!title) return
    const phase = selectedPhase === 'Alle' ? 'Eigene Aufgaben' : selectedPhase
    setTasks((prev) => [{
      id: `custom-${Date.now()}`,
      phase,
      title,
      notes: 'Eigene Aufgabe',
      done: false,
    }, ...prev])
    setNewTask('')
  }

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
  }

  const resetAll = () => {
    setTasks((prev) => prev.map((task) => ({ ...task, done: false })))
  }

  return (
    <main className="app-shell">
      <section className="container">
        <header className="hero card">
          <div>
            <p className="eyebrow">6-Monats-Plan</p>
            <h1>Lernplan zum Abhaken</h1>
            <p className="subtitle">Handyfreundliche Checklisten-App für Python, C#, SQL, Web und Portfolio. Dein Fortschritt bleibt lokal auf deinem Gerät gespeichert.</p>
          </div>
        </header>

        <section className="card progress-card">
          <div className="progress-row">
            <div>
              <h2>Gesamtfortschritt</h2>
              <p>{doneCount} von {tasks.length} Aufgaben erledigt</p>
            </div>
            <button className="secondary-btn" onClick={resetAll}>Alles zurücksetzen</button>
          </div>
          <div className="progress-bar" aria-hidden="true">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <p className="progress-label">{progress}% geschafft</p>
        </section>

        <section className="card controls">
          <div className="add-task-row">
            <input
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              placeholder="Eigene Aufgabe ergänzen"
            />
            <button className="primary-btn" onClick={addTask}>Hinzufügen</button>
          </div>
          <div className="chips">
            {phases.map((phase) => (
              <button
                key={phase}
                className={phase === selectedPhase ? 'chip active' : 'chip'}
                onClick={() => setSelectedPhase(phase)}
              >
                {phase}
              </button>
            ))}
          </div>
        </section>

        {Object.entries(groupedTasks).map(([phase, phaseTasks]) => {
          const phaseDone = phaseTasks.filter((task) => task.done).length
          const phaseProgress = Math.round((phaseDone / phaseTasks.length) * 100) || 0

          return (
            <section key={phase} className="card phase-card">
              <div className="phase-header">
                <div>
                  <h2>{phase}</h2>
                  <p>{phaseDone} / {phaseTasks.length} erledigt</p>
                </div>
                <span className="phase-percent">{phaseProgress}%</span>
              </div>
              <div className="progress-bar small" aria-hidden="true">
                <div className="progress-fill" style={{ width: `${phaseProgress}%` }} />
              </div>

              <div className="task-list">
                {phaseTasks.map((task) => (
                  <article key={task.id} className={task.done ? 'task done' : 'task'}>
                    <button className={task.done ? 'checkbox checked' : 'checkbox'} onClick={() => toggleTask(task.id)} aria-label="Aufgabe abhaken">
                      {task.done ? '✓' : ''}
                    </button>
                    <div className="task-content">
                      <h3>{task.title}</h3>
                      <p>{task.notes}</p>
                    </div>
                    <button className="delete-btn" onClick={() => deleteTask(task.id)} aria-label="Aufgabe löschen">✕</button>
                  </article>
                ))}
              </div>
            </section>
          )
        })}
      </section>
    </main>
  )
}
