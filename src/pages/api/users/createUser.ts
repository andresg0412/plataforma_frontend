import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // Simula proceso exitoso
    setTimeout(() => {
      res.status(201).json({ success: true, message: 'Usuario creado exitosamente' });
    }, 800);
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
