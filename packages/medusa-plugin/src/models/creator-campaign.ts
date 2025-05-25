/ src/models/creator-campaign.ts
import { BaseEntity, BeforeInsert, Column, Entity, JoinColumn, ManyToOne } from "typeorm"
import { Creator } from "./creator"

@Entity()
export class CreatorCampaign extends BaseEntity {
  @Column({ type: "varchar" })
  id: string

  @Column({ type: "varchar" })
  creator_id: string

  @ManyToOne(() => Creator, (creator) => creator.campaigns)
  @JoinColumn({ name: "creator_id" })
  creator: Creator

  @Column({ type: "varchar" })
  campaign_name: string

  @Column({ type: "text", nullable: true })
  description?: string

  @Column({ type: "varchar" })
  brand_name: string

  @Column({ type: "enum", enum: ["draft", "pending", "active", "completed", "cancelled"] })
  status: string

  @Column({ type: "decimal", precision: 10, scale: 2 })
  budget: number

  @Column({ type: "varchar" })
  currency: string

  @Column({ type: "json" })
  deliverables: Array<{
    platform: string
    content_type: string
    quantity: number
    specifications?: string
  }>

  @Column({ type: "json", nullable: true })
  performance_metrics?: {
    impressions?: number
    reach?: number
    engagement?: number
    clicks?: number
    conversions?: number
    roi?: number
  }

  @Column({ type: "timestamp" })
  start_date: Date

  @Column({ type: "timestamp" })
  end_date: Date

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at: Date

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at: Date

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = `campaign_${Date.now()}`
  }
}
