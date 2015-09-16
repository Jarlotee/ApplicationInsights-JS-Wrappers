import {Level} from './Level';
import {ErrorWithStack} from './Error';

class Message {
	level: Level;
	message: string;
	exception: ErrorWithStack;

	constructor(level: Level, message: string, exception?: ErrorWithStack) {
		this.level = level;
		this.message = message;
		this.exception = exception;
	}
}

export {Message};
