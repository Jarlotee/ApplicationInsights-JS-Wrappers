module Insight.Listeners {
	export class ConsoleListener implements IListener {
		private _wrapper: Insight.Wrappers.ConsoleWrapper;
		
		constructor(wrapper: Insight.Wrappers.ConsoleWrapper) {
			this._wrapper = wrapper;
		}
		
		listen(message: Message) : void {
			if(this._wrapper) {
				this._wrapper.console[message.level].bind(console)(message.message, message.stack);
			} else {
				if(message.level === Level.Error) {
					console.error(message.message);
				} else if(message.level === Level.Warn) {
					console.warn(message.message);
				} else if(message.level === Level.Info) {
					console.info(message.message);
				} else if(message.level === Level.Debug) {
					console.debug(`${message.message}`);
				} else {
					console.log(message.message);
				}
			}
		}
	}
}