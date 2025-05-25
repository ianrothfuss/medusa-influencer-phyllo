// lib/phyllo-sdk.ts
interface PhylloConfig {
  clientDisplayName: string
  environment: "sandbox" | "production"
  userId: string
  token: string
  redirectURL?: string
}

interface PhylloConnect {
  open(): void
  close(): void
  on(event: string, callback: (data: any) => void): void
}

declare global {
  interface Window {
    PhylloConnect: {
      initialize(config: PhylloConfig): PhylloConnect
    }
  }
}

export class PhylloSDK {
  private phylloConnect: PhylloConnect | null = null
  private config: PhylloConfig

  constructor(config: PhylloConfig) {
    this.config = config
  }

  async initialize(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Load Phyllo SDK script
      if (!document.getElementById('phyllo-sdk')) {
        const script = document.createElement('script')
        script.id = 'phyllo-sdk'
        script.src = 'https://cdn.getphyllo.com/connect/v2/phyllo-connect.js'
        script.onload = () => {
          this.phylloConnect = window.PhylloConnect.initialize(this.config)
          this.setupEventListeners()
          resolve()
        }
        script.onerror = () => reject(new Error('Failed to load Phyllo SDK'))
        document.head.appendChild(script)
      } else {
        this.phylloConnect = window.PhylloConnect.initialize(this.config)
        this.setupEventListeners()
        resolve()
      }
    })
  }

  private setupEventListeners(): void {
    if (!this.phylloConnect) return

    this.phylloConnect.on('accountConnected', (data) => {
      console.log('Account connected:', data)
      // Handle successful account connection
      this.onAccountConnected?.(data)
    })

    this.phylloConnect.on('accountDisconnected', (data) => {
      console.log('Account disconnected:', data)
      this.onAccountDisconnected?.(data)
    })

    this.phylloConnect.on('tokenExpired', (data) => {
      console.log('Token expired:', data)
      this.onTokenExpired?.(data)
    })

    this.phylloConnect.on('exit', (data) => {
      console.log('SDK closed:', data)
      this.onExit?.(data)
    })
  }

  open(): void {
    if (!this.phylloConnect) {
      throw new Error('Phyllo SDK not initialized')
    }
    this.phylloConnect.open()
  }

  close(): void {
    if (!this.phylloConnect) {
      throw new Error('Phyllo SDK not initialized')
    }
    this.phylloConnect.close()
  }

  // Event handlers (can be overridden)
  onAccountConnected?: (data: any) => void
  onAccountDisconnected?: (data: any) => void
  onTokenExpired?: (data: any) => void
  onExit?: (data: any) => void
}
