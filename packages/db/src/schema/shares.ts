/*
 * @Author: zhangdodo heima@88.com
 * @Date: 2026-09-12 01:13:45
 * @LastEditTime: 2026-09-12 01:14:57
 * @FilePath: \life-os-shadcn\packages\db\src\schema\shares.ts
 */
import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  uuid,
  index,
  pgEnum,
} from 'drizzle-orm/pg-core'
import { user } from './auth'

export const shareTypeEnum = pgEnum('share_type', [
  'daily_card',
  'weekly_summary',
  'project_journey',
])

// 分享快照记录 (Shared Records)
export const sharedRecords = pgTable(
  'shared_records',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    // 公开短链接凭证 (如: x8s9da2q)
    shareSlug: text('share_slug').notNull().unique(),
    shareType: shareTypeEnum('share_type').notNull(),
    // 静态快照 JSON（解耦原始记录，防止原任务修改导致旧海报图失效）
    snapshotData: jsonb('snapshot_data').notNull(),
    // 隐私开关：是否遮罩具体客户/敏感任务名
    hideSensitiveNames: boolean('hide_sensitive_names')
      .notNull()
      .default(false),
    viewCount: integer('view_count').notNull().default(0),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('shared_records_slug_idx').on(table.shareSlug),
    index('shared_records_user_id_idx').on(table.userId),
  ]
)
