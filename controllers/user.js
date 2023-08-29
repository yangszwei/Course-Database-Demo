/**
 * @file API handlers for System User endpoints.
 * @author Si-Wei Yang
 */

import * as db from '../models/user.js';
import sql from 'mssql';

/** @type {import('@koa/router').Middleware} */
export const createUser = async (ctx) => {
	try {
		const id = await db.createUser(ctx.db, ctx.request.body);
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
		const user = await db.authenticateUser(ctx.db, ctx.request.body);
		if (!user) {
			ctx.status = 401;
			return;
		}

		ctx.body = user;
		ctx.session.user = user;
	} catch (e) {
		if (e instanceof sql.RequestError) {
			ctx.status = 400;
		}
	}
};

export const signOut = async (ctx) => {
	ctx.session.user = null;
	ctx.body = { success: true };
};

/** @type {import('@koa/router').Middleware} */
export const getSession = async (ctx) => {
	ctx.body = {
		isSignedIn: !!ctx.session.user,
		user: ctx.session.user,
	};
};

/** @type {import('@koa/router').Middleware} */
export const getUserById = async (ctx) => {
	try {
		const user = await db.getUserById(ctx.db, ctx.params.id);
		if (user == null) {
			ctx.status = 404;
			return;
		}

		ctx.body = user;
	} catch (e) {
		if (e instanceof sql.RequestError) {
			ctx.status = 404;
		}
	}
};

/** @type {import('@koa/router').Middleware} */
export const deleteUserById = async (ctx) => {
	try {
		await db.deleteUserById(ctx.db, ctx.params.id);
		ctx.status = 204;
	} catch (e) {
		if (e instanceof sql.RequestError) {
			ctx.status = 404;
		}
	}
};
