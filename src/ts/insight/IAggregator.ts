import {IWrapper} from './IWrapper';
import {Message} from './Message';
import {Level} from './Level';

interface IAggregator {
	level: Level;
	init(wrappers: Array<IWrapper>): void;
	wrapFunction(toBeWrapped: Function, rethrow: boolean): Function;
	handleMessage(message: Message): void;
}

export {IAggregator}