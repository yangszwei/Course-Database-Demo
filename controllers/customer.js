/**
 * @file API handlers for Customer endpoints.
 * @author Si-Wei Yang
 */

import * as db from '../models/customer.js';
import sql from 'mssql';

/** @type {import('@koa/router').Middleware} */
export const createCustomer = async (ctx) => {
	const customer = {
		...ctx.request.body,
		updatedBy: ctx.session.user.id,
	};

	try {
		const id = await db.createCustomer(ctx.db, customer);
		ctx.body = { id };
		ctx.status = 201;
	} catch (e) {
		if (e instanceof sql.RequestError) {
			ctx.status = 400;
		}
	}
};

/** @type {import('@koa/router').Middleware} */
export const signIn = async (ctx) => {
	try {
		const profile = await db.authenticateCustomer(ctx.db, ctx.request.body);
		if (!profile) {
			ctx.status = 401;
			return;
		}

		ctx.session.customer = profile;
		ctx.body = profile;
	} catch (e) {
		if (e instanceof sql.RequestError) {
			ctx.status = 400;
		}
	}
};

/** @type {import('@koa/router').Middleware} */
export const getSession = async (ctx) => {
	ctx.body = {
		isSignedIn: !!ctx.session.customer,
		customer: ctx.session.customer,
	};
};

/** @type {import('@koa/router').Middleware} */
export const signOut = async (ctx) => {
	ctx.session.customer = null;
	ctx.body = { success: true };
};

/** @type {import('@koa/router').Middleware} */
export const getCustomerById = async (ctx) => {
	try {
		const customer = await db.getCustomerById(ctx.db, ctx.params.id);
		if (customer == null) {
			ctx.status = 404;
			return;
		}

		ctx.body = customer;
	} catch (e) {
		if (e instanceof sql.RequestError) {
			ctx.status = 404;
		}
	}
};

/** @type {import('@koa/router').Middleware} */
export const deleteCustomerById = async (ctx) => {
	try {
		await db.deleteCustomerById(ctx.db, ctx.params.id);
		ctx.status = 204;
	} catch (e) {
		if (e instanceof sql.RequestError) {
			ctx.status = 404;
		}
	}
};
