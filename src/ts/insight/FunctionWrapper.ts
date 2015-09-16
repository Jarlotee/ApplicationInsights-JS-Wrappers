import {Message} from './Message';
import {Level} from './Level';
import {IMessageEventHandler} from './IMessageEventHandler';
import {IWrapper} from './IWrapper';

class FunctionWrapper implements IWrapper {
	private _toBeWrapped: Function;
	private _handler: IMessageEventHandler;
	private _reThrow: boolean;

	constructor(toBeWrapped: Function, rethrow = false) {
		this._toBeWrapped = toBeWrapped;
		this._reThrow = rethrow;
	}

	init(handler: IMessageEventHandler): Function {
		this._handler = handler;
		return this.wrap.bind(this);
	}

	private wrap() {
		try {
			return this._toBeWrapped.apply(this, arguments);
		} catch (e) {
			this._handler(new Message(Level.Error, e.message, e));
			if (this._reThrow) {
				throw e;
			}
		}
	}
}

export {FunctionWrapper}