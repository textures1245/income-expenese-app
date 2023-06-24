import * as z from 'zod';

const UserSchema = z.object({
    isLoggedIn: z.boolean(),
    email: z.string(),
    sessionTimeout: z.number(),
})

export type User = z.infer<>