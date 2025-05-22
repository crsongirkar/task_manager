import { MdOutlineMenu } from "react-icons/md";
import { LuMoonStar } from "react-icons/lu";
import { MdOutlineLightMode } from "react-icons/md";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { GlobalContext } from "../Context/GlobalState";
import { UserContext } from "./UserContext"; // Import your user context

const Navbar = () => {
  const { state, dispatch } = useContext(GlobalContext);
  const { user, setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleToggleSidebar = () => {
    dispatch({ type: "TOGGLE_SIDEBAR" });
  };

  const handleToggleTheme = () => {
    dispatch({ type: "TOGGLE_THEME" });
  };

  const handleLogout = () => {
    axios
      .post("http://localhost:3000/auth/logout", {}, { withCredentials: true })
      .then(() => {
        setUser(null); // Clear the user from context
        navigate("/Userlogin"); // Redirect to login
      })
      .catch((err) => {
        console.error("Logout failed:", err);
      });
  };

  return (
    <div
      className={`w-full flex justify-between fixed items-center h-16 px-10 ${
        state.theme === "dark"
          ? "bg-[#000000FF] text-white"
          : "bg-[#FBFDFC] text-black"
      }`}
    >
      <div className="flex gap-2 text-2xl">
        <MdOutlineMenu
          className="hover:cursor-pointer"
          onClick={handleToggleSidebar}
        />
        <br></br>
        <h3 className="text-3xl font-extrabold text-gray-900">Welcome, {user?.username}!</h3>
      </div>

      <div className="flex gap-4 text-xl">

        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-red-500 text-white font-semibold rounded hover:bg-red-600 transition duration-200"
        >
          Logout
        </button>
        {state.theme === "light" ? (
          <LuMoonStar
            className="hover:cursor-pointer"
            onClick={handleToggleTheme}
          />
        ) : (
          <MdOutlineLightMode
            className="hover:cursor-pointer"
            onClick={handleToggleTheme}
          />
        )}
      </div>
    </div>
  );
};

export default Navbar;
