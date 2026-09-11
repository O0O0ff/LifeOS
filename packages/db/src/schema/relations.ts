/*
 * @Author: zhangdodo heima@88.com
 * @Date: 2026-09-12 01:13:45
 * @LastEditTime: 2026-09-12 01:14:46
 * @FilePath: \life-os-shadcn\packages\db\src\schema\relations.ts
 */
import { relations } from 'drizzle-orm'
import { user } from './auth'
import { projects, tasks, tags, tagAssignments } from './tasks'
import { calendarEvents, timeEntries } from './time-tracking'
import { sharedRecords } from './shares'

export const userRelations = relations(user, ({ many }) => ({
  projects: many(projects),
  tasks: many(tasks),
  calendarEvents: many(calendarEvents),
  timeEntries: many(timeEntries),
  tags: many(tags),
  sharedRecords: many(sharedRecords),
}))

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(user, { fields: [projects.userId], references: [user.id] }),
  tasks: many(tasks),
}))

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  user: one(user, { fields: [tasks.userId], references: [user.id] }),
  project: one(projects, {
    fields: [tasks.projectId],
    references: [projects.id],
  }),
  timeEntries: many(timeEntries),
  calendarEvents: many(calendarEvents),
}))

export const calendarEventsRelations = relations(
  calendarEvents,
  ({ one, many }) => ({
    user: one(user, { fields: [calendarEvents.userId], references: [user.id] }),
    linkedTask: one(tasks, {
      fields: [calendarEvents.linkedTaskId],
      references: [tasks.id],
    }),
    timeEntries: many(timeEntries),
  })
)

export const timeEntriesRelations = relations(timeEntries, ({ one }) => ({
  user: one(user, { fields: [timeEntries.userId], references: [user.id] }),
  task: one(tasks, { fields: [timeEntries.taskId], references: [tasks.id] }),
  event: one(calendarEvents, {
    fields: [timeEntries.eventId],
    references: [calendarEvents.id],
  }),
}))

export const tagsRelations = relations(tags, ({ one, many }) => ({
  user: one(user, { fields: [tags.userId], references: [user.id] }),
  assignments: many(tagAssignments),
}))

export const tagAssignmentsRelations = relations(tagAssignments, ({ one }) => ({
  tag: one(tags, { fields: [tagAssignments.tagId], references: [tags.id] }),
}))

export const sharedRecordsRelations = relations(sharedRecords, ({ one }) => ({
  user: one(user, { fields: [sharedRecords.userId], references: [user.id] }),
}))
