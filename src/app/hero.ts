let nextId = 1;

interface IHeroOptions {
	id?: number, name?: string, power?: string, alterEgo?: string
}

export class Hero {

	constructor(options: string | IHeroOptions, private _id?: number) {
		if (typeof options === 'string') {
			name = options;
		} else {
			this._id = options.id;
			this.name = options.name || '';
			this.power = options.power;
			this.alterEgo = options.alterEgo;
		}
		if (this._id == null) {
			this._id = nextId++;
		}
	}
	get id() { return this._id; }
	name: string;
	power: string;
	alterEgo:string;

	clone() {
		return new Hero(this);
	}
}