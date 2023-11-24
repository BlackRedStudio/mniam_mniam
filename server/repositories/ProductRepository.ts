import { and, eq, like, sql } from 'drizzle-orm';

import { TProductStatus } from '@/types/types';

import { DB } from '../helpers/DB';
import {
    productsTable,
    TProduct,
    TProductInsert,
    userProductsTable,
} from '../schemas';

type TFindProduct = {
    id?: string;
    status?: TProductStatus;
    ean?: string;
};

class ProductRepository {
    static async searchByName(name: string) {
        const product = await DB.query.productsTable.findMany({
            where: like(productsTable.name, `%${name}%`),
        });

        return product;
    }

    static async first({ id, status, ean }: TFindProduct) {
        const product = await DB.query.productsTable.findMany({
            where: and(
                id ? eq(productsTable.id, id) : undefined,
                status ? eq(productsTable.status, status) : undefined,
                ean ? eq(productsTable.ean, ean) : undefined,
            ),
        });

        return product;
    }

    static async firstWithUserProducts({ id, status, ean }: TFindProduct) {
        const product = await DB.query.productsTable.findFirst({
            where: and(
                id ? eq(productsTable.id, id) : undefined,
                status ? eq(productsTable.status, status) : undefined,
                ean ? eq(productsTable.ean, ean) : undefined,
            ),
            with: {
                userProducts: {
                    extras: {
                        price: sql<string>`cast(${userProductsTable.price} as CHAR)`.as(
                            'price',
                        ),
                    },
                },
            },
        });

        return product;
    }

    static async update(id: string, product: TProduct) {
        const res = await DB.update(productsTable)
            .set(product)
            .where(eq(productsTable.id, id));

        return res;
    }

    static async insert(product: Omit<TProductInsert, 'id'>) {
        const id = crypto.randomUUID();

        await DB.insert(productsTable).values({
            id,
            ...product,
        });

        return id;
    }

    static async delete(id: string) {
        await DB.delete(productsTable).where(eq(productsTable.id, id));
    }
}

export default ProductRepository;
