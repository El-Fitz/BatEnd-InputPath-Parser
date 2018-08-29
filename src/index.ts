import XRegExp from "xregexp";
// const inputPathRegex = /((([A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12})|(FlowExecutionInput))(((\.[a-zA-Z_0-9]*)|(\[\d{0,4}\]))+?)*)(?=}})/gi;
// const uuidV4Regex = /(([A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12})|(FlowExecutionInput))/gi;

type InputPathType = string | InputPathArrayType | InputPathObjectType;
interface InputPathObjectType {
	[key: string]: InputPathType;
}
interface InputPathArrayType extends Array<InputPathType> { }

/* tslint:disable:no-unsafe-any */
declare global {
	interface Array<T> {
		unique(): T[];
		checkIfValidInputPathParserArray(): T[];
	}
}

// MARK: Helper functions
Array.prototype.unique = function() {
	return Array.from(new Set(this));
};

Array.prototype.checkIfValidInputPathParserArray = function() {
	if (this === null || this === undefined || !(Array.isArray(this)) || this.length === 0 || this.includes(undefined) || this.includes("undefined") || this.includes("")) {
		throw new Error("Invalid Input Path");
	}
	return this;
};
/* tslint:enable:no-unsafe-any */

export class InputPathParser {
	public readonly inputPathRegex: RegExp;
	public readonly itemIdRegex: RegExp;

	constructor(inputPathRegex: RegExp, itemIdRegex: RegExp) {
		this.inputPathRegex = inputPathRegex;
		this.itemIdRegex = itemIdRegex;
	}

	public listRequiredInputs(inputPath: InputPathType): string[] {
		// tslint:disable-next-line:no-unsafe-any
		const inputPathCopy: InputPathType = JSON.parse(JSON.stringify(inputPath));
		return this.listUniqueInputPathItemsMatchingRegex(inputPathCopy, this.inputPathRegex);
	}

	public listRequiredInputStepsIds(inputPath: InputPathType): string[] {
		// tslint:disable-next-line:no-unsafe-any
		const inputPathCopy: InputPathType = JSON.parse(JSON.stringify(inputPath));
		return this.listUniqueInputPathItemsMatchingRegex(inputPathCopy, this.itemIdRegex);
	}

	// TODO: Figure out why `this` is lost in the recursion from the `object` case (to see what I mean, remove second parameter from call to parsedInputPath and run tests)
	public parsedInputPath(inputPath: InputPathType, inputPathParser: InputPathParser = this): InputPathType {
		// tslint:disable-next-line:no-unsafe-any
		const inputPathCopy: InputPathType = JSON.parse(JSON.stringify(inputPath));
		if (Array.isArray(inputPathCopy)) {
			return inputPathCopy.map((item) => inputPathParser.parsedInputPath(item, inputPathParser));
		} else if (typeof inputPathCopy === "string") {
			return inputPathParser.parseStringInputPath(inputPathCopy);
		} else if (typeof inputPathCopy === "object") {
			const result: InputPathType = {};
			Object.keys(inputPath).forEach((key) => {
				result[key] = inputPathParser.parsedInputPath(inputPathCopy[key], inputPathParser); // <- recursive call
			});
			return result;
		} else {
			throw new Error("Input Path must be an Object, an Array or a String. Is " + typeof inputPath);
		}
	}

	private listUniqueInputPathItemsMatchingRegex(inputPath: InputPathType, regex: RegExp): string[] {
		return this.inputPathToStringArray(inputPath).checkIfValidInputPathParserArray().reduce((acc: string[], value: string) => acc.concat(XRegExp.match(value, regex, "all")), []).checkIfValidInputPathParserArray().unique();
	}

	// TODO: Properly parse the string Input Path instead of listing it's required inputs
	private parseStringInputPath(stringInputPath: string) {
		if (stringInputPath === null || stringInputPath === undefined || stringInputPath === "") {
			throw new Error("Invalid Input Path");
		}
		const result = XRegExp.match(stringInputPath, this.inputPathRegex, "all");
		return (result.length === 1) ? result[0] : result;
	}

	private inputPathToStringArray(inputPath: InputPathType, result: string[] = []): string[] {
		if (Array.isArray(inputPath)) {
			return this.inputPathArrayToStringArray(inputPath, result);
		} else if (typeof inputPath === "string") {
			return result.concat(inputPath);
		} else if (typeof inputPath === "object") {
			return result.concat(this.inputPathObjectToStringArray(inputPath));
		} else {
			throw new Error("Input Path must be an Object, an Array or a String. Is " + typeof inputPath);
		}
	}

	private inputPathArrayToStringArray(array: InputPathArrayType, result: string[] = []): string[] {
		const value = array.shift();
		if (value === undefined) {
			return result;
		} else if (typeof value === "string") {
			return this.inputPathToStringArray(array, result.concat(value));
		} else if (value instanceof Array) {
			return this.inputPathToStringArray(value, result.concat(this.inputPathToStringArray(array)));
		} else {
			return result.concat(this.inputPathObjectToStringArray(value));
		}
	}

	private inputPathObjectToStringArray(obj: InputPathObjectType): string[] {
		return Object.values(obj).reduce((acc: string[], value: InputPathType) => this.inputPathToStringArray(value, acc), []);
	}
}
