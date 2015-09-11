import {Message} from '../message';

interface IStorage {
	push(item: Message): void;
	pop(count: number): Message[];
	count(): number;
}

export {IStorage};
