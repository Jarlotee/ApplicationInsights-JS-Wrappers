module Insight.Aggregators {
	
	interface ErrorEventWithStack extends ErrorEvent {
		stack:string;
	}
	
	
	export class BaseAggregator {

		console: Insight.Wrappers.ConsoleWrapper;
		private _errors: Insight.Wrappers.ErrorWrapper;
		private _storage: Insight.Storage.IStorage;
		private _level: Level;


		constructor(storage: Insight.Storage.IStorage, level: Level) {
			this._storage = storage;
			this._level = level;
			this.console = new Insight.Wrappers.ConsoleWrapper(this.handleConsole.bind(this));
			this._errors = new Insight.Wrappers.ErrorWrapper(false, this.handleErrors.bind(this));
		}

		private append(message: Message) : void {
			if(message.level <= this._level) {
				this._storage.push(message);
			}
		}
		
		private decodeParameter(param: any) : string {
			if(typeof param === "string") {
				return param;
			} else if (param instanceof Array) {
				return "";
			} else if(typeof param === "object") {
				return JSON.stringify(param);
			}
		}

		private handleConsole(level: Level, message?: any, ...optionalParams: any[]): void {
			var formatted = `${this.decodeParameter(message)}`;
			
			optionalParams.forEach(element => {
				formatted += ` ${this.decodeParameter(element)}`;
			});
			
			this.append(new Message(level, formatted));
		}

		private handleErrors(event: any, source?: string, fileNumber?: number, columnNumber?: number
			, e?: ErrorEventWithStack): void {
			
			var stack: string;
			
			if(e && e.stack) {
				stack = e.stack;
			}
			
			this.append(new Message(Level.Error, this.decodeParameter(event), stack));
		}
	}
}