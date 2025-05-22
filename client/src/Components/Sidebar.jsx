import { IoAddOutline } from "react-icons/io5";
import { MdOutlineCalendarToday } from "react-icons/md";
import { FaRegStar } from "react-icons/fa";
import { CiViewList } from "react-icons/ci";
import { FaMap } from "react-icons/fa";
import { MdOutlineAssignmentInd } from "react-icons/md";
import { useState, useEffect, useContext } from "react";
import { GlobalContext } from "../Context/GlobalState";
import { toast,ToastContainer} from 'react-toastify';  // Import toast from react-toastify

const Sidebar = () => {
  const { state} = useContext(GlobalContext);
  const [showPopup, setShowPopup] = useState(false);
  const [listName, setListName] = useState("");
  const [lists, setLists] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All Tasks");

  useEffect(() => {
    const storedLists = JSON.parse(localStorage.getItem("taskLists")) || [];
    setLists(storedLists);
  }, []);

  useEffect(() => {
    localStorage.setItem("taskLists", JSON.stringify(lists));
  }, [lists]);

  const handleOpenPopup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleAddList = () => {
    if (listName.trim()) { 
      if (!lists.includes(listName)) { 
        setLists((prevLists) => [...prevLists, listName]);
        setShowPopup(false);
        setListName(""); 
        toast.success("List added successfully!"); 
      } else {
        toast.error("List name already exists!"); 
      }
    } else {
      toast.error("Please enter a valid list name!"); 
    }
  };

  const handleRemoveList = (index) => {
    const updatedLists = lists.filter((_, i) => i !== index);
    setLists(updatedLists);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };
 

  return (
    
    <div
      className={`h-screen w-full mt-10 md:w-[20%] flex flex-col ${
        state.theme === "dark" ? "bg-[#000000FF]" : "bg-[#F7F7F7FF]"
      } hover:text-[#000000FF] px-2 md:px-4 py-3 md:py-6`}
      
    >
         
      <div className={`${state.theme === "dark" ? "text-white" : "text-black"}`}>
      <br/>
        <ul className="text-left text-sm md:text-base">
          {/* Category items */}
          <li
            onClick={() => handleCategoryClick("All Tasks")}
            className={`flex items-center gap-2 p-1 md:p-2 rounded-md hover:bg-[#35793729] cursor-pointer ${
              selectedCategory === "All Tasks" ? "bg-[#35793729]" : ""
            }`}
          >
            <span>
              <CiViewList />
            </span>{" "}
            All Tasks
          </li>
          <li
            onClick={() => handleCategoryClick("Today")}
            className={`flex items-center gap-2 p-1 md:p-2 rounded-md hover:bg-[#35793729] cursor-pointer ${
              selectedCategory === "Today" ? "bg-[#35793729]" : ""
            }`}
          >
            <span>
              <MdOutlineCalendarToday />
            </span>{" "}
            Today
          </li>
          <li
            onClick={() => handleCategoryClick("Important")}
            className={`flex items-center gap-2 p-1 md:p-2 rounded-md hover:bg-[#35793729] cursor-pointer ${
              selectedCategory === "Important" ? "bg-[#35793729]" : ""
            }`}
          >
            <span>
              <FaRegStar />
            </span>{" "}
            Important
          </li>
          <li
            onClick={() => handleCategoryClick("Planned")}
            className={`flex items-center gap-2 p-1 md:p-2 rounded-md hover:bg-[#35793729] cursor-pointer ${
              selectedCategory === "Planned" ? "bg-[#35793729]" : ""
            }`}
          >
            <span>
              <FaMap />
            </span>{" "}
            Planned
          </li>
          <li
            onClick={() => handleCategoryClick("Assigned to me")}
            className={`flex items-center gap-2 p-1 md:p-2 rounded-md hover:bg-[#35793729] cursor-pointer ${
              selectedCategory === "Assigned to me" ? "bg-[#35793729]" : ""
            }`}
          >
            <span>
              <MdOutlineAssignmentInd />
            </span>{" "}
            Assigned to me
          </li>

         
          {lists.map((list, index) => (
            <li
              key={index}
              className="flex items-center gap-2 p-1 md:p-2 rounded-md hover:bg-[#35793729] hover:text-[#357937] cursor-pointer"
            >
              <CiViewList /> {list}
              <button
                onClick={() => handleRemoveList(index)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div
        className={`flex rounded-md justify-center items-center gap-4 md:gap-6 mt-4 h-16 md:h-20 cursor-pointer hover:text-[#357937] ${
          state.theme === "dark" ? "bg-[#000000FF] text-white" : "bg-[#FBFDFC] text-black"
        }`}
        onClick={handleOpenPopup} // Ensure this triggers the popup correctly
      >
        <IoAddOutline className="text-lg md:text-xl" />
        <p className="text-sm md:text-base font-semibold">Add List</p>
      </div>

      {/* Popup Modal */}
      {showPopup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 md:w-96">
            <h3 className="text-xl font-semibold mb-4">Add New List</h3>
            <input
              type="text"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4"
              placeholder="Enter list name"

            />
            <div className="flex justify-between">
              <button
                onClick={handleAddList}
                className="bg-[#357937] text-white px-4 py-2 rounded-md"
              >
                Add
              </button>
              <button
                onClick={handleClosePopup}
                className="bg-[#FF5555] text-white px-4 py-2 rounded-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4">
        <h2
          className={`text-sm md:text-base font-semibold mb-2 md:mb-4 ${
            state.theme === "dark" ? "text-white" : "text-black"
          }`}
        >
          Task
        </h2>
      </div>
      <div>
      </div>
      <ToastContainer/>
    </div>
  );
};

export default Sidebar;
