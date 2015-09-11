import {Message} from '../message';
import {Level} from '../level';
import {IConsoleMessage} from './i.console.message';

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

class ConsoleWrapper {
	private _handler: IConsoleMessage;
	console: { [id: number]: Function };

	constructor(handler: IConsoleMessage) {
		this._handler = handler;
		this.console = {};
		this.wrap();
	}

	private wrap() {
		if (typeof console === 'undefined') {
			window.console = new ConsolePlaceHolder();
		}

		this.console[Level.Log] = console.log;
		this.console[Level.Debug] = console.debug;
		this.console[Level.Info] = console.info;
		this.console[Level.Warn] = console.warn;
		this.console[Level.Error] = console.error;


		console.debug = this.handleDebug.bind(this);
		console.log = this.handleLog.bind(this);
		console.info = this.handleInfo.bind(this);
		console.warn = this.handleWarn.bind(this);
		console.error = this.handleError.bind(this);
	}

	private handleLog(message?: any, ...optionalParams: any[]) {
		this._handler(Level.Log, message, optionalParams);
	}

	private handleDebug(message?: any, ...optionalParams: any[]) {
		this._handler(Level.Debug, message, optionalParams);
	}

	private handleInfo(message?: any, ...optionalParams: any[]) {
		this._handler(Level.Info, message, optionalParams);
	}

	private handleWarn(message?: any, ...optionalParams: any[]) {
		this._handler(Level.Warn, message, optionalParams);
	}

	private handleError(message?: any, ...optionalParams: any[]) {
		this._handler(Level.Error, message, optionalParams);
	}
}

export {ConsoleWrapper};