import { Request, Response } from 'express';
import { prisma } from '../index';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const getPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des articles' });
  }
};

export const getPost = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            name: true
          }
        }
      }
    });

    if (!post) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération de l\'article' });
  }
};

export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const { title, excerpt, content, image, published } = req.body;
    const authorId = req.user?.id;

    if (!authorId) {
      return res.status(401).json({ message: 'Non authentifié' });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        image,
        published,
        authorId
      }
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'article' });
  }
};

export const updatePost = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, excerpt, content, image, published } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Non authentifié' });
    }

    const post = await prisma.post.findUnique({
      where: { id },
      select: { authorId: true }
    });

    if (!post) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    if (post.authorId !== userId && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt,
        content,
        image,
        published
      }
    });

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'article' });
  }
};

export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Non authentifié' });
    }

    const post = await prisma.post.findUnique({
      where: { id },
      select: { authorId: true }
    });

    if (!post) {
      return res.status(404).json({ message: 'Article non trouvé' });
    }

    if (post.authorId !== userId && req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    await prisma.post.delete({
      where: { id }
    });

    res.json({ message: 'Article supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'article' });
  }
};