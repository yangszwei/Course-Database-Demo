#!/usr/bin/env node

/**
 * @file Configures and starts the http server
 * @author Chung-Yueh Lien, Si-Wei Yang
 */

import Koa from 'koa';
import { bodyParser } from '@koa/bodyparser';
import { connect } from '../utils/database.js';
import controllers from '../controllers/index.js';
import send from 'koa-send';
import serve from 'koa-static';
import session from 'koa-session';

const app = new Koa();

// Connect to database and attach connection pool to app context
app.context.db = await connect();

// Set session secret keys to rotate
app.keys = ['ntunhsimsecret'];

// Register API middlewares & routes
app.use(session(app));
app.use(bodyParser());
app.use(controllers.routes());
app.use(controllers.allowedMethods());

// Serve front-end app (in production)
if (process.env.NODE_ENV !== 'development') {
	app.use(serve('./dist'));
	app.use((ctx) => {
		if (ctx.path.startsWith('/api')) return;
		return send(ctx, './dist/index.html');
	});
}

// Start server
app.listen(3000, () => {
	console.log('Server running on port http://localhost:3000');
});
