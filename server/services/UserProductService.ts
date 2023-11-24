import moment from 'moment';

import { TProductStatistics } from '@/types/types';

import { TUserProduct } from '../schemas';

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
}

export default UserProductService;
