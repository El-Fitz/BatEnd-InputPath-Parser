const chai = require("chai");
const expect = chai.expect;

// Test suite
describe("Input Path Parser - Required Inputs IDs List - Tests", function () {
	const regex = /[A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12}/i;
	const parser = require("../index").listRequiredInputStepsIds;

	describe("Empty Input Path Parsing", function () {
		let inputPath = {property: ""};
		let expectedResult = "Invalid Input Path";

		it("should throw an error", () => {
			expect(() => parser(inputPath)).to.throw(Error);
		});

		it("should throw a specific error", () => {
			expect(() => parser(inputPath)).to.throw(expectedResult);
		});
	});

	describe("Simple Input Paths Parsing", function () {
		let inputPath = "{{636a803d-d921-410e-8c6c-cde20e9259b0.inputDataModels}}";
		let expectedResult = ["636a803d-d921-410e-8c6c-cde20e9259b0"];
		let expectedResultsCount = expectedResult.length;

		it("should not throw an error", () => {
			expect(() => parser(inputPath)).to.not.throw();
		});

		it("should return an array of 2 elements", () => {
			expect(parser(inputPath).length).to.be.equal(expectedResultsCount);
		});

		it("should return an array of UUIDs v4", () => {
			parser(inputPath).every(i => expect(regex.test(i)).to.be.equal(true));
		});

		it("should return the expected array result", () => {
			expect(parser(inputPath)).to.be.deep.equal(expectedResult);
		});
	});

	describe("Simple Object Input Paths Parsing", function () {
		let inputPath = { property: "{{636a803d-d921-410e-8c6c-cde20e9259b0.inputDataModels}}", secondProperty: "{{20741cd6-8df4-4e7d-8a4c-944c8d0c4b7f}}"};
		let expectedResult = ["636a803d-d921-410e-8c6c-cde20e9259b0", "20741cd6-8df4-4e7d-8a4c-944c8d0c4b7f"];
		let expectedResultsCount = expectedResult.length;

		it("should not throw an error", () => {
			expect(() => parser(inputPath)).to.not.throw();
		});

		it("should return an array of 2 elements", () => {
			expect(parser(inputPath).length).to.be.equal(expectedResultsCount);
		});

		it("should return an array of UUIDs v4", () => {
			parser(inputPath).every(i => expect(regex.test(i)).to.be.equal(true));
		});

		it("should return the expected array result", () => {
			expect(parser(inputPath)).to.be.deep.equal(expectedResult);
		});
	});

	describe("Simple Object Input Paths With Duplicates Parsing", function () {
		let inputPath = { property: "{{636a803d-d921-410e-8c6c-cde20e9259b0.inputDataModels}}", secondProperty: "{{20741cd6-8df4-4e7d-8a4c-944c8d0c4b7f}}", thirdProperty: "{{636a803d-d921-410e-8c6c-cde20e9259b0.outputDataModels}}"};
		let expectedResult = ["636a803d-d921-410e-8c6c-cde20e9259b0", "20741cd6-8df4-4e7d-8a4c-944c8d0c4b7f"];
		let expectedResultsCount = expectedResult.length;

		it("should not throw an error", () => {
			expect(() => parser(inputPath)).to.not.throw();
		});

		it("should return an array of 2 elements", () => {
			expect(parser(inputPath).length).to.be.equal(expectedResultsCount);
		});

		it("should return an array of UUIDs v4", () => {
			parser(inputPath).every(i => expect(regex.test(i)).to.be.equal(true));
		});

		it("should return the expected array result", () => {
			expect(parser(inputPath)).to.be.deep.equal(expectedResult);
		});
	});

	describe("Nested Properties Input Paths Parsing", function () {
		let inputPath = { property: "{{636a803d-d921-410e-8c6c-cde20e9259b0.inputDataModels.blabla}}", secondProperty: "{{20741cd6-8df4-4e7d-8a4c-944c8d0c4b7f}}", thirdProperty: "{{6fc41d70-a16d-44d8-b1b5-eec0ceffa926.a[5]}}" };
		let expectedResult = ["636a803d-d921-410e-8c6c-cde20e9259b0", "20741cd6-8df4-4e7d-8a4c-944c8d0c4b7f", "6fc41d70-a16d-44d8-b1b5-eec0ceffa926"];
		let expectedResultsCount = expectedResult.length;

		it("should not throw an error", () => {
			expect(() => parser(inputPath)).to.not.throw();
		});

		it("should return an array of x elements", () => {
			expect(parser(inputPath).length).to.be.equal(expectedResultsCount);
		});

		it("should return an array of inputs", () => {
			parser(inputPath).every(i => expect(regex.test(i)).to.be.equal(true));
		});

		it("should return the expected array result", () => {
			expect(parser(inputPath)).to.be.deep.equal(expectedResult);
		});
	});

	describe("Arrays Input Path Parsing", function () {
		let inputPath = ["{{636a803d-d921-410e-8c6c-cde20e9259b0.inputDataModels}}"];
		let expectedResult = ["636a803d-d921-410e-8c6c-cde20e9259b0"];
		let expectedResultsCount = expectedResult.length;

		it("should not throw an error", () => {
			expect(() => parser(inputPath)).to.not.throw();
		});

		it("should return an array of x elements", () => {
			expect(parser(inputPath).length).to.be.equal(expectedResultsCount);
		});

		it("should return an array of inputs", () => {
			parser(inputPath).every(i => expect(regex.test(i)).to.be.equal(true));
		});

		it("should return the expected array result", () => {
			expect(parser(inputPath)).to.be.deep.equal(expectedResult);
		});
	});

	describe("Complex Input Path Parsing", function () {
		let inputPath = { property: "{{636a803d-d921-410e-8c6c-cde20e9259b0.a}} {{636a803d-d921-410e-8c6c-cde20e9259b0.b}}/{{20741cd6-8df4-4e7d-8a4c-944c8d0c4b7f.c[0]}}?something={{636a803d-d921-410e-8c6c-cde20e9259b0.d.e}}" };
		let expectedResult = ["636a803d-d921-410e-8c6c-cde20e9259b0", "20741cd6-8df4-4e7d-8a4c-944c8d0c4b7f"];
		let expectedResultsCount = expectedResult.length;

		it("should not throw an error", () => {
			expect(() => parser(inputPath)).to.not.throw();
		});

		it("should return an array of x elements", () => {
			expect(parser(inputPath).length).to.be.equal(expectedResultsCount);
		});

		it("should return an array of inputs", () => {
			parser(inputPath).every(i => expect(regex.test(i)).to.be.equal(true));
		});

		it("should return the expected array result", () => {
			expect(parser(inputPath)).to.be.deep.equal(expectedResult);
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
		let expectedResult = [
			"636a803d-d921-410e-8c6c-cde20e9259b0",
			"20741cd6-8df4-4e7d-8a4c-944c8d0c4b7f",
		];

		it("should not throw an error", () => {
			expect(() => parser(inputPath)).to.not.throw();
		});

		it("should return the expected array result", () => {
			expect(parser(inputPath)).to.be.deep.equal(expectedResult);
		});
	});
});
