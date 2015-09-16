import {Message} from './Message';

interface IMessageEventHandler {
	(message: Message): void;
}

export {IMessageEventHandler};