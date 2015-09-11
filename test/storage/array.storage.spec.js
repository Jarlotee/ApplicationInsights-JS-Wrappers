var ArrayStorage = require("../../src/js/insight/storage/array.storage").ArrayStorage;
var Message = require("../../src/js/insight/message").Message;

describe("Array Storage", function () {

	var storage;
	var initialCount;

	beforeEach(function () {
		storage = new ArrayStorage();
		initialCount = storage.count();
	});


	describe("When I add a new message", function () {
		var message;
		var countAfterMessageAdd;

		beforeEach(function () {
			message = new Message(1, "hello");
			storage.push(message);
			countAfterMessageAdd = storage.count();
		});

		it("the message count should increase by one", function () {
			expect(storage.count()).toBe(initialCount + 1);
		});

		describe("When I remove a message", function () {
			var messages;

			beforeEach(function () {
				messages = storage.pop(1);
			});

			it("the count should decrease by one", function () {
				expect(storage.count()).toBe(countAfterMessageAdd - 1);
			});

			it("and the returned message should match", function () {
				expect(messages[0].level).toBe(message.level);
				expect(messages[0].message).toBe(message.message);
				expect(messages[0].stack).toBe(message.stack);
			});
		});

		describe("When I add another new messages (two total)", function () {
			beforeEach(function () {
				storage.push(message);
				countAfterMessageAdd = storage.count();
			});

			describe("and I try to remove three message", function () {
				var messages;
				
				beforeEach(function () {
					messages = storage.pop(3);
				});
				
				it("the count should decrease by two", function () {
					expect(storage.count()).toBe(countAfterMessageAdd - 2);
				});
				it("the number of messages returned should by two", function () {
					expect(messages.length).toBe(2);
				});
			});
		});
	});
});