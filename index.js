const XRegExp = require("xregexp");
const inputPathRegex = /((([A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12})|(FlowExecutionInput))(((\.[a-zA-Z_0-9]*)|(\[\d{0,4}\]))+?)*)(?=}})/gi;
const uuidV4Regex = /(([A-F\d]{8}-[A-F\d]{4}-4[A-F\d]{3}-[89AB][A-F\d]{3}-[A-F\d]{12})|(FlowExecutionInput))/gi;

exports.listRequiredInputs = (inputPath) => {
	return inputPathToArray(inputPath).checkIfValidInputPathParserArray().map((value) => XRegExp.match(value, inputPathRegex, "all")).flatDeep().checkIfValidInputPathParserArray().unique();
};

exports.listRequiredInputStepsIds = (inputPath) => {
	return inputPathToArray(inputPath).checkIfValidInputPathParserArray().map((value) => XRegExp.match(value, uuidV4Regex, "all")).flatDeep().checkIfValidInputPathParserArray().unique();
};

exports.parsedInputPath = (inputPath) => {
	if (Array.isArray(inputPath)) {
		return inputPath.map((item) => exports.parsedInputPath(item));
	} else if (typeof inputPath === "string") {
		return parseStringInputPath(inputPath);
	} else if (typeof inputPath === "object") {
		var result = {};
		Object.keys(inputPath).forEach(function(key) {
			result[key] = exports.parsedInputPath(inputPath[key]); // <- recursive call
		});
		return result;
	} else {
		console.log("Type of inputPath: ", typeof inputPath);
		throw new Error("Input Path must be an Object, an Array or a String");
	}
};

//TODO: Properly parse the string Input Path instead of listing it's required inputs
function parseStringInputPath(stringInputPath) {
	if (stringInputPath === null || stringInputPath === "undefined" || stringInputPath === "" || (Array.isArray(stringInputPath && (stringInputPath.length === 0 || stringInputPath.includes(null) || stringInputPath.includes("undefined") || stringInputPath.includes(""))))) {
		throw new Error("Invalid Input Path");
	}
	let result = XRegExp.match(stringInputPath, inputPathRegex, "all");
	return (result.length === 1) ? result[0] : result;
}

//MARK: Helper functions
Array.prototype.flatDeep = function() {
	return this.reduce((acc, val) => Array.isArray(val) ? acc.concat(val.flatDeep()) : acc.concat(val), []);
};

Array.prototype.checkIfValidInputPathParserArray = function(){
	if (this === null || this === "undefined" || !(Array.isArray(this)) || this.length === 0 || this.includes(null) || this.includes("undefined") || this.includes("")) {
		throw new Error("Invalid Input Path");
	}
	return this;
};

Array.prototype.unique = function() {
	return Array.from(new Set(this));
};

function inputPathToArray(inputPath) {
	if (Array.isArray(inputPath)) {
		return inputPath;
	} else if (typeof inputPath === "string") {
		return [inputPath];
	} else if (typeof inputPath === "object") {
		return toArray(inputPath);
	} else {
		console.log("Type of inputPath: ", typeof inputPath);
		throw new Error("Input Path must be an Object, an Array or a String");
	}
}

function toArray(obj) {
	var result = [];
	for (const prop in obj) {
		const value = obj[prop];
		if (typeof value === "object") {
			result = result.concat(toArray(value)); // <- recursive call
		} else {
			result.push(value);
		}
	}
	return result;
}