import { createContext, useReducer, useEffect } from "react";

export const GlobalContext = createContext();

const initialState = {
    isSidebarVisible: true,
    theme: localStorage.getItem("theme") || "light",
    todos: [],
};

const globalReducer = (state, action) => {
    switch (action.type) {
        case "TOGGLE_SIDEBAR":
            return { ...state, isSidebarVisible: !state.isSidebarVisible };
        case "TOGGLE_THEME":
            localStorage.setItem("theme", state.theme === "light" ? "dark" : "light");
            return { ...state, theme: state.theme === "light" ? "dark" : "light" };
        case "ADD_TODO":
            return { ...state, todos: [...state.todos, action.payload] };
        case "TOGGLE_COMPLETE":
            return {
                ...state,
                todos: state.todos.map((todo) =>
                    todo.id === action.payload
                        ? { ...todo, completed: !todo.completed }
                        : todo
                ),
            };
        case "TOGGLE_IMPORTANT":
            return {
                ...state,
                todos: state.todos.map((todo) =>
                    todo.id === action.payload
                        ? { ...todo, important: !todo.important }
                        : todo
                ),
            };
        case "REMOVE_TODO":
            return { ...state, todos: state.todos.filter(todo => todo.id !== action.payload) };
        case "SET_TODOS":  // ✅ Add this case
            return { ...state, todos: action.payload };
        default:
            return state;
    }
};


export const GlobalProvider = ({ children }) => {
    const [state, dispatch] = useReducer(globalReducer, initialState);

    useEffect(() => {
        localStorage.setItem("theme", state.theme);
    }, [state.theme]);

    return (
        <GlobalContext.Provider value={{ state, dispatch }}>
            {children}
        </GlobalContext.Provider>
    );
};
