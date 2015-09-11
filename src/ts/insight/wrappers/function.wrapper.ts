import {IErrorEvent} from './i.error.event';

class FunctionWrapper {
	private toBeWrapped: Function;
	private callback: IErrorEvent;
	private rethrow: boolean;

	constructor(toBeWrapped: Function, callback: IErrorEvent, rethrow: boolean) {
		this.toBeWrapped = toBeWrapped;
		this.callback = callback;
		this.rethrow = rethrow;
	}

	public wrapped() {
		try {
			return this.toBeWrapped.apply(this, arguments);
		} catch (e) {
			this.callback(e);
			if (this.rethrow) {
				throw e;
			}
		}
	}
}

export {FunctionWrapper}