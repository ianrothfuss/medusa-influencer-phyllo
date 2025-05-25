// src/api/admin/creators/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { CreatorService } from "../../../services/creator"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const creatorService = req.scope.resolve<CreatorService>("creatorService")
  
  const { 
    platform,
    min_followers,
    max_followers,
    engagement_rate,
    location,
    verification_status,
    limit = 20,
    offset = 0
  } = req.query

  try {
    const creators = await creatorService.searchCreators({
      platform: platform as string,
      min_followers: min_followers ? parseInt(min_followers as string) : undefined,
      max_followers: max_followers ? parseInt(max_followers as string) : undefined,
      engagement_rate: engagement_rate ? parseFloat(engagement_rate as string) : undefined,
      location: location as string,
      verification_status: verification_status as string
    })

    const paginatedCreators = creators.slice(
      parseInt(offset as string), 
      parseInt(offset as string) + parseInt(limit as string)
    )

    res.json({
      creators: paginatedCreators,
      count: creators.length,
      offset: parseInt(offset as string),
      limit: parseInt(limit as string)
    })
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to fetch creators",
      error: error.message 
    })
  }
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const creatorService = req.scope.resolve<CreatorService>("creatorService")
  
  const { name, email, bio, contact_info, preferences } = req.body

  try {
    const creator = await creatorService.createCreator({
      name,
      email,
      bio,
      contact_info,
      preferences
    })

    res.status(201).json({ creator })
  } catch (error) {
    res.status(400).json({ 
      message: "Failed to create creator",
      error: error.message 
    })
  }
}