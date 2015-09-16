// simplified version of the actual hero.ts
let nextId = 30;

export class Hero {

	constructor(public name:string, public id?: number) {
			this.id = id || nextId++;
	}

	static setNextId(next:number) {
		nextId = next;
	}
}
