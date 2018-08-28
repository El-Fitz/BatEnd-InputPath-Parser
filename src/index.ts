import XRegExp from "xregexp";
const inputPathRegex = /((([A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12})|(FlowExecutionInput))(((\.[a-zA-Z_0-9]*)|(\[\d{0,4}\]))+?)*)(?=}})/gi;
const uuidV4Regex = /(([A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12})|(FlowExecutionInput))/gi;

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

export function listRequiredInputs(inputPath: InputPathType): string[] {
	const inputPathCopy = JSON.parse(JSON.stringify(inputPath));
	return listUniqueInputPathItemsMatchingRegex(inputPathCopy, inputPathRegex);
}

export function listRequiredInputStepsIds(inputPath: InputPathType): string[] {
	const inputPathCopy = JSON.parse(JSON.stringify(inputPath));
	return listUniqueInputPathItemsMatchingRegex(inputPathCopy, uuidV4Regex);
}

export function parsedInputPath(inputPath: InputPathType): InputPathType {
	const inputPathCopy = JSON.parse(JSON.stringify(inputPath));
	if (Array.isArray(inputPathCopy)) {
		return inputPathCopy.map(parsedInputPath);
	} else if (typeof inputPathCopy === "string") {
		return parseStringInputPath(inputPathCopy);
	} else if (typeof inputPathCopy === "object") {
		const result: InputPathType = {};
		Object.keys(inputPath).forEach((key) => {
			result[key] = parsedInputPath(inputPathCopy[key]); // <- recursive call
		});
		return result;
	} else {
		throw new Error("Input Path must be an Object, an Array or a String. Is " + typeof inputPath);
	}
}

function listUniqueInputPathItemsMatchingRegex(inputPath: InputPathType, regex: RegExp): string[] {
	return inputPathToStringArray(inputPath).checkIfValidInputPathParserArray().reduce((acc: string[], value: string) => acc.concat(XRegExp.match(value, regex, "all")), []).checkIfValidInputPathParserArray().unique();
}

// TODO: Properly parse the string Input Path instead of listing it's required inputs
function parseStringInputPath(stringInputPath: string) {
	if (stringInputPath === null || stringInputPath === undefined || stringInputPath === "") {
		throw new Error("Invalid Input Path");
	}
	const result = XRegExp.match(stringInputPath, inputPathRegex, "all");
	return (result.length === 1) ? result[0] : result;
}

function inputPathToStringArray(inputPath: InputPathType, result: string[] = []): string[] {
	if (Array.isArray(inputPath)) {
		return inputPathArrayToStringArray(inputPath, result);
	} else if (typeof inputPath === "string") {
		return result.concat(inputPath);
	} else if (typeof inputPath === "object") {
		return result.concat(inputPathObjectToStringArray(inputPath));
	} else {
		throw new Error("Input Path must be an Object, an Array or a String. Is " + typeof inputPath);
	}
}

function inputPathArrayToStringArray(array: InputPathArrayType, result: string[] = []): string[] {
	const value = array.shift();
	if (value === undefined) {
		return result;
	} else if (typeof value === "string") {
		return inputPathToStringArray(array, result.concat(value));
	} else if (value instanceof Array) {
		return inputPathToStringArray(value, result.concat(inputPathToStringArray(array)));
	} else {
		return result.concat(inputPathObjectToStringArray(value));
	}
}

// How do we handle fucking objects ?
function inputPathObjectToStringArray(obj: InputPathObjectType): string[] {
	return Object.values(obj).reduce((acc: string[], value: InputPathType) => inputPathToStringArray(value, acc), []);
}
