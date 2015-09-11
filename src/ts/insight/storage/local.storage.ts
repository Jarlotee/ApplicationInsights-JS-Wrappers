import {Message} from '../message';
import {IStorage} from './i.storage';


class LocalStorage implements IStorage {

	private _prefix: string;
	private _count: number;
	private _keys: Array<string>;

	constructor() {
		this._prefix = 'insight_';
		this._count = 0;
		this._keys = new Array<string>();
		this.loadStorage();
	}

	private loadStorage(): void {
		for (var key in localStorage) {
			if (key.indexOf(this._prefix) === 0) {
				this._keys.push(key);
				this._count++;
			}
		}
	}

	private now(): number {
		//More accurate, not always available
		if (typeof window !== 'undefined' && window.performance && performance.now) {
			return performance.now();
		} else {
			return new Date().getTime();
		}
	}

	push(item: Message): void {
		var ts = this.now();
		var rnd = Math.random() * Math.pow(10, 17);
		var key = `${this._prefix}_${ts}_${rnd}`;

		localStorage.setItem(key, JSON.stringify(item));
		this._keys.push(key);
		this._count++;
	}

	pop(count: number): Message[] {
		var results = new Array<Message>();

		var keys = this._keys.splice(0, count);

		for (var i = 0; i < keys.length; i++) {
			results.push(
				JSON.parse(
					localStorage.getItem(keys[i])
					)
				);
			localStorage.removeItem(keys[i]);
			this._count--;
		}

		return results;
	}

	count(): number {
		return this._count;
	}
}

export {LocalStorage};