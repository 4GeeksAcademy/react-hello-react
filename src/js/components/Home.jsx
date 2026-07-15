import React, { useState, useEffect } from "react";

const API_URL = "https://playground.4geeks.com/todo";
const USERNAME = "charleychimpy07"; 

const Home = () => {
    const [tasks, setTasks] = useState([]);
    const [inputValue, setInputValue] = useState("");

    const getTasks = async () => {
        try {
            const response = await fetch(`${API_URL}/users/${USERNAME}`);
            if (response.status === 404) {
                await createUser();
            } else if (response.ok) {
                const data = await response.json();
                setTasks(data.todos || []);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const createUser = async () => {
        try {
            const response = await fetch(`${API_URL}/users/${USERNAME}`, {
                method: "POST" // Quitamos los headers porque no enviamos body al crear usuario
            });
            
            // Si la respuesta es OK (201) o da 400 (porque ya se creó hace 1 milisegundo por Strict Mode)
            if (response.ok || response.status === 400) {
                // Volvemos a pedir las tareas directamente
                const res = await fetch(`${API_URL}/users/${USERNAME}`);
                if (res.ok) {
                    const data = await res.json();
                    setTasks(data.todos || []);
                }
            }
        } catch (error) {
            console.error(error);
        }
    };

    const addTask = async (e) => {
        if (e.key === "Enter" && inputValue.trim() !== "") {
            const newTask = {
                label: inputValue,
                is_done: false
            };

            try {
                const response = await fetch(`${API_URL}/todos/${USERNAME}`, {
                    method: "POST",
                    body: JSON.stringify(newTask),
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (response.ok) {
                    setInputValue("");
                    getTasks();
                }
            } catch (error) {
                console.error(error);
            }
        }
    };

    const deleteTask = async (todoId) => {
        try {
            const response = await fetch(`${API_URL}/todos/${todoId}`, {
                method: "DELETE"
            });

            if (response.ok) {
                getTasks();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const clearAllTasks = async () => {
        try {
            const response = await fetch(`${API_URL}/users/${USERNAME}`, {
                method: "DELETE"
            });

            if (response.ok) {
                setTasks([]);
                await createUser();
            }
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getTasks();
    }, []);

    return (
        <div className="container mt-5" style={{ maxWidth: "500px" }}>
            <h1 className="text-center text-secondary opacity-50 display-3">todos</h1>
            <div className="card shadow-sm">
                <input
                    type="text"
                    className="form-control form-control-lg border-0 border-bottom rounded-0 px-4"
                    placeholder="¿Qué necesitas hacer hoy?"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={addTask}
                />
                <ul className="list-group list-group-flush">
                    {tasks.length === 0 ? (
                        <li className="list-group-item text-muted text-center py-3">
                            No hay tareas pendientes. ¡Añade una!
                        </li>
                    ) : (
                        tasks.map((task) => (
                            <li
                                key={task.id}
                                className="list-group-item d-flex justify-content-between align-items-center px-4 py-3"
                            >
                                <span>{task.label}</span>
                                <button
                                    className="btn btn-sm btn-outline-danger border-0"
                                    onClick={() => deleteTask(task.id)}
                                >
                                    ✕
                                </button>
                            </li>
                        ))
                    )}
                </ul>
                <div className="card-footer text-muted d-flex justify-content-between align-items-center bg-white px-4">
                    <span>
                        {tasks.length} {tasks.length === 1 ? "tarea pendiente" : "tareas pendientes"}
                    </span>
                    <button className="btn btn-sm btn-danger" onClick={clearAllTasks}>
                        Limpiar todo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;