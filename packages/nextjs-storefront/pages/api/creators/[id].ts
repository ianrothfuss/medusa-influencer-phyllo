// pages/api/creators/[id].ts
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ message: 'Creator ID is required' })
  }

  try {
    const medusaResponse = await fetch(`${process.env.MEDUSA_BACKEND_URL}/admin/creators/${id}`, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        // Add admin authentication headers
        'Authorization': `Bearer ${process.env.MEDUSA_ADMIN_TOKEN}`
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    })

    if (!medusaResponse.ok) {
      throw new Error('Failed to fetch creator data')
    }

    const data = await medusaResponse.json()
    res.json(data)
  } catch (error) {
    console.error('Error fetching creator:', error)
    res.status(500).json({ 
      message: 'Failed to fetch creator data',
      error: error.message 
    })
  }
}