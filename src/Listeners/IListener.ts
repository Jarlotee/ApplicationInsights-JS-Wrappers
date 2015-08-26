module Insight.Listeners {
	export interface IListener {
		listen(message: Message): void;
	}
}