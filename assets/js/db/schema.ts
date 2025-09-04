import * as z from 'zod/v4'


export const authSchema = z.object({
  key: z.literal('current'),
  user_id: z.uuid(),
})

export const userSchema = z.object({
  id: z.uuid(),
  name: z.string()
})

export type Auth = z.infer<typeof authSchema>
export type User = z.infer<typeof userSchema>
