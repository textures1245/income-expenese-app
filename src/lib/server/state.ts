import { writable } from 'svelte/store';
import type { UserInterface } from './type';

export class User implements UserInterface {
	constructor(
		public isLoggedIn: boolean,
		public email: string | null,
		public sessionTimeout: number | null
	) {}
}

export const currentUser = writable(new User(false, null, null));
