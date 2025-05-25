// src/api/store/creator-portal/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { PhylloClientService } from "../../../services/phyllo-client"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const phylloClient = req.scope.resolve<PhylloClientService>("phylloClientService")
  const { user_id } = req.body

  try {
    const sdkToken = await phylloClient.createSDKToken(user_id)
    res.json({ sdk_token: sdkToken })
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to create SDK token",
      error: error.message 
    })
  }
}