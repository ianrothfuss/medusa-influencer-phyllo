// src/api/admin/creators/[id]/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { CreatorService } from "../../../../services/creator"

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const creatorService = req.scope.resolve<CreatorService>("creatorService")
  const { id } = req.params

  try {
    const creator = await creatorService.getCreator(id)
    res.json({ creator })
  } catch (error) {
    res.status(404).json({ 
      message: "Creator not found",
      error: error.message 
    })
  }
}

export async function PUT(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const creatorService = req.scope.resolve<CreatorService>("creatorService")
  const { id } = req.params
  const { verification_status } = req.body

  try {
    const creator = await creatorService.updateCreatorVerificationStatus(id, verification_status)
    res.json({ creator })
  } catch (error) {
    res.status(400).json({ 
      message: "Failed to update creator",
      error: error.message 
    })
  }
}
