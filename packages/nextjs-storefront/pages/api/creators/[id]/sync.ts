// pages/api/creators/[id]/sync.ts
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Creator ID is required' })
  }

  try {
    const medusaResponse = await fetch(`${process.env.MEDUSA_BACKEND_URL}/admin/creators/${id}/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MEDUSA_ADMIN_TOKEN}`
      }
    })

    if (!medusaResponse.ok) {
      throw new Error('Failed to sync creator data')
    }

    const data = await medusaResponse.json()
    res.json(data)
  } catch (error) {
    console.error('Error syncing creator data:', error)
    res.status(500).json({ 
      message: 'Failed to sync creator data',
      error: error.message 
    })
  }
}
