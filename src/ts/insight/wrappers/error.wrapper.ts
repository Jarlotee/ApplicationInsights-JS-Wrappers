import {IWindowErrorEvent} from './i.window.error.event';

class ErrorWrapper {
	private _reThrow: boolean;
	private _handler: IWindowErrorEvent;
	private _defaultOnError: ErrorEventHandler;

	constructor(rethrow: boolean, handler: IWindowErrorEvent) {
		this._reThrow = rethrow;
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
		columnNumber?: number, e?: ErrorEvent): void {
		this._handler(event, source, fileNumber, columnNumber, e);

		if (this._reThrow) {
			this._defaultOnError(event, source, fileNumber, columnNumber);
		}
	}
}

export {ErrorWrapper};