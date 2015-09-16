var Message = (function () {
    function Message(level, message, exception) {
        this.level = level;
        this.message = message;
        this.exception = exception;
    }
    return Message;
})();
exports.Message = Message;
