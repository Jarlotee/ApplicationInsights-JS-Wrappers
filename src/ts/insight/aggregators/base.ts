import {Message} from '../message';
import {Level} from '../level';
import {ConsoleWrapper} from '../wrappers/console.wrapper';
import {ErrorWrapper} from '../wrappers/error.wrapper';
import {FunctionWrapper} from '../wrappers/function.wrapper';
import {IStorage} from '../storage/i.storage';

interface ErrorEventWithStack extends ErrorEvent {
	stack: string;
}

class BaseAggregator {

	console: ConsoleWrapper;
	private _errors: ErrorWrapper;
	private _storage: IStorage;
	private _level: Level;

	constructor(storage: IStorage, level: Level) {
		this._storage = storage;
		this._level = level;
		this.console = new ConsoleWrapper(this.handleConsole.bind(this));
		this._errors = new ErrorWrapper(false, this.handleWindowErrors.bind(this));
	}

	private append(message: Message): void {
		if (message.level <= this._level) {
			this._storage.push(message);
		}
	}

	private decodeParameter(param: any): string {
		if (typeof param === 'string') {
			return param;
		} else if (param instanceof Array) {
			return '';
		} else if (typeof param === 'object') {
			return JSON.stringify(param);
		}
	}

	public wrapFunction(toBeWrapped: Function, rethrow: boolean) {
		var funkyWrapper = new FunctionWrapper(toBeWrapped, this.handleErrorEvents.bind(this), rethrow);
		return funkyWrapper.wrapped.bind(funkyWrapper);
	}

	private handleErrorEvents(e: ErrorEventWithStack) {
		var stack: string;

		if (e && e.stack) {
			stack = e.stack;
		}

		this.append(new Message(Level.Error, this.decodeParameter(e), stack));
	}

	private handleConsole(level: Level, message?: any, ...optionalParams: any[]): void {
		var formatted = `${this.decodeParameter(message) }`;

		optionalParams.forEach(element => {
			formatted += ` ${this.decodeParameter(element) }`;
		});

		this.append(new Message(level, formatted));
	}

	private handleWindowErrors(event: any, source?: string, fileNumber?: number, columnNumber?: number
		, e?: ErrorEventWithStack): void {

		var stack: string;

		if (e && e.stack) {
			stack = e.stack;
		}

		this.append(new Message(Level.Error, this.decodeParameter(event), stack));
	}
}

export {BaseAggregator};