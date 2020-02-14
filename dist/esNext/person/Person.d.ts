export interface IPerson {
    name: string;
    age: number;
}
export declare class Person {
    private name;
    private age;
    constructor(name: string, age: number);
    getName(): string;
    getAge(): number;
    get(): IPerson;
    console(): void;
}
