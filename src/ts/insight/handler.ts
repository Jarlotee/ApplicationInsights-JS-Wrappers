import {IListener} from './listeners/i.listener';
import {ConsoleListener} from './listeners/console.listener';
import {IStorage} from './storage/i.storage';
import {LocalStorage} from './storage/local.storage';
import {ArrayStorage} from './storage/array.storage';
import {Options} from './options';
import {BaseAggregator} from './aggregators/base';

class Handler {
	private _listeners: Array<IListener>;
	private _aggregator: BaseAggregator;
	private _options: Options;
	private _storage: IStorage;
	private _syncHandle: number;

	constructor(options: Options) {
		this._options = options;
		this._listeners = new Array<IListener>();

		if (typeof window !== 'undefined' && window.localStorage) {
			this._storage = new LocalStorage();
		} else {
			this._storage = new ArrayStorage();
		}

		this._aggregator = new BaseAggregator(this._storage, this._options.level);

		if (options.console) {
			this._listeners.push(new ConsoleListener(this._aggregator.console));
		}

		if (options.listener) {
			this._listeners.push(options.listener);
		}

		this.start();
	}

	wrap(toBeWrapped: Function, rethrow = false) {
		return this._aggregator.wrapFunction(toBeWrapped, rethrow);
	}

	start() {
		this._syncHandle = setInterval(this.sync.bind(this), this._options.syncInterval);
	}

	pause() {
		clearInterval(this._syncHandle);
	}

	sync() {
		var pull = (this._storage.count() < this._options.syncSize) ?
			this._storage.count() : this._options.syncSize;

		var messages = this._storage.pop(pull);

		this._listeners.forEach(listener => {
			messages.forEach(message => {
				listener.listen(message);
			});
		});
	}
}

export {Handler};