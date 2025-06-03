import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { UserList } from './pages/admin/users/UserList';
import { ProtectedRoute } from './components/admin/ProtectedRoute';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin routes */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UserList />
            </ProtectedRoute>
          }
        />
        
        {/* Add other routes here */}
      </Routes>
    </BrowserRouter>
  );
}