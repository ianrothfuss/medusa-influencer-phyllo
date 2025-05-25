export async function POST(req: any, res: any) {
  try {
    const body = req.body || {}
    const { user_id } = body

    res.json({ 
      message: "Creator portal SDK token endpoint",
      user_id,
      sdk_token: "mock_token_for_testing" 
    })
  } catch (error: any) {
    res.status(500).json({ 
      message: "Failed to create SDK token",
      error: error?.message || "Unknown error"
    })
  }
}
