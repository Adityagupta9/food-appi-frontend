import { useState } from 'react'
import {BrowserRouter as Router,Route,Routes} from "react-router-dom";
import './App.css'
import Login from './components/Login'
import Dashboard from './components/Dashborad';
import CreateOrder from "./components/CreateOrder";
import CreateStaff from './components/CreateStaff';
import ManageStaff from './components/ManageStaff';
import CreateUser from './components/CreateUser';
import ManageAdmin from './components/ManageAdmin';
import StaffDashboard from './components/StaffDashboard';
import StaffProfile from './components/StaffProfile';
import Notes from './components/Notes';
import StaffNotes from './components/StaffNotes';
import Footer from './components/Footer';
console.log(
  "%c 🍔 Welcome to FoodAppi! 🚀\n%cDeveloped by Aditya Gupta\n📧 adityagupta9137@gmail.com",
  "color: white; background: rgb(0, 127, 190); padding: 8px 15px; border-radius: 5px; font-size: 16px;",
  "color:rgb(0, 127, 190); font-size: 14px; font-weight: bold;"
);

const App = ()=> {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin/manage-staff" element={<ManageStaff />} />
          <Route path="/admin/staff-management" element={<CreateStaff />} />
          <Route path="/create-order" element={<CreateOrder />} />
          <Route path="/admin/create-user" element={<CreateUser />} />
          <Route path="/admin/manage-admin" element={<ManageAdmin />} />
          <Route path="/staff/orders" element={<StaffDashboard />} />
          <Route path="/staff/profile" element={<StaffProfile />} />
          <Route path='/admin/notes'  element={<Notes/>}/>
          <Route path='/staff/staffNotes' element={<StaffNotes/>}/>
        </Routes>
          
      </div>
    </Router>
  );
};
export default App;

