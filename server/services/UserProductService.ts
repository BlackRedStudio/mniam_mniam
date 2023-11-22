import { and, eq } from 'drizzle-orm';
import moment from 'moment';

import { TProductStatistics } from '@/types/types';

import { DB } from '../helpers/DB';
import { TUserProduct, userProductsTable } from '../schema';

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

    static async changeDraftToActive(productId: string) {
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

    static async deleteByProductId(productId: string) {
        await DB.delete(userProductsTable).where(
            eq(userProductsTable.productId, productId),
        );
    }
}

export default UserProductService;
