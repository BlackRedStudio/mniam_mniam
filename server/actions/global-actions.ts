'use server'

import fs from 'fs';
import CriticalError from "../errors/CriticalError";
import UserRepository from "../repositories/UserRepository";
import AccountRepository from "../repositories/AccountRepository";
import ProductRepository from "../repositories/ProductRepository";
import UserProductRepository from "../repositories/UserProductRepository";
import TicketRepository from "../repositories/TicketRepository";
import { TUser, TProduct, TUserProduct, TTicket } from "../schemas";

export async function importDB__Action() {
    try {
        // const data = fs.readFileSync('./users.json', 'utf-8');
        // const users = JSON.parse(data);
        // const accountsData = fs.readFileSync('./accounts.json', 'utf-8');
        // const accounts = JSON.parse(accountsData);
        // const productsData = fs.readFileSync('./products.json', 'utf-8');
        // const products = JSON.parse(productsData);
        // const userProductsData = fs.readFileSync('./userProducts.json', 'utf-8');
        // const userProducts = JSON.parse(userProductsData);
        // const ticketsData = fs.readFileSync('./tickets.json', 'utf-8');
        // const tickets = JSON.parse(ticketsData);

        // const usersMapped = users.map((user: TUser) => {
        // 	return {
        // 		...user,
        //         emailVerified: user.emailVerified && new Date(user.emailVerified),
        //         dateCreated: user.dateCreated && new Date(user.dateCreated),
        // 	};
        // });

        // const productsMapped = products.map((product: TProduct) => {
        // 	return {
        // 		...product,
        //         dateCreated: product.dateCreated && new Date(product.dateCreated),
        //         dateUpdated: product.dateUpdated && new Date(product.dateUpdated),
        // 	};
        // });

        // const userProductsMapped = userProducts.map((userProduct: TUserProduct) => {
        // 	return {
        // 		...userProduct,
        //         dateCreated: userProduct.dateCreated && new Date(userProduct.dateCreated),
        //         dateUpdated: userProduct.dateUpdated && new Date(userProduct.dateUpdated),
        // 	};
        // });

        // const ticketsMapped = tickets.map((ticket: TTicket) => {
        // 	return {
        // 		...ticket,
        //         dateCreated: ticket.dateCreated ? new Date(ticket.dateCreated) : new Date(),
        // 	};
        // });

        // await UserRepository.insertRaw(usersMapped);
        // await AccountRepository.insertRaw(accounts);
        // await ProductRepository.insertRaw(productsMapped);
        // await UserProductRepository.insertRaw(userProductsMapped);
        // await TicketRepository.insertRaw(ticketsMapped);

    } catch (e) {
        return { ...new CriticalError(e) };
    }
}
