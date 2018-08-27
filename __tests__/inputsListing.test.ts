/*
 * @Author: Thomas Léger 
 * @Date: 2018-08-25 22:26:07 
 * @Last Modified by: Thomas Léger
 * @Last Modified time: 2018-08-27 18:40:16
 */

import { listRequiredInputs as parser } from "../src";
describe("Input Path Parser - Required Inputs List - Tests", () => {
	const regex = /(([A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12})(((\.[a-zA-Z_0-9]{1,})|(\[\d{0,4}\]))+?)*)/i;

	describe("Empty Input Path Required Inputs Parsing", () => {
		const inputPath = { property: "" };
		const expectedResult = "Invalid Input Path";

		const result = () => parser(inputPath);
		it("should throw an error", () => {
			return expect(result).toThrow(Error);
		});

		it("should throw a specific error", () => {
			return expect(result).toThrow(expectedResult);
		});
	});

	describe("Simple Input Path Parsing", () => {
		const inputPath = "{{636a803d-d921-410e-8c6c-cde20e9259b0.inputDataModels}}";
		const expectedResult = ["636a803d-d921-410e-8c6c-cde20e9259b0.inputDataModels"];
		const expectedResultsCount = expectedResult.length;
		const result = parser(inputPath);

		it("should return an array of x elements", () => {
			return expect(result.length).toStrictEqual(expectedResultsCount);
		});

		it("should return an array of inputs", () => {
			return expect(result.map((i) => regex.test(i)).reduce( (acc, value) => acc && value, true)).toStrictEqual(true);
		});

		it("should return the expected array result", () => {
			return expect(result).toEqual(expectedResult);
		});
	});

	describe("Simple Object Input Paths Parsing", () => {
		const inputPath = { property: "{{636a803d-d921-410e-8c6c-cde20e9259b0.inputDataModels}}", secondProperty: "{{20741cd6-8df4-4e7d-8a4c-944c8d0c4b7f}}"};
		const expectedResult = ["636a803d-d921-410e-8c6c-cde20e9259b0.inputDataModels", "20741cd6-8df4-4e7d-8a4c-944c8d0c4b7f"];
		const expectedResultsCount = expectedResult.length;
		const result = parser(inputPath);

		it("should return an array of x elements", () => {
			return expect(result.length).toStrictEqual(expectedResultsCount);
		});

		it("should return an array of inputs", () => {
			return expect(result.map((i) => regex.test(i)).reduce( (acc, value) => acc && value, true)).toStrictEqual(true);
		});

		it("should return the expected array result", () => {
			return expect(result).toEqual(expectedResult);
		});
	});

	describe("Simple Object Input Paths With Duplicates Parsing", () => {
		const inputPath = { property: "{{636a803d-d921-410e-8c6c-cde20e9259b0.inputDataModels}}", secondProperty: "{{20741cd6-8df4-4e7d-8a4c-944c8d0c4b7f}}", thirdProperty: "{{636a803d-d921-410e-8c6c-cde20e9259b0.outputDataModels}}"};
		const expectedResult = ["636a803d-d921-410e-8c6c-cde20e9259b0.inputDataModels", "20741cd6-8df4-4e7d-8a4c-944c8d0c4b7f", "636a803d-d921-410e-8c6c-cde20e9259b0.outputDataModels"];
		const expectedResultsCount = expectedResult.length;
		const result = parser(inputPath);

		it("should return an array of x elements", () => {
			return expect(result.length).toStrictEqual(expectedResultsCount);
		});

		it("should return an array of inputs", () => {
			return expect(result.map((i) => regex.test(i)).reduce( (acc, value) => acc && value, true)).toStrictEqual(true);
		});

		it("should return the expected array result", () => {
			return expect(result).toEqual(expectedResult);
		});
	});

	describe("Nested Properties Input Paths Parsing", () => {
		const inputPath = { property: "{{636a803d-d921-410e-8c6c-cde20e9259b0.inputDataModels.blabla}}", secondProperty: "{{20741cd6-8df4-4e7d-8a4c-944c8d0c4b7f}}", thirdProperty: "{{6fc41d70-a16d-44d8-b1b5-eec0ceffa926.a[5]}}" };
		const expectedResult = ["636a803d-d921-410e-8c6c-cde20e9259b0.inputDataModels.blabla", "20741cd6-8df4-4e7d-8a4c-944c8d0c4b7f", "6fc41d70-a16d-44d8-b1b5-eec0ceffa926.a[5]"];
		const expectedResultsCount = expectedResult.length;
		const result = parser(inputPath);

		it("should return an array of x elements", () => {
			return expect(result.length).toStrictEqual(expectedResultsCount);
		});

		it("should return an array of inputs", () => {
			return expect(result.map((i) => regex.test(i)).reduce( (acc, value) => acc && value, true)).toStrictEqual(true);
		});

		it("should return the expected array result", () => {
			return expect(result).toEqual(expectedResult);
		});
	});

	describe("Arrays Input Paths Parsing", () => {
		const inputPath = ["{{636a803d-d921-410e-8c6c-cde20e9259b0.inputDataModels}}"];
		const expectedResult = ["636a803d-d921-410e-8c6c-cde20e9259b0.inputDataModels"];
		const expectedResultsCount = expectedResult.length;
		const result = parser(inputPath);

		it("should return an array of x elements", () => {
			return expect(result.length).toStrictEqual(expectedResultsCount);
		});

		it("should return an array of inputs", () => {
			return expect(result.map((i) => regex.test(i)).reduce( (acc, value) => acc && value, true)).toStrictEqual(true);
		});

		it("should return the expected array result", () => {
			return expect(result).toEqual(expectedResult);
		});
	});

	describe("Complex Input Paths Parsing", () => {
		const inputPath = { property: "{{636a803d-d921-410e-8c6c-cde20e9259b0.a}} {{636a803d-d921-410e-8c6c-cde20e9259b0.b}}/{{20741cd6-8df4-4e7d-8a4c-944c8d0c4b7f.c[0]}}?something={{636a803d-d921-410e-8c6c-cde20e9259b0.d.e}}" };
		const expectedResult = ["636a803d-d921-410e-8c6c-cde20e9259b0.a", "636a803d-d921-410e-8c6c-cde20e9259b0.b", "20741cd6-8df4-4e7d-8a4c-944c8d0c4b7f.c[0]", "636a803d-d921-410e-8c6c-cde20e9259b0.d.e"];
		const expectedResultsCount = expectedResult.length;
		const result = parser(inputPath);

		it("should return an array of x elements", () => {
			return expect(result.length).toStrictEqual(expectedResultsCount);
		});

		it("should return an array of inputs", () => {
			return expect(result.map((i) => regex.test(i)).reduce( (acc, value) => acc && value, true)).toStrictEqual(true);
		});

		it("should return the expected array result", () => {
			return expect(result).toEqual(expectedResult);
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
		const expectedResult = [
			"636a803d-d921-410e-8c6c-cde20e9259b0.a",
			"636a803d-d921-410e-8c6c-cde20e9259b0.b",
			"20741cd6-8df4-4e7d-8a4c-944c8d0c4b7f.c[0]",
			"636a803d-d921-410e-8c6c-cde20e9259b0.d.e",
			"636a803d-d921-410e-8c6c-cde20e9259b0.f",
			"636a803d-d921-410e-8c6c-cde20e9259b0.g.h",
			"636a803d-d921-410e-8c6c-cde20e9259b0.i[0]",
			"636a803d-d921-410e-8c6c-cde20e9259b0.j",
			"636a803d-d921-410e-8c6c-cde20e9259b0.k.l",
			"636a803d-d921-410e-8c6c-cde20e9259b0.m[0]",
			"636a803d-d921-410e-8c6c-cde20e9259b0.n",
		];

		it("should return the expected array result", () => {
			return expect(parser(inputPath)).toStrictEqual(expectedResult);
		});
	});

	describe("Complex Multiple Properties Array Input Path Parsing", () => {
		const inputPath = ["{{636a803d-d921-410e-8c6c-cde20e9259b0.a}}", ["{{636a803d-d921-410e-8c6c-cde20e9259b0.b}}", "{{20741cd6-8df4-4e7d-8a4c-944c8d0c4b7f.c[0]}}"]];

		const expectedResult = [
			"636a803d-d921-410e-8c6c-cde20e9259b0.a",
			"636a803d-d921-410e-8c6c-cde20e9259b0.b",
			"20741cd6-8df4-4e7d-8a4c-944c8d0c4b7f.c[0]",
		];

		it("should return the expected array result", () => {
			return expect(parser(inputPath)).toStrictEqual(expectedResult);
		});
	});

	describe("Complex Multiple Properties Object Array Input Path Parsing", () => {
		const inputPath = [
			"{{636a803d-d921-410e-8c6c-cde20e9259b0.a}}",
			{
				property: "{{636a803d-d921-410e-8c6c-cde20e9259b0.a}} {{636a803d-d921-410e-8c6c-cde20e9259b0.b}}/{{20741cd6-8df4-4e7d-8a4c-944c8d0c4b7f.c[0]}}?something={{636a803d-d921-410e-8c6c-cde20e9259b0.d.e}}",
				secondProperty: {
					thirdProperty: "{{636a803d-d921-410e-8c6c-cde20e9259b0.f}}",
				}
			}
		];

		const expectedResult = [
			"636a803d-d921-410e-8c6c-cde20e9259b0.a",
			"636a803d-d921-410e-8c6c-cde20e9259b0.b",
			"20741cd6-8df4-4e7d-8a4c-944c8d0c4b7f.c[0]",
			"636a803d-d921-410e-8c6c-cde20e9259b0.d.e",
			"636a803d-d921-410e-8c6c-cde20e9259b0.f",
		];

		it("should return the expected array result", () => {
			return expect(parser(inputPath)).toStrictEqual(expectedResult);
		});
	});
});
