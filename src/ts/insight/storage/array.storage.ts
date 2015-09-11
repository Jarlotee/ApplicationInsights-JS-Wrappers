import {Message} from '../message';
import {IStorage} from './i.storage';

class ArrayStorage implements IStorage {
	private _messages: Array<Message>;

	constructor() {
		this._messages = new Array<Message>();
	}

	push(item: Message): void {
		if (item) {
			this._messages.push(item);
		};
	}

	pop(count: number): Message[] {
		return this._messages.splice(0, count);
	}

	count(): number {
		return this._messages.length;
	}
}

export {ArrayStorage};