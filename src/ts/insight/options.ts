import {Level} from './level';
import {IListener} from './listeners/i.listener';

class Options {
	console: boolean;
	syncSize: number;
	syncInterval: number;
	level: Level;
	listener: IListener;


	constructor(console: boolean, syncSize: number, syncInterval: number, level: Level, listener?: IListener) {
		this.console = console;
		this.syncSize = syncSize;
		this.syncInterval = syncInterval;
		this.level = level;
		this.listener = listener;
	}
}

export {Options};
