import { useContext, useState, useEffect } from "react";
import { FaRegStar, FaStar } from "react-icons/fa";
import { GlobalContext } from "../Context/GlobalState";
import { toast, ToastContainer } from "react-toastify";

const Todos = () => {
  const { state, dispatch, user } = useContext(GlobalContext);

  const [newTask, setNewTask] = useState("");
  const [descp, setDescp] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!dispatch) return;

    const savedTodos = JSON.parse(localStorage.getItem("todos")) || [];
    dispatch({ type: "SET_TODOS", payload: savedTodos });
  }, [dispatch]);

  useEffect(() => {
    if (state?.todos) {
      localStorage.setItem("todos", JSON.stringify(state.todos));
    }
  }, [state?.todos]);

  useEffect(() => {
    if (!user?.username) return;

    const fetchTasks = async () => {
      try {
        const res = await fetch(
          "http://localhost:3000/auth/dashboard/view_tasks"
        );
        const data = await res.json();
        if (data.Status) {
          const myOngoing = data.data.filter(
            (task) => task.assignedTo === user.username && !task.completed
          );
          setTasks(myOngoing);
        } else {
          console.error("Failed to fetch tasks:", data.Error);
        }
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };

    fetchTasks();
  }, [user?.username]);

  if (!state || !dispatch) {
    return <div>Loading...</div>;
  }

  const handleAddTask = () => {
    if (newTask.trim() === "") {
      toast.error("Error while creating task");
      return;
    }

    const newTodo = {
      id: Date.now(),
      task: newTask.trim(),
      completed: false,
      important: false,
      description: descp.trim(),
      date: selectedDate ? selectedDate.toLocaleDateString() : "No Date",
      source: "local",
    };

    dispatch({ type: "ADD_TODO", payload: newTodo });
    toast.success("Task added");
    setNewTask("");
    setDescp("");
    setSelectedDate(null);
  };

  const toggleComplete = (id, source) => {
    if (source === "local") {
      dispatch({ type: "TOGGLE_COMPLETE", payload: id });
    }
  };

  const removeCompletedTask = (id) => {
    dispatch({ type: "REMOVE_TODO", payload: id });
  };

  const toggleImportant = (id) => {
    dispatch({ type: "TOGGLE_IMPORTANT", payload: id });
  };

  const allTasks = [...(state.todos || []), ...(state.backendTodos || [])];

  return (
    <div className="p-6 w-full mt-10">
      <div
        className={`${
          state.theme === "dark" ? "bg-[#000000FF]" : "bg-[#FBFDFC]"
        } p-4 rounded-md shadow-md mb-6`}
      >
        <h2 className="mb-3 font-semibold">Self Assign Task 📝</h2>
        <div className="flex flex-col gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Write your task here"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#000000FF]"
          />
          <input
            type="text"
            value={descp}
            onChange={(e) => setDescp(e.target.value)}
            placeholder="Description"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#000000FF]"
          />
          <button
            onClick={handleAddTask}
            className={`mt-1 ${
              state.theme === "dark" ? "bg-[#0CEB10C5]" : "bg-[#067EFFFF]"
            } p-2 rounded-md shadow-md text-white font-semibold`}
          >
            Add Task
          </button>
        </div>
      </div>

      <div
        className={`${
          state.theme === "dark" ? "bg-[#000000FF]" : "bg-[#FBFDFC]"
        } p-4 rounded-md shadow-md mb-6`}
      >
        <h2 className="text-xl font-semibold mb-4">Ongoing</h2>
        <ul className="flex flex-col gap-3">
          {tasks.length > 0 ? (
            tasks.map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between p-2 border rounded-md"
              >
                <div className="flex items-center gap-2">
                  {todo.source === "local" ? (
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleComplete(todo.id, todo.source)}
                      className="cursor-pointer"
                    />
                  ) : (
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      disabled
                      className="cursor-not-allowed"
                    />
                  )}
                  <span>{todo.task || todo.title}</span>
                </div>
                <div className="flex-1 px-4">
                  <p className="text-sm text-gray-500">{todo.description}</p>
                </div>
                {todo.source === "local" && (
                  <button
                    onClick={() => toggleImportant(todo.id)}
                    className={`text-lg ${
                      todo.important ? "text-[#F00D0DFF]" : "text-gray-300"
                    }`}
                  >
                    {!todo.important ? (
                      <FaRegStar className="text-2xl" />
                    ) : (
                      <FaStar className="text-2xl" />
                    )}
                  </button>
                )}
              </li>
            ))
          ) : (
            <p>No ongoing tasks assigned.</p>
          )}
        </ul>
      </div>

      <div
        className={`${
          state.theme === "dark" ? "bg-[#000000FF]" : "bg-[#FBFDFC]"
        } p-4 rounded-md shadow-md mb-6`}
      >
        <h2 className="text-xl font-semibold mb-4">Completed</h2>
        <ul className="flex flex-col gap-3">
          {state.todos
            ?.filter((todo) => todo.completed)
            .map((todo) => (
              <li
                key={todo.id}
                className="flex items-center justify-between p-2 border rounded-md"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleComplete(todo.id, todo.source)}
                    className="cursor-pointer"
                  />
                  <span className="line-through">{todo.task}</span>
                </div>
                <button
                  onClick={() => removeCompletedTask(todo.id)}
                  className="text-red-600"
                >
                  Remove
                </button>
              </li>
            ))}
        </ul>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Todos;
