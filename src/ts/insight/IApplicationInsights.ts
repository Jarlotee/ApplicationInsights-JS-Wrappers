import {ErrorWithStack} from './Error';

interface IApplicationInsights {
	trackEvent(name: string, properties?: { [key: string]: string }, measurements?: { [key: string]: number }): void;
	trackMetric(name: string, average: number, sampleCount?: number, min?: number, max?: number): void;
	trackException(
		exception: ErrorWithStack,
		handledAt?: string,
		properties?:
		{ [key: string]: string },
		measurements?:
		{ [key: string]: number }): void;
	trackTrace(message: string, properties?: { [key: string]: string }, measurements?: { [key: string]: number }): void;
}

export {IApplicationInsights};