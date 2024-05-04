import { and, eq, inArray } from 'drizzle-orm';

import { TUserProductStatus } from '@/types/types';

import { DB } from '../helpers/DB';
import { TUserProductInsert, userProductsTable } from '../schemas';

type TFindUserProduct = {
    id?: string;
    productId?: string;
    userId?: string;
    statuses?: TUserProductStatus[];
};

class UserProductRepository {
    static async first({ id, productId, userId, statuses }: TFindUserProduct) {
        const userProduct = await DB.query.userProductsTable.findFirst({
            where: and(
                id ? eq(userProductsTable.id, id) : undefined,
                productId
                    ? eq(userProductsTable.productId, productId)
                    : undefined,
                userId ? eq(userProductsTable.userId, userId) : undefined,
                statuses
                    ? inArray(userProductsTable.status, statuses)
                    : undefined,
            ),
        });

        return userProduct;
    }

    static async many({ id, productId, userId, statuses }: TFindUserProduct) {
        const userProductsList = await DB.query.userProductsTable.findMany({
            where: and(
                id ? eq(userProductsTable.id, id) : undefined,
                productId
                    ? eq(userProductsTable.productId, productId)
                    : undefined,
                userId ? eq(userProductsTable.userId, userId) : undefined,
                statuses
                    ? inArray(userProductsTable.status, statuses)
                    : undefined,
            ),
        });

        return userProductsList;
    }

    static async manyWithProduct({
        id,
        productId,
        userId,
        statuses,
    }: TFindUserProduct) {
        const userProductsList = await DB.query.userProductsTable.findMany({
            where: and(
                id ? eq(userProductsTable.id, id) : undefined,
                productId
                    ? eq(userProductsTable.productId, productId)
                    : undefined,
                userId ? eq(userProductsTable.userId, userId) : undefined,
                statuses
                    ? inArray(userProductsTable.status, statuses)
                    : undefined,
            ),
            with: {
                product: true,
            },
            orderBy: (userProductsTable, { desc }) => [
                desc(userProductsTable.dateUpdated),
            ],
        });

        return userProductsList;
    }

    static async update(
        id: string,
        userProductValues: Omit<TUserProductInsert, 'id'>,
    ) {
        await DB.update(userProductsTable)
            .set(userProductValues)
            .where(eq(userProductsTable.id, id));
    }

    static async insert(userProductValues: Omit<TUserProductInsert, 'id'>) {
        const id = crypto.randomUUID();

        await DB.insert(userProductsTable).values({
            id,
            ...userProductValues,
        });
    }

    static async makeActive(productId: string) {
        DB.transaction(async tx => {
            // update all userProducts draft statuses to invisible
            await tx
                .update(userProductsTable)
                .set({
                    status: 'invisible',
                })
                .where(
                    and(
                        eq(userProductsTable.productId, productId),
                        eq(userProductsTable.status, 'draft'),
                    ),
                );

            // update all userProducts draftVisible statuses to visible
            await tx
                .update(userProductsTable)
                .set({
                    status: 'visible',
                })
                .where(
                    and(
                        eq(userProductsTable.productId, productId),
                        eq(userProductsTable.status, 'draftVisible'),
                    ),
                );
        });
    }

    static async makeInvisible(id: string, userId: string) {
        const res = await DB.update(userProductsTable)
            .set({
                status: 'invisible',
            })
            .where(
                and(
                    eq(userProductsTable.id, id),
                    eq(userProductsTable.userId, userId),
                ),
            );

        return res;
    }

    static async deleteByProductId(productId: string) {
        await DB.delete(userProductsTable).where(
            eq(userProductsTable.productId, productId),
        );
    }
}

export default UserProductRepository;
