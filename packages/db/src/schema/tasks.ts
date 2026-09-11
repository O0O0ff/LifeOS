/*
 * @Author: zhangdodo heima@88.com
 * @Date: 2026-09-12 01:13:45
 * @LastEditTime: 2026-09-12 01:15:39
 * @FilePath: \life-os-shadcn\packages\db\src\schema\tasks.ts
 */
import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  uuid,
  index,
  pgEnum,
} from 'drizzle-orm/pg-core'
import { user } from './auth'

export const taskStatusEnum = pgEnum('task_status', [
  'todo',
  'in_progress',
  'done',
  'cancelled',
])

export const ownerTypeEnum = pgEnum('owner_type', ['TASK', 'TIME_ENTRY'])

// 1. 项目/分类 (Projects)
export const projects = pgTable(
  'projects',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    color: text('color').notNull().default('#3b82f6'),
    isArchived: boolean('is_archived').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index('projects_user_id_idx').on(table.userId)]
)

// 2. 待办任务 (Tasks)
export const tasks = pgTable(
  'tasks',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    projectId: uuid('project_id').references(() => projects.id, {
      onDelete: 'set null',
    }),
    title: text('title').notNull(),
    status: taskStatusEnum('status').notNull().default('todo'),
    estimatedMinutes: integer('estimated_minutes').default(0),
    dueDate: timestamp('due_date', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('tasks_user_id_idx').on(table.userId),
    index('tasks_project_id_idx').on(table.projectId),
  ]
)

// 3. 标签定义 (Tags)
export const tags = pgTable(
  'tags',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    color: text('color').notNull().default('#64748b'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index('tags_user_id_idx').on(table.userId)]
)

// 4. 多态标签分配 (Tag Assignments)
export const tagAssignments = pgTable(
  'tag_assignments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    tagId: uuid('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
    ownerType: ownerTypeEnum('owner_type').notNull(), // 'TASK' 或 'TIME_ENTRY'
    ownerId: uuid('owner_id').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index('tag_assignments_owner_idx').on(table.ownerType, table.ownerId),
    index('tag_assignments_tag_id_idx').on(table.tagId),
  ]
)
