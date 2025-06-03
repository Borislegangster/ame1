```typescript
// Ajouter la route pour la gestion des utilisateurs
<Route
  path="/admin/users"
  element={
    <ProtectedRoute allowedRoles={['admin']}>
      <UserList />
    </ProtectedRoute>
  }
/>
```