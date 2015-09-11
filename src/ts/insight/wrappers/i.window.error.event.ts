interface IWindowErrorEvent {
	(event: any, source?: string, fileNumber?: number,
		columnNumber?: number, e?: ErrorEvent): void;
}

export {IWindowErrorEvent};