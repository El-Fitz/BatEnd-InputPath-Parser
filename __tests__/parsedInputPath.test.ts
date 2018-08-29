/*
 * @Author: Thomas Léger 
 * @Date: 2018-08-25 22:26:17 
 * @Last Modified by:   Thomas Léger 
 * @Last Modified time: 2018-08-25 22:26:17 
 */

import { InputPathParser } from "../src";

describe("Input Path Parser - Parsed Input Path- Tests", () => {
	const inputPathRegex = /((([A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12})|(FlowExecutionInput))(((\.[a-zA-Z_0-9]*)|(\[\d{0,4}\]))+?)*)(?=}})/gi;
	const uuidV4Regex = /(([A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12})|(FlowExecutionInput))/gi;
	const regex = /[A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12}/i;
	const inputPathParser = new InputPathParser(inputPathRegex, uuidV4Regex);

	describe("Empty Input Path Parsing", () => {
		const inputPath = {property: ""};
		const expectedResult = "Invalid Input Path";

		it("should throw an error", () => {
			return expect(() => inputPathParser.parsedInputPath(inputPath)).toThrow(Error);
		});

		it("should throw a specific error", () => {
			return expect(() => inputPathParser.parsedInputPath(inputPath)).toThrow(expectedResult);
		});
	});

	describe("Simple Input Paths Parsing", () => {
		const inputPath = "{{636a803d-d921-410e-8c6c-cde20e9259b0.inputDataModels}}";
		const expectedResult = "636a803d-d921-410e-8c6c-cde20e9259b0.inputDataModels";

		it("should not throw an error", () => {
			return expect(() => inputPathParser.parsedInputPath(inputPath)).not.toThrow();
		});

		it("should return the expected result", () => {
			return expect(inputPathParser.parsedInputPath(inputPath)).toStrictEqual(expectedResult);
		});
	});

	describe("Simple Object Input Path Parsing", () => {
		const inputPath = {
			property: "{{636a803d-d921-410e-8c6c-cde20e9259b0.inputDataModels}}",
			secondProperty: "{{20741cd6-8df4-4e7d-8a4c-944c8d0c4b7f}}",
		};
		const expectedResult = {
			property: "636a803d-d921-410e-8c6c-cde20e9259b0.inputDataModels",
			secondProperty: "20741cd6-8df4-4e7d-8a4c-944c8d0c4b7f",
		};

		it("should not throw an error", () => {
			return expect(() => inputPathParser.parsedInputPath(inputPath)).not.toThrow();
		});

		it("should return the expected result", () => {
			return expect(inputPathParser.parsedInputPath(inputPath)).toStrictEqual(expectedResult);
		});
	});

	describe("Simple Object Input Path With Duplicates Parsing", () => {
		const inputPath = {
			property: "{{636a803d-d921-410e-8c6c-cde20e9259b0.inputDataModels}}",
			secondProperty: "{{20741cd6-8df4-4e7d-8a4c-944c8d0c4b7f}}",
			thirdProperty: "{{636a803d-d921-410e-8c6c-cde20e9259b0.outputDataModels}}",
		};
		const expectedResult = {
			property: "636a803d-d921-410e-8c6c-cde20e9259b0.inputDataModels",
			secondProperty: "20741cd6-8df4-4e7d-8a4c-944c8d0c4b7f",
			thirdProperty: "636a803d-d921-410e-8c6c-cde20e9259b0.outputDataModels",
		};

		it("should not throw an error", () => {
			return expect(() => inputPathParser.parsedInputPath(inputPath)).not.toThrow();
		});

		it("should return the expected array result", () => {
			return expect(inputPathParser.parsedInputPath(inputPath)).toStrictEqual(expectedResult);
		});
	});

	describe("Nested Properties Input Paths Parsing", () => {
		const inputPath = {
			property: "{{636a803d-d921-410e-8c6c-cde20e9259b0.inputDataModels.blabla}}",
			secondProperty: "{{20741cd6-8df4-4e7d-8a4c-944c8d0c4b7f}}",
			thirdProperty: "{{6fc41d70-a16d-44d8-b1b5-eec0ceffa926.a[5]}}",
		};
		const expectedResult = {
			property: "636a803d-d921-410e-8c6c-cde20e9259b0.inputDataModels.blabla",
			secondProperty: "20741cd6-8df4-4e7d-8a4c-944c8d0c4b7f",
			thirdProperty: "6fc41d70-a16d-44d8-b1b5-eec0ceffa926.a[5]",
		};

		it("should not throw an error", () => {
			return expect(() => inputPathParser.parsedInputPath(inputPath)).not.toThrow();
		});

		it("should return the expected array result", () => {
			return expect(inputPathParser.parsedInputPath(inputPath)).toStrictEqual(expectedResult);
		});
	});

	describe("Arrays Input Path Parsing", () => {
		const inputPath = ["{{636a803d-d921-410e-8c6c-cde20e9259b0.inputDataModels}}"];
		const expectedResult = ["636a803d-d921-410e-8c6c-cde20e9259b0.inputDataModels"];
		const expectedResultsCount = expectedResult.length;

		it("should not throw an error", () => {
			return expect(() => inputPathParser.parsedInputPath(inputPath)).not.toThrow();
		});

		it("should return an array of x elements", () => {
			return expect(inputPathParser.parsedInputPath(inputPath).length).toStrictEqual(expectedResultsCount);
		});

		it("should return an array of inputs", () => {
			return expect(inputPathParser.parsedInputPath(inputPath).map(i => regex.test(i)).reduce( (acc, value) => acc && value, true)).toStrictEqual(true);
		});

		it("should return the expected array result", () => {
			return expect(inputPathParser.parsedInputPath(inputPath)).toStrictEqual(expectedResult);
		});
	});

	describe("Complex Single Property Input Path Parsing", () => {
		const inputPath = { property: "{{636a803d-d921-410e-8c6c-cde20e9259b0.a}} {{636a803d-d921-410e-8c6c-cde20e9259b0.b}}/{{20741cd6-8df4-4e7d-8a4c-944c8d0c4b7f.c[0]}}?something={{636a803d-d921-410e-8c6c-cde20e9259b0.d.e}}"};
		const expectedResult = {
			property: [
				"636a803d-d921-410e-8c6c-cde20e9259b0.a",
				"636a803d-d921-410e-8c6c-cde20e9259b0.b",
				"20741cd6-8df4-4e7d-8a4c-944c8d0c4b7f.c[0]",
				"636a803d-d921-410e-8c6c-cde20e9259b0.d.e",
			],
		};

		it("should not throw an error", () => {
			return expect(() => inputPathParser.parsedInputPath(inputPath)).not.toThrow();
		});

		it("should return the expected array result", () => {
			return expect(inputPathParser.parsedInputPath(inputPath)).toStrictEqual(expectedResult);
		});
	});

	describe("Complex Multiple Properties Input Path Parsing", () => {
		const inputPath = {
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
		const expectedResult = {
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
			return expect(() => inputPathParser.parsedInputPath(inputPath)).not.toThrow();
		});

		it("should return the expected array result", () => {
			return expect(inputPathParser.parsedInputPath(inputPath)).toStrictEqual(expectedResult);
		});
	});
});
