import { BaseEntity, BeforeInsert, Column, Entity, Index } from "typeorm"

@Entity()
export class Creator extends BaseEntity {
  @Column({ type: "varchar" })
  id!: string

  @Index()
  @Column({ type: "varchar", unique: true })
  phyllo_user_id!: string

  @Column({ type: "varchar" })
  email!: string

  @Column({ type: "varchar" })
  name!: string

  @Column({ type: "varchar", nullable: true })
  profile_picture_url?: string

  @Column({ type: "text", nullable: true })
  bio?: string

  @Column({ type: "varchar" })
  verification_status!: string

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  created_at!: Date

  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
  updated_at!: Date

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = `creator_${Date.now()}`
  }
}
