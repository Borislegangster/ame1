```tsx
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { AdminLayout } from '../../components/admin/AdminLayout';

export function Dashboard() {
  const { user } = useAuth();

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Tableau de bord</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Bienvenue, {user?.name}</h2>
          <p className="text-gray-600">
            Gérez votre contenu et vos utilisateurs depuis cette interface d'administration.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}
```