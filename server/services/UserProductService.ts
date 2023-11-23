import { and, eq, inArray } from 'drizzle-orm';
import moment from 'moment';

import { TProductStatistics, TUserProductStatus } from '@/types/types';

import { DB } from '../helpers/DB';
import { TUserProduct, TUserProductInsert, userProductsTable } from '../schema';

class UserProductService {
    // get average rating/price/count
    static getStatistics(userProducts: TUserProduct[]): TProductStatistics {
        let peopleRateCount = userProducts.length ?? 0;
        let peoplePriceCount = 0;
        let rating = 0;
        let price = 0;

        userProducts.forEach(product => {
            rating += product.rating;

            // price rate should be younger than 180 days
            const halfYearAgo = moment().subtract(180, 'days');

            if (moment(product.dateUpdated) > halfYearAgo) {
                peoplePriceCount++;
                price += parseFloat(product.price);
            }
        });

        const averageRating = (rating / peopleRateCount).toFixed(2);
        const averagePrice = (price / peoplePriceCount).toFixed(2);

        return {
            averageRating,
            averagePrice,
            peopleRateCount,
        };
    }

    static async findFirstUserProduct(productId: string, userId: string) {
        const userProduct = await DB.query.userProductsTable.findFirst({
            where: and(
                eq(userProductsTable.productId, productId),
                eq(userProductsTable.userId, userId),
            ),
        });

        return userProduct;
    }

    static async findUserProductsByStatus(userId: string, statuses: TUserProductStatus[]) {

        const userProductsList = await DB.query.userProductsTable.findMany({
            where: and(
                eq(userProductsTable.userId, userId),
                inArray(userProductsTable.status, statuses),
            ),
            with: {
                product: true,
            },
        });

        return userProductsList;
    }

    static async update(id: string, userProductValues: Omit<TUserProductInsert, 'id'>) {
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

    static async activateProducts(productId: string) {
        // update all userProducts draft statuses to invisible
        await DB.update(userProductsTable)
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
        await DB.update(userProductsTable)
            .set({
                status: 'visible',
            })
            .where(
                and(
                    eq(userProductsTable.productId, productId),
                    eq(userProductsTable.status, 'draftVisible'),
                ),
            );
    }

    static async changeVisibleToInvisible(productId: string, userId: string) {
        const res = await DB.update(userProductsTable)
            .set({
                status: 'invisible',
            })
            .where(
                and(
                    eq(userProductsTable.id, productId),
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

export default UserProductService;
