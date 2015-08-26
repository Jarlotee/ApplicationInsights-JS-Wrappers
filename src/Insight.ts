module Insight {

	export interface Options {
		console:boolean;
		syncSize:number;
		syncInterval: number;
		level: Level;
	}


	export class Startup {
		private _listeners: Array<Listeners.IListener>;
		private _aggregator: Aggregators.BaseAggregator;
		private _options: Options;
		private _storage: Storage.IStorage;
		private _syncHandle: number;

		constructor(options: Options) {
			this._options = options;
			this._listeners = new Array<Listeners.IListener>();
			
			if(window.localStorage) {
				this._storage = new Insight.Storage.LocalStorage();
			} else {
				this._storage = new Insight.Storage.ArrayStorage();
			}
			
			this._aggregator = new Aggregators.BaseAggregator(this._storage, this._options.level);
			
			if(options.console) {
				this._listeners.push(new Listeners.ConsoleListener(this._aggregator.console));
			}
			
			this.start();
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
}