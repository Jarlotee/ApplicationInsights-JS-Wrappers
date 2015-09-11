import {Message} from '../message';
import {Level} from '../level';
import {IListener} from './i.listener';
import {IApplicationInsights} from './i.application.insights';

class ApplicationInsightsListener implements IListener {
	private _appInsights: IApplicationInsights;

	constructor(appInsights: IApplicationInsights) {
		this._appInsights = appInsights;
	}

	listen(message: Message): void {
		if (message.level === Level.Error && this.isJson(message.message)) {
			this._appInsights.trackException(JSON.parse(message.message), 'insightjs');
		} else {
			var name = this.getLevelName(message.level);
			this._appInsights.trackTrace(message.message, { 'Level': name });
		}
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

export {ApplicationInsightsListener};