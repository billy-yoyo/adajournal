import { Entry, Prompt, UserPrompt } from "~/models/entry";
import { User } from "~/models/user";

type Matcher<T> = {[key in keyof T]?: T[key] | { $in: T[key][] }}

interface Query<T> {
    where: Matcher<T>;
}

const createMatcher = <T>(column: keyof T, value: any): (row: T) => boolean => {
    if (value?.$in && Array.isArray(value?.$in)) {
        return (row: T) => value.$in.includes(row[column]);
    }

    return (row: T) => row[column] === value;
};

const createFilter = <T>(query: Query<T>): (row: T) => boolean  => {
    const where = Object.entries(query.where).map(([column, value]) => createMatcher(column as keyof T, value));
    return (row: T) => where.every(matcher => matcher(row));
};

const invert = <T>(filter: (row: T) => boolean): (row: T) => boolean => {
    return (row: T) => !filter(row);
};

class Table<T> {
    private name: string;
    private data: T[] = [];
    private autoId: string | undefined;
    private count: number = 1;

    constructor(name: string, autoId?: string | undefined) {
        this.name = name;
        this.autoId = autoId;
    }

    async insert(data: T): Promise<T> {
        let toInsert: T = data;
        if (this.autoId !== undefined) {
            toInsert = { ...data, [this.autoId]: `${this.count++}` };
        }
        this.data.push(toInsert);
        return toInsert;
    }

    async findOne(query: Query<T>): Promise<T | undefined> {
        return this.data.find(createFilter(query));
    }

    async findAll(query: Query<T>): Promise<T[]> {
        return this.data.filter(createFilter(query));
    }

    async delete(query: Query<T>): Promise<void> {
        this.data = this.data.filter(invert(createFilter(query)));
    }
}

export class DB {
    public user: Table<User>;
    public entry: Table<Entry>;
    public prompt: Table<Prompt>;
    public userPrompt: Table<UserPrompt>;

    constructor() {
        this.user = new Table('user', 'id');
        this.entry = new Table('entry', 'id');
        this.prompt = new Table('prompt', 'id');
        this.userPrompt = new Table('user_prompt', 'id');
    }
}
