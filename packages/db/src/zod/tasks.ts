// packages/database/validators/tasks.ts
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'
import { tasks } from '../schema/tasks.js'

// 1. 查询返回的数据类型校验
export const selectTaskSchema = createSelectSchema(tasks)

// 2. 表单/API 校验用 Schema（通过原生 Zod 的 .omit() 和 .extend() 覆盖规则）
export const insertTaskSchema = createInsertSchema(tasks)
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
  })
  .extend({
    title: z.string().min(1, '任务标题不能为空').max(100),
    estimatedMinutes: z.number().min(0).optional(),
  })

// 3. 导出前后端通用的 TS 类型 (DTO)
export type CreateTaskInput = z.infer<typeof insertTaskSchema>
export type TaskDto = z.infer<typeof selectTaskSchema>
