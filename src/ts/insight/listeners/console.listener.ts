import {Message} from '../message';
import {Level} from '../level';
import {IListener} from './i.listener';
import {ConsoleWrapper} from '../wrappers/console.wrapper';

class ConsoleListener implements IListener {
	private _wrapper: ConsoleWrapper;

	constructor(wrapper: ConsoleWrapper) {
		this._wrapper = wrapper;
	}

	listen(message: Message): void {
		if (this._wrapper) {
			while (this._wrapper.console[message.level] === undefined && message.level > 1) {
				message.level--;
			}

			if (message.stack) {
				this._wrapper.console[message.level].bind(console)(message.message, message.stack);
			} else {
				this._wrapper.console[message.level].bind(console)(message.message);
			}
		} else {
			if (message.level === Level.Error) {
				console.error(message.message);
			} else if (message.level === Level.Warn) {
				console.warn(message.message);
			} else if (message.level === Level.Info) {
				console.info(message.message);
			} else if (message.level === Level.Debug) {
				console.debug(`${message.message}`);
			} else {
				console.log(message.message);
			}
		}
	}
}

export {ConsoleListener};