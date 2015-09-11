import {Level} from '../level';

interface IConsoleMessage {
	(level: Level, message?: any, ...optionalParams: any[]): void;
}

export {IConsoleMessage}