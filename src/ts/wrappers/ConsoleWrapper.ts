import {Message} from './Message';
import {Level} from './Level';
import {IMessageEventHandler} from './IMessageEventHandler';
import {IWrapper} from './IWrapper';

class ConsolePlaceHolder implements Console {
	assert(test?: boolean, message?: string, ...optionalParams: any[]): void { }
	clear(): void { }
	count(countTitle?: string): void { }
	debug(message?: string, ...optionalParams: any[]): void { }
	dir(value?: any, ...optionalParams: any[]): void { }
	dirxml(value: any): void { }
	error(message?: any, ...optionalParams: any[]): void { }
	group(groupTitle?: string): void { }
	groupCollapsed(groupTitle?: string): void { }
	groupEnd(): void { }
	info(message?: any, ...optionalParams: any[]): void { }
	log(message?: any, ...optionalParams: any[]): void { }
	msIsIndependentlyComposed(element: Element): boolean { return false; }
	profile(reportName?: string): void { }
	profileEnd(): void { }
	select(element: Element): void { }
	time(timerName?: string): void { }
	timeEnd(timerName?: string): void { }
	trace(): void { }
	warn(message?: any, ...optionalParams: any[]): void { }
}

class ConsoleWrapper implements IWrapper {
	private _handler: IMessageEventHandler;
	private _console: { [id: number]: Function };
	private _rethrow: boolean;

	constructor(rethrow = false) {
		this._console = {};
		this._rethrow = rethrow;
	}

	init(handler: IMessageEventHandler): void {
		this._handler = handler;
		this.wrap();
	}

	private wrap() {
		if (typeof console === 'undefined') {
			window.console = new ConsolePlaceHolder();
		}

		this._console[Level.Log] = console.log;
		this._console[Level.Debug] = console.debug;
		this._console[Level.Info] = console.info;
		this._console[Level.Warn] = console.warn;
		this._console[Level.Error] = console.error;


		console.debug = this.handleDebug.bind(this);
		console.log = this.handleLog.bind(this);
		console.info = this.handleInfo.bind(this);
		console.warn = this.handleWarn.bind(this);
		console.error = this.handleError.bind(this);
	}

	private handle(level: Level, message?: any, ...optionalParams: any[]) {

		if (typeof message === 'object') {
			message = JSON.stringify(message);
		}

		if (optionalParams.length > 0) {
			for (var i = 0; i < optionalParams.length; i++) {
				var e = optionalParams[i];
				if (e.length > 0) {
					for (var j = 0; j < e.length; j++) {
						var value = e[j];
						if (typeof e[j] === 'object') {
							value = JSON.stringify(e[j]);
						}
						message += ' ' + value;
					}
				}
			}
		}

		//Do not send App Insights messages back up, they cause an infinite loop.
		if (message.substring(0, 3) !== 'AI:') {
			this._handler(new Message(level, message));
        }

		if (this._rethrow) {
			while (this._console[level] === undefined && level > 1) {
				level--;
			}

			if ('bind' in this._console[level]) {
				this._console[level].bind(console)(message);
			} else {
				Function.prototype.bind(this._console[level], console)(message);
			}
		}
	}

	private handleLog(message?: any, ...optionalParams: any[]): void {
		this.handle(Level.Log, message, optionalParams);
	}

	private handleDebug(message?: any, ...optionalParams: any[]): void {
		this.handle(Level.Debug, message, optionalParams);
	}

	private handleInfo(message?: any, ...optionalParams: any[]): void {
		this.handle(Level.Info, message, optionalParams);
	}

	private handleWarn(message?: any, ...optionalParams: any[]): void {
		this.handle(Level.Warn, message, optionalParams);
	}

	private handleError(message?: any, ...optionalParams: any[]): void {
		this.handle(Level.Error, message, optionalParams);
	}
}

export {ConsoleWrapper};