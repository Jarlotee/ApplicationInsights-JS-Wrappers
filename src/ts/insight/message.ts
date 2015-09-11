import {Level} from './level';

class Message {
	level: Level;
	message: string;
	stack: string;

	constructor(level: Level, message: string, stack?: string) {
		this.level = level;
		this.message = message;
		this.stack = stack;
	}
}

export {Message};
