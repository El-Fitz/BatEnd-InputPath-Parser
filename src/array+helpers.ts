export { };
/* tslint:disable:no-unsafe-any */
declare global {
	interface Array<T> {
		unique(): T[];
		flatDeep(): T[];
		checkIfValidInputPathParserArray(): T[];
	}
}

// MARK: Helper functions
Array.prototype.unique = function() {
	return Array.from(new Set(this));
};

Array.prototype.flatDeep = function() {
	return this.reduce((acc, val) => Array.isArray(val) ? acc.concat(val.flatDeep()) : acc.concat(val), []);
};

Array.prototype.checkIfValidInputPathParserArray = function() {
	if (this === null || this === undefined || !(Array.isArray(this)) || this.length === 0 || this.includes(undefined) || this.includes("undefined") || this.includes("")) {
		throw new Error("Invalid Input Path");
	}
	return this;
};
/* tslint:enable:no-unsafe-any */
