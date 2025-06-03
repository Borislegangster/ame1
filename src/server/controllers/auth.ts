import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';
import { sendVerificationEmail, sendPasswordResetEmail } from '../utils/email';
import { generateToken } from '../utils/token';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name, phone } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const emailVerifyToken = generateToken();

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        emailVerifyToken
      }
    });

    await sendVerificationEmail(email, emailVerifyToken);

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 jours
    });

    res.status(201).json({
      message: 'Inscription réussie',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'inscription' });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password, rememberMe } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    if (!user.isActive) {
      return res.status(403).json({ message: 'Ce compte a été désactivé' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: rememberMe ? '30d' : '24h' }
    );

    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt: new Date(Date.now() + (rememberMe ? 30 : 1) * 24 * 60 * 60 * 1000)
      }
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: rememberMe ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000
    });

    res.json({
      message: 'Connexion réussie',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
};

export const logout = async (req: AuthRequest, res: Response) => {
  try {
    const token = req.cookies.token;
    
    if (req.user) {
      await prisma.session.deleteMany({
        where: {
          userId: req.user.id,
          token
        }
      });
    }

    res.clearCookie('token');
    res.json({ message: 'Déconnexion réussie' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la déconnexion' });
  }
};

export const checkAuth = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Non authentifié' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, name: true, role: true }
    });

    if (!user) {
      return res.status(401).json({ message: 'Non authentifié' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la vérification de l\'authentification' });
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    const resetToken = generateToken();

    await prisma.user.update({
      where: { id: user.id },
      data: { resetPasswordToken: resetToken }
    });

    await sendPasswordResetEmail(email, resetToken);

    res.json({ message: 'Email de réinitialisation envoyé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'envoi de l\'email' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;

    const user = await prisma.user.findFirst({
      where: { resetPasswordToken: token }
    });

    if (!user) {
      return res.status(400).json({ message: 'Token invalide' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null
      }
    });

    res.json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la réinitialisation du mot de passe' });
  }
};

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.params;

    const user = await prisma.user.findFirst({
      where: { emailVerifyToken: token }
    });

    if (!user) {
      return res.status(400).json({ message: 'Token invalide' });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isEmailVerified: true,
        emailVerifyToken: null
      }
    });

    res.json({ message: 'Email vérifié avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la vérification de l\'email' });
  }
};