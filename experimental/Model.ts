import { sql } from 'drizzle-orm';
import { MySqlTableWithColumns, TableConfig } from 'drizzle-orm/mysql-core';

import { DB } from '../server/helpers/DB';

type TEntity = {
    id: string,
}

class Entity<T extends TableConfig, Instance extends TEntity> {

    #table: MySqlTableWithColumns<T>;

    data: Instance;

    id: string;

    constructor(table: MySqlTableWithColumns<T>, data: Instance) {
        this.#table = table;

        this.id = data.id;
        this.data = data;
    }

    async save() {
        const res = DB.update(this.#table).set(this.data).where(sql`id = ${this.id}`);
        return res;
    }
}

class Model<T extends TableConfig, Instance extends TEntity> {
    #table: MySqlTableWithColumns<T>;

    data: Instance;

    constructor(table: MySqlTableWithColumns<T>) {
        this.#table = table;
    }

    async find(id: string) {
        const res = await DB.select()
            .from(this.#table)
            .where(sql`id = ${id}`)
            .limit(1);

        if(res) {
            this.data = res[0] as Instance;
        }
        
        return new Entity<T, Instance>(this.#table, this.data);
    }

}

export default Model;
