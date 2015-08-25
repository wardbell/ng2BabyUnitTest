let nextId = 1;

export class Hero {
	constructor(private _name: string, private _id?: number) {
		if (_id == null) {
			this._id = nextId++;
		}
	}
	get id() { return this._id; }
	get isNullo() { return this._id === 0; }
	get name() { return this._name; }
	set name(value:string) { this._name = value; }

	static get nullo() { return nullo; }
}

var nullo = new Hero('Noman', 0);
