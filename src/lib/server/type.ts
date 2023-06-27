import * as z from 'zod';

export const UserSessionSchema = z.object({
	isLoggedIn: z.boolean(),
	userId: z.number(),
	email: z.string().nullable(),
	sessionTimeout: z.number().nullable()
});

// type Income = {Record<string, any>};

// export const UserSchema = z.object({
// 	userId: z.string(),
// 	createdAt: z.date(),
// 	email: z.string(),
// 	password: z.string(),
// 	incomes: z.object().array(),
// 	expenses: z.object().array()
// });

export type UserType = z.infer<typeof UserSessionSchema>;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface UserInterface extends UserType {}
