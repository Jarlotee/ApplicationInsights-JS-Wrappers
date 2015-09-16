import {IMessageEventHandler} from './IMessageEventHandler';

interface IWrapper {
	init(handler: IMessageEventHandler) : any;
}

export {IWrapper};