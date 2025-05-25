// src/api/admin/creators/[id]/sync/route.ts
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const creatorService = req.scope.resolve<CreatorService>("creatorService")
  const { id } = req.params

  try {
    const creator = await creatorService.syncCreatorPlatforms(id)
    res.json({ 
      message: "Creator platforms synced successfully",
      creator 
    })
  } catch (error) {
    res.status(500).json({ 
      message: "Failed to sync creator platforms",
      error: error.message 
    })
  }
}