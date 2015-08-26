module Insight.Wrappers {
    
    export interface IErrorEvent {
        (event: any, source?: string, fileNumber?: number, 
            columnNumber?: number, e?: ErrorEvent) : void;
    }
    
    export class ErrorWrapper {
        private _reThrow: boolean;
        private _handler: IErrorEvent;
        private _defaultOnError: ErrorEventHandler;
        
        constructor(rethrow: boolean, handler: IErrorEvent) {
            this._reThrow = rethrow;
            this._handler = handler;
            this.wrap();
        }
        
        private wrap() {
            this._defaultOnError = window.onerror;
            window.onerror = this.handleError.bind(this);
        }
        
        private handleError(event: any, source?: string, fileNumber?: number, 
            columnNumber?: number, e?: ErrorEvent) : void {
           this._handler(event, source, fileNumber, columnNumber, e);
           
            if(this._reThrow) {
                this._defaultOnError(event, source, fileNumber, columnNumber);
            }
        }   
    }
}
