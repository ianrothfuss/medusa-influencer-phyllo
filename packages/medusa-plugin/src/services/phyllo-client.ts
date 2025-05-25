// src/services/phyllo-client.ts
import { TransactionBaseService } from "@medusajs/framework"
import axios, { AxiosInstance } from "axios"
import { PhylloPluginOptions } from "../index"

export class PhylloClientService extends TransactionBaseService {
  private client: AxiosInstance
  private accessToken?: string
  private tokenExpiry?: Date

  constructor(options: PhylloPluginOptions) {
    super()
    
    this.client = axios.create({
      baseURL: options.phylloBaseUrl || "https://api.getphyllo.com",
      headers: {
        "Content-Type": "application/json"
      }
    })

    this.setupInterceptors()
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(async (config) => {
      await this.ensureValidToken()
      if (this.accessToken) {
        config.headers.Authorization = `Bearer ${this.accessToken}`
      }
      return config
    })
  }

  private async ensureValidToken() {
    if (!this.accessToken || (this.tokenExpiry && new Date() >= this.tokenExpiry)) {
      await this.refreshToken()
    }
  }

  private async refreshToken() {
    try {
      const response = await axios.post(`${this.client.defaults.baseURL}/v1/token`, {
        client_id: process.env.PHYLLO_CLIENT_ID,
        client_secret: process.env.PHYLLO_CLIENT_SECRET,
        grant_type: "client_credentials"
      })

      this.accessToken = response.data.access_token
      this.tokenExpiry = new Date(Date.now() + (response.data.expires_in * 1000))
    } catch (error) {
      throw new Error(`Failed to authenticate with Phyllo: ${error.message}`)
    }
  }

  async createUser(userData: {
    name: string
    email: string
    external_id: string
  }) {
    const response = await this.client.post("/v1/users", userData)
    return response.data
  }

  async getUserProfile(userId: string) {
    const response = await this.client.get(`/v1/users/${userId}`)
    return response.data
  }

  async getConnectedAccounts(userId: string) {
    const response = await this.client.get(`/v1/users/${userId}/accounts`)
    return response.data
  }

  async getIdentityData(accountId: string) {
    const response = await this.client.get(`/v1/accounts/${accountId}/identity`)
    return response.data
  }

  async getEngagementData(accountId: string, options?: {
    from_date?: string
    to_date?: string
    limit?: number
    offset?: number
  }) {
    const params = new URLSearchParams(options as any)
    const response = await this.client.get(`/v1/accounts/${accountId}/engagement?${params}`)
    return response.data
  }

  async getIncomeData(accountId: string, options?: {
    from_date?: string
    to_date?: string
  }) {
    const params = new URLSearchParams(options as any)
    const response = await this.client.get(`/v1/accounts/${accountId}/income?${params}`)
    return response.data
  }

  async getAudienceData(accountId: string) {
    const response = await this.client.get(`/v1/accounts/${accountId}/audience`)
    return response.data
  }

  async disconnectAccount(accountId: string) {
    const response = await this.client.delete(`/v1/accounts/${accountId}`)
    return response.data
  }

  async createSDKToken(userId: string) {
    const response = await this.client.post("/v1/sdk/token", {
      user_id: userId
    })
    return response.data
  }
}
