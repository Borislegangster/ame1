```typescript
import { Request, Response } from 'express';
import { prisma } from '../index';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        lastLoginAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
  }
};

export const updateUserStatus = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    // Empêcher la désactivation de son propre compte
    if (id === req.user?.id) {
      return res.status(400).json({ 
        message: 'Vous ne pouvez pas désactiver votre propre compte' 
      });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { isActive }
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du statut' });
  }
};

export const updateUserRole = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Empêcher la modification de son propre rôle
    if (id === req.user?.id) {
      return res.status(400).json({ 
        message: 'Vous ne pouvez pas modifier votre propre rôle' 
      });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role }
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du rôle' });
  }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    // Empêcher la suppression de son propre compte
    if (id === req.user?.id) {
      return res.status(400).json({ 
        message: 'Vous ne pouvez pas supprimer votre propre compte' 
      });
    }

    // Sauvegarder les informations de l'utilisateur banni
    const user = await prisma.user.findUnique({
      where: { id },
      select: { email: true, phone: true }
    });

    if (user) {
      await prisma.bannedUser.create({
        data: {
          email: user.email,
          phone: user.phone || '',
          bannedAt: new Date(),
          reason: 'Supprimé par un administrateur'
        }
      });
    }

    await prisma.user.delete({
      where: { id }
    });

    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression' });
  }
};
```