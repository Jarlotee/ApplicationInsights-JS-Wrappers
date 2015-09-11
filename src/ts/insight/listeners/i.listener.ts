import {Message} from '../message';

interface IListener {
	listen(message: Message): void;
}

export {IListener}