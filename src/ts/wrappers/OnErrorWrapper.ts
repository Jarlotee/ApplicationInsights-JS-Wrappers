import {Message} from './Message';
import {Level} from './Level';
import {ErrorWithStack} from './Error';
import {IMessageEventHandler} from './IMessageEventHandler';
import {IWrapper} from './IWrapper';

interface ErrorEventHandlerWithError {
	(event: any, source?: string, fileno?: number, columnNumber?: number, e?: ErrorWithStack): void;
}

class OnErrorWrapper implements IWrapper {
	private _reThrow: boolean;
	private _handler: IMessageEventHandler;
	private _defaultOnError: ErrorEventHandlerWithError;

	constructor(rethrow = false) {
		this._reThrow = rethrow;
	}

	init(handler: IMessageEventHandler): any {
		this._handler = handler;
		this.wrap();
	}

	private wrap() {
		if (typeof window !== 'undefined') {
			this._defaultOnError = window.onerror;
			window.onerror = this.handleError.bind(this);
		}
	}

	private handleError(event: any, source?: string, fileNumber?: number,
		columnNumber?: number, e?: ErrorWithStack): void {
		this._handler(new Message(Level.Error, event, e));

		if (this._reThrow) {
			this._defaultOnError(event, source, fileNumber, columnNumber, e);
		}
	}
}

export {OnErrorWrapper};