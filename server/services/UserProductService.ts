import { TProductStatistics } from '@/types/types';

import { TUserProduct } from '../schemas';

class UserProductService {
    // get average rating/price/count
    static getStatistics(userProducts: TUserProduct[]): TProductStatistics {
        let peopleCount = userProducts.length ?? 0;
        let rating = 0;
        let price = 0;

        userProducts.forEach(product => {
            rating += product.rating;
            price += product.price;
        });

        const averageRating = (rating / peopleCount).toFixed(2);
        const averagePrice = (price / peopleCount).toFixed(2);

        return {
            averageRating,
            averagePrice,
            peopleCount,
        };
    }
}

export default UserProductService;
