// Test suite
describe("Input Path Parser - Parsed Input Path- Tests", function () {
	const regex = /[A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12}/i;
	const parser = require("../src/index.js").parsedInputPath;

	describe("Empty Input Path Parsing", function () {
		let inputPath = {property: ""};
		let expectedResult = "Invalid Input Path";

		it("should throw an error", () => {
			return expect(() => parser(inputPath)).toThrow(Error);
		});

		it("should throw a specific error", () => {
			return expect(() => parser(inputPath)).toThrow(expectedResult);
		});
	});

	describe("Simple Input Paths Parsing", function () {
		let inputPath = "{{636a803d-d921-410e-8c6c-cde20e9259b0.inputDataModels}}";
		let expectedResult = "636a803d-d921-410e-8c6c-cde20e9259b0.inputDataModels";

		it("should not throw an error", () => {
			return expect(() => parser(inputPath)).not.toThrow();
		});

		it("should return the expected result", () => {
			return expect(parser(inputPath)).toStrictEqual(expectedResult);
		});
	});

	describe("Simple Object Input Path Parsing", function () {
		let inputPath = {
			property: "{{636a803d-d921-410e-8c6c-cde20e9259b0.inputDataModels}}",
			secondProperty: "{{20741cd6-8df4-4e7d-8a4c-944c8d0c4b7f}}",
		};
		let expectedResult = {
			property: "636a803d-d921-410e-8c6c-cde20e9259b0.inputDataModels",
			secondProperty: "20741cd6-8df4-4e7d-8a4c-944c8d0c4b7f",
		};

		it("should not throw an error", () => {
			return expect(() => parser(inputPath)).not.toThrow();
		});

		it("should return the expected result", () => {
			return expect(parser(inputPath)).toStrictEqual(expectedResult);
		});
	});

	describe("Simple Object Input Path With Duplicates Parsing", function () {
		let inputPath = {
			property: "{{636a803d-d921-410e-8c6c-cde20e9259b0.inputDataModels}}",
			secondProperty: "{{20741cd6-8df4-4e7d-8a4c-944c8d0c4b7f}}",
			thirdProperty: "{{636a803d-d921-410e-8c6c-cde20e9259b0.outputDataModels}}",
		};
		let expectedResult = {
			property: "636a803d-d921-410e-8c6c-cde20e9259b0.inputDataModels",
			secondProperty: "20741cd6-8df4-4e7d-8a4c-944c8d0c4b7f",
			thirdProperty: "636a803d-d921-410e-8c6c-cde20e9259b0.outputDataModels",
		};

		it("should not throw an error", () => {
			return expect(() => parser(inputPath)).not.toThrow();
		});

		it("should return the expected array result", () => {
			return expect(parser(inputPath)).toStrictEqual(expectedResult);
		});
	});

	describe("Nested Properties Input Paths Parsing", function () {
		let inputPath = {
			property: "{{636a803d-d921-410e-8c6c-cde20e9259b0.inputDataModels.blabla}}",
			secondProperty: "{{20741cd6-8df4-4e7d-8a4c-944c8d0c4b7f}}",
			thirdProperty: "{{6fc41d70-a16d-44d8-b1b5-eec0ceffa926.a[5]}}",
		};
		let expectedResult = {
			property: "636a803d-d921-410e-8c6c-cde20e9259b0.inputDataModels.blabla",
			secondProperty: "20741cd6-8df4-4e7d-8a4c-944c8d0c4b7f",
			thirdProperty: "6fc41d70-a16d-44d8-b1b5-eec0ceffa926.a[5]",
		};

		it("should not throw an error", () => {
			return expect(() => parser(inputPath)).not.toThrow();
		});

		it("should return the expected array result", () => {
			return expect(parser(inputPath)).toStrictEqual(expectedResult);
		});
	});

	describe("Arrays Input Path Parsing", function () {
		let inputPath = ["{{636a803d-d921-410e-8c6c-cde20e9259b0.inputDataModels}}"];
		let expectedResult = ["636a803d-d921-410e-8c6c-cde20e9259b0.inputDataModels"];
		let expectedResultsCount = expectedResult.length;

		it("should not throw an error", () => {
			return expect(() => parser(inputPath)).not.toThrow();
		});

		it("should return an array of x elements", () => {
			return expect(parser(inputPath).length).toStrictEqual(expectedResultsCount);
		});

		it("should return an array of inputs", () => {
			return expect(parser(inputPath).map(i => regex.test(i)).reduce( (acc, value) => acc && value, true)).toStrictEqual(true);
		});

		it("should return the expected array result", () => {
			return expect(parser(inputPath)).toStrictEqual(expectedResult);
		});
	});

	describe("Complex Single Property Input Path Parsing", function () {
		let inputPath = { property: "{{636a803d-d921-410e-8c6c-cde20e9259b0.a}} {{636a803d-d921-410e-8c6c-cde20e9259b0.b}}/{{20741cd6-8df4-4e7d-8a4c-944c8d0c4b7f.c[0]}}?something={{636a803d-d921-410e-8c6c-cde20e9259b0.d.e}}"};
		let expectedResult = {
			property: [
				"636a803d-d921-410e-8c6c-cde20e9259b0.a",
				"636a803d-d921-410e-8c6c-cde20e9259b0.b",
				"20741cd6-8df4-4e7d-8a4c-944c8d0c4b7f.c[0]",
				"636a803d-d921-410e-8c6c-cde20e9259b0.d.e",
			],
		};

		it("should not throw an error", () => {
			return expect(() => parser(inputPath)).not.toThrow();
		});

		it("should return the expected array result", () => {
			return expect(parser(inputPath)).toStrictEqual(expectedResult);
		});
	});

	describe("Complex Multiple Properties Input Path Parsing", function () {
		let inputPath = {
			property: "{{636a803d-d921-410e-8c6c-cde20e9259b0.a}} {{636a803d-d921-410e-8c6c-cde20e9259b0.b}}/{{20741cd6-8df4-4e7d-8a4c-944c8d0c4b7f.c[0]}}?something={{636a803d-d921-410e-8c6c-cde20e9259b0.d.e}}",
			secondProperty: {
				thirdProperty: "{{636a803d-d921-410e-8c6c-cde20e9259b0.f}}",
			},
			fourthProperty: [
				"{{636a803d-d921-410e-8c6c-cde20e9259b0.f}}",
				"{{636a803d-d921-410e-8c6c-cde20e9259b0.g.h}}",
				"{{636a803d-d921-410e-8c6c-cde20e9259b0.i[0]}}",
			],
			fifthProperty: {
				sixthProperty: [
					"{{636a803d-d921-410e-8c6c-cde20e9259b0.j}}",
					"{{636a803d-d921-410e-8c6c-cde20e9259b0.k.l}}",
					"{{636a803d-d921-410e-8c6c-cde20e9259b0.m[0]}}",
				],
				seventhProperty: "{{636a803d-d921-410e-8c6c-cde20e9259b0.n}}",
			},
		};
		let expectedResult = {
			property: [
				"636a803d-d921-410e-8c6c-cde20e9259b0.a",
				"636a803d-d921-410e-8c6c-cde20e9259b0.b",
				"20741cd6-8df4-4e7d-8a4c-944c8d0c4b7f.c[0]",
				"636a803d-d921-410e-8c6c-cde20e9259b0.d.e",
			],
			secondProperty: {
				thirdProperty: "636a803d-d921-410e-8c6c-cde20e9259b0.f",
			},
			fourthProperty: [
				"636a803d-d921-410e-8c6c-cde20e9259b0.f",
				"636a803d-d921-410e-8c6c-cde20e9259b0.g.h",
				"636a803d-d921-410e-8c6c-cde20e9259b0.i[0]",
			],
			fifthProperty: {
				sixthProperty: [
					"636a803d-d921-410e-8c6c-cde20e9259b0.j",
					"636a803d-d921-410e-8c6c-cde20e9259b0.k.l",
					"636a803d-d921-410e-8c6c-cde20e9259b0.m[0]",
				],
				seventhProperty: "636a803d-d921-410e-8c6c-cde20e9259b0.n",
			},
		};

		it("should not throw an error", () => {
			return expect(() => parser(inputPath)).not.toThrow();
		});

		it("should return the expected array result", () => {
			return expect(parser(inputPath)).toStrictEqual(expectedResult);
		});
	});
});