/*
 * @Author: zhangdodo heima@88.com
 * @Date: 2026-09-12 01:13:45
 * @LastEditTime: 2026-09-12 15:31:12
 * @FilePath: \life-os\packages\db\src\schema\time-tracking.ts
 */
import {
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core'
import { user } from './auth.js'
import { tasks } from './tasks.js'

export const entryTypeEnum = pgEnum('entry_type', [
  'pomodoro',
  'stopwatch',
  'manual',
])

// 1. 日历规划块 (Calendar Events - 计划/Intent)
export const calendarEvents = pgTable(
  'calendar_events',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    linkedTaskId: uuid('linked_task_id').references(() => tasks.id, {
      onDelete: 'set null',
    }),
    title: text('title').notNull(),
    plannedStart: timestamp('planned_start', { withTimezone: true }).notNull(),
    plannedEnd: timestamp('planned_end', { withTimezone: true }).notNull(),
    externalEventId: text('external_event_id'), // Google / Apple Calendar 同步标识
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('calendar_events_user_range_idx').on(
      table.userId,
      table.plannedStart,
      table.plannedEnd
    ),
  ]
)

// 2. 实际用时记录 (Time Entries - 现实/Reality)
export const timeEntries = pgTable(
  'time_entries',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    taskId: uuid('task_id').references(() => tasks.id, {
      onDelete: 'set null',
    }),
    // 关联计划事件，实现“计划 vs 实际偏差视图”
    eventId: uuid('event_id').references(() => calendarEvents.id, {
      onDelete: 'set null',
    }),
    startTime: timestamp('start_time', { withTimezone: true }).notNull(),
    // NULL 代表正在进行中的计时器（避免高频写库，结合 PartyKit/Redis 实时跳秒）
    endTime: timestamp('end_time', { withTimezone: true }),
    durationSeconds: integer('duration_seconds').default(0),
    entryType: entryTypeEnum('entry_type').notNull().default('stopwatch'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('time_entries_user_start_idx').on(table.userId, table.startTime),
    index('time_entries_task_id_idx').on(table.taskId),
    index('time_entries_event_id_idx').on(table.eventId),
  ]
)
