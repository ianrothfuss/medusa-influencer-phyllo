// pages/api/creator-portal.ts
import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { user_id } = req.body

  if (!user_id) {
    return res.status(400).json({ message: 'User ID is required' })
  }

  try {
    // Forward request to Medusa backend
    const medusaResponse = await fetch(`${process.env.MEDUSA_BACKEND_URL}/store/creator-portal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Add any authentication headers if needed
      },
      body: JSON.stringify({ user_id })
    })

    if (!medusaResponse.ok) {
      throw new Error('Failed to create SDK token')
    }

    const data = await medusaResponse.json()
    res.json(data)
  } catch (error) {
    console.error('Error creating SDK token:', error)
    res.status(500).json({ 
      message: 'Failed to create SDK token',
      error: error.message 
    })
  }
}