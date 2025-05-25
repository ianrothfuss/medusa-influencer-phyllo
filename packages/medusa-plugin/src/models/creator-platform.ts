import { BaseEntity, BeforeInsert, Column, Entity, JoinColumn, ManyToOne } from "typeorm"
import { Creator } from "./creator"

@Entity()
export class CreatorPlatform extends BaseEntity {
  @Column({ type: "varchar" })
  id!: string

  @Column({ type: "varchar" })
  creator_id!: string

  @ManyToOne(() => Creator)
  @JoinColumn({ name: "creator_id" })
  creator!: Creator

  @Column({ type: "varchar" })
  platform_name!: string

  @Column({ type: "varchar" })
  phyllo_account_id!: string

  @Column({ type: "varchar" })
  platform_username!: string

  @Column({ type: "json", nullable: true })
  metrics?: any

  @Column({ type: "boolean", default: true })
  is_active!: boolean

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = `cp_${Date.now()}`
  }
}
