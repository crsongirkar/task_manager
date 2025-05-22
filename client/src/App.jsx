// import {Routes, Route,Navigate } from "react-router-dom";

// import { UserProvider } from "./Components/UserContext.jsx"; // for login/dashboard
// import { GlobalProvider } from "./Context/GlobalState";  

// import Home from "./Pages/Home.jsx";
// import Login from "../src/Components/Login.jsx";
// import UserLogin from "../src/Components/UserLogin.jsx";
// import Dashboard from "../src/Components/Dashboard.jsx";
// import { UserProvider } from "../src/Components/UserContext.jsx"; // Import the UserProvider




// function App() {
//   return (
//     <UserProvider>
//       <Routes>
//           <Route path="/" element={<Navigate to="/adminlogin" replace />} />
//           <Route path="/adminlogin" element={<Login />} />
//           <Route path="/Userlogin" element={<UserLogin />} />
//           <Route path="/dashboard" element={<Dashboard />} />
//           <Route path="/logout" element={<Dashboard />} />
//       </Routes>
//       {/* <route>
//         <GlobalProvider>
//            <Route path="/Home" element={<home/>} />
//         </GlobalProvider>
//       </route> */}
//     </UserProvider>
//   );
// }

// export default App;

import { Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./Components/UserContext.jsx"; 
import { GlobalProvider } from "./Context/GlobalState";       

import Home from "./Pages/Home.jsx";
import Login from "./Components/Login.jsx";
import UserLogin from "../src/Components/UserLogin.jsx";
import Dashboard from "./Components/Dashboard.jsx";
import Alltask from "./Components/Alltask.jsx";
import ViewTasks from "./Components/ViewTasks.jsx";
import AddTask from "./Components/AddTask.jsx";

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Navigate to="/adminlogin" replace />} />
        <Route path="/adminlogin" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/Userlogin" element={<UserLogin />} />
          <Route path="/logout" element={<Dashboard />} />
          <Route path="/dashboard/view_tasks" element={<ViewTasks />} />
          <Route path="/dashboard/add_tasks" element={<AddTask />} />
          <Route path="/alltasks" element={<Alltask />} />
        
        <Route
          path="/home"
          element={
            <GlobalProvider>
              <Home />
            </GlobalProvider>
          }
        />
      </Routes>
    </UserProvider>
  );
}

export default App;
