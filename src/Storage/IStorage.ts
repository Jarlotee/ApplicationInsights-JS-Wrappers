module Insight.Storage {
	export interface IStorage {
		push(item: Message): void;
		pop(count: number): Message[];
		count(): number;
	}
}