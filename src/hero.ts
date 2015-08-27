let nextId = 1;

export class Hero {
	constructor(private _name: string, private _id?: number) {
		if (_id == null) {
			this._id = nextId++;
		}
	}
	get id() { return this._id; }
	get name() { return this._name; }
	set name(value:string) { this._name = value; }
}
