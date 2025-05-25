export interface PhylloPluginOptions {
  phylloClientId: string
  phylloClientSecret: string
  phylloEnvironment?: "sandbox" | "production"
  phylloBaseUrl?: string
  enabledPlatforms?: string[]
  webhookSecret?: string
}

// Export models
export { Creator } from "./models/creator"
export { CreatorPlatform } from "./models/creator-platform"

const PhylloCreatorPlugin = {
  name: "medusa-plugin-phyllo-creator",
  description: "Phyllo Creator Portal Plugin for managing influencers and content creators"
}

export default PhylloCreatorPlugin
