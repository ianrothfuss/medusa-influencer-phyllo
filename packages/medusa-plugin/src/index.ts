import { MedusaPlugin, PluginOptions } from "@medusajs/types"

export interface PhylloPluginOptions extends PluginOptions {
  phylloClientId: string
  phylloClientSecret: string
  phylloEnvironment?: "sandbox" | "production"
  phylloBaseUrl?: string
  enabledPlatforms?: string[]
  webhookSecret?: string
}

const PhylloCreatorPlugin: MedusaPlugin = {
  name: "medusa-plugin-phyllo-creator",
  description: "Phyllo Creator Portal Plugin for managing influencers and content creators",
  configuration: {
    phylloClientId: {
      type: "string",
      required: true,
      description: "Phyllo API Client ID"
    },
    phylloClientSecret: {
      type: "string",
      required: true,
      description: "Phyllo API Client Secret"
    },
    phylloEnvironment: {
      type: "string",
      default: "sandbox",
      description: "Phyllo environment (sandbox or production)"
    },
    phylloBaseUrl: {
      type: "string",
      default: "https://api.getphyllo.com",
      description: "Phyllo API base URL"
    },
    enabledPlatforms: {
      type: "array",
      default: ["youtube", "instagram", "tiktok", "twitch"],
      description: "Enabled creator platforms"
    },
    webhookSecret: {
      type: "string",
      description: "Webhook secret for Phyllo events"
    }
  }
}

export default PhylloCreatorPlugin
