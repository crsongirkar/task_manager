/* eslint-disable no-unused-vars */
import Navbar from "../Components/Navbar.jsx";
import { useContext } from "react";
import Sidebar from "../Components/Sidebar.jsx";
import { GlobalContext } from "../Context/GlobalState.jsx";
import Todos from "../Components/Todos.jsx";

const Home = () => {
    const { state, dispatch } = useContext(GlobalContext);

    const handleToggleSidebar = () => {
        dispatch({ type: "TOGGLE_SIDEBAR" });
    };

    return (
        <div
            className={`${
                state.theme === "dark"
                    ? "bg-[#3C3A3AFF] text-white"
                    : "bg-[#FBFDFC] text-black"
            } w-full overflow-y-visible pointer-events-auto`}
        >
            <Navbar />
            <div className="w-full flex flex-row">
                {state.isSidebarVisible && <Sidebar className="px-10" />}
                <Todos />
            </div>
        </div>
    );
};

export default Home;
