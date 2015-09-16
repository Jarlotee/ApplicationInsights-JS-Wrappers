import {ErrorWithStack} from './Error';
import {Level} from './Level';
import {Message} from './Message';
import {IAggregator} from './IAggregator';
import {IWrapper} from './IWrapper';
import {FunctionWrapper} from './FunctionWrapper';
import {IApplicationInsights} from './IApplicationInsights';

class ApplicationInsightsAggregator implements IAggregator {
	private _wrappers: Array<IWrapper>;
	private _appInsights: IApplicationInsights;
	level: Level;

	constructor(appInsights: IApplicationInsights, level = Level.Error) {
		this._appInsights = appInsights;
		this.level = level;
	}

	handleMessage(message: Message): void {
		if (message.level === Level.Error && message.exception) {
			this._appInsights.trackException(message.exception, 'insightjs');
		} else {
			var name = this.getLevelName(message.level);
			var details = message.message;

			if (this.isJson(details)) {
				details = JSON.parse(details);
			}

			this._appInsights.trackTrace(message.message, { 'Level': name });
		}
	}

	init(wrappers: Array<IWrapper>): void {
		wrappers.forEach(element => {
			element.init(this.handleMessage.bind(this));
		});
	}

	wrapFunction(toBeWrapped: Function, rethrow?: boolean): Function {
		var wrapper = new FunctionWrapper(toBeWrapped, rethrow);
		return wrapper.init(this.handleMessage.bind(this));
	}

	private getLevelName(level: Level): string {
		for (var n in Level) {
			if (typeof Level[n] === 'number' && Level[n].toString() === level.toString()) {
				return n;
			}
		}

		return null;
	}

	private isJson(value: string): boolean {
		try {
			JSON.parse(value);
		} catch (e) {
			return false;
		}
		return true;
	}
}

export {ApplicationInsightsAggregator}