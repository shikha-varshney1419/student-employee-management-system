import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';

import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Profile from './pages/Profile.jsx';
import SearchFilter from './pages/SearchFilter.jsx';

import StudentList from './pages/students/StudentList.jsx';
import StudentForm from './pages/students/StudentForm.jsx';
import StudentDetails from './pages/students/StudentDetails.jsx';

import EmployeeList from './pages/employees/EmployeeList.jsx';
import EmployeeForm from './pages/employees/EmployeeForm.jsx';
import EmployeeDetails from './pages/employees/EmployeeDetails.jsx';

import NotFound from './pages/NotFound.jsx';

function withLayout(Page) {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <Page />
      </AdminLayout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/dashboard" element={withLayout(Dashboard)} />
      <Route path="/profile" element={withLayout(Profile)} />
      <Route path="/search" element={withLayout(SearchFilter)} />

      <Route path="/students" element={withLayout(StudentList)} />
      <Route path="/students/new" element={withLayout(StudentForm)} />
      <Route path="/students/:id/edit" element={withLayout(StudentForm)} />
      <Route path="/students/:id" element={withLayout(StudentDetails)} />

      <Route path="/employees" element={withLayout(EmployeeList)} />
      <Route path="/employees/new" element={withLayout(EmployeeForm)} />
      <Route path="/employees/:id/edit" element={withLayout(EmployeeForm)} />
      <Route path="/employees/:id" element={withLayout(EmployeeDetails)} />

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
