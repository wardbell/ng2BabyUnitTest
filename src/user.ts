// imagine this is the result of a login
export class User {
	constructor(private _name: string) { }
	get name() { return this._name}
};