/**
 * @file API handlers for Transaction endpoints.
 * @author Si-Wei Yang
 */

import * as db from '../models/transaction.js';
import sql from 'mssql';

/** @type {import('@koa/router').Middleware} */
export const createTransaction = async (ctx) => {
	const transaction = ctx.request.body;
	if (ctx.session.user) {
		transaction.updatedBy = ctx.session.user.id;
	}

	try {
		const id = await db.createTransaction(ctx.db, transaction);
		ctx.body = { id };
		ctx.status = 201;
	} catch (e) {
		if (e instanceof sql.RequestError) {
			ctx.status = 400;
		}
	}
};

/** @type {import('@koa/router').Middleware} */
export const getTransactionById = async (ctx) => {
	try {
		const transaction = await db.getTransactionById(ctx.db, ctx.params.id);
		if (transaction == null) {
			ctx.status = 404;
			return;
		}

		ctx.body = transaction;
	} catch (e) {
		if (e instanceof sql.RequestError) {
			ctx.status = 404;
		}
	}
};

/** @type {import('@koa/router').Middleware} */
export const getTransactions = async (ctx) => {
	try {
		ctx.body = await db.getTransactions(ctx.db, {
			accountId: ctx.query.accountId,
		});
	} catch (e) {
		if (e instanceof sql.RequestError) {
			ctx.status = 404;
		}
	}
};

/** @type {import('@koa/router').Middleware} */
export const updateTransactionById = async (ctx) => {
	try {
		const transaction = {
			...ctx.request.body,
			updatedBy: ctx.session.user.id,
		};

		await db.updateTransactionById(ctx.db, ctx.params.id, transaction);
		ctx.status = 204;
	} catch (e) {
		if (e instanceof sql.RequestError) {
			ctx.status = 404;
		}
	}
};

/** @type {import('@koa/router').Middleware} */
export const deleteTransactionById = async (ctx) => {
	try {
		await db.deleteTransactionById(ctx.db, ctx.params.id);
		ctx.status = 204;
	} catch (e) {
		if (e instanceof sql.RequestError) {
			ctx.status = 404;
		}
	}
};
