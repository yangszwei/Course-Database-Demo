/**
 * @file Registers the routes from controllers module to the API router.
 * @author Si-Wei Yang
 */

import Router from '@koa/router';
import * as account from './account.js';
import * as customer from './customer.js';
import * as transaction from './transaction.js';
import * as user from './user.js';

/** API router. */
const router = new Router({ prefix: '/api' });

// Account routes
router.post('/accounts', account.createAccount);
router.get('/accounts/:id', account.getAccountById);
router.delete('/accounts/:id', account.deleteAccountById);

// Customer routes
router.post('/customers', customer.createCustomer);
router.post('/customer/sign-in', customer.signIn);
router.get('/customer', customer.getSession);
router.get('/customer/accounts', account.getCustomerAccounts);
router.post('/customer/sign-out', customer.signOut);
router.get('/customers/:id', customer.getCustomerById);
router.get('/customers/:id/accounts', account.getAccountsByCustomerId);
router.delete('/customers/:id', customer.deleteCustomerById);

// Transaction routes
router.post('/transactions', transaction.createTransaction);
router.get('/transactions/:id', transaction.getTransactionById);
router.get('/transactions', transaction.getTransactions);
router.delete('/transactions/:id', transaction.deleteTransactionById);

// System User routes
router.post('/users', user.createUser);
router.post('/sign-in', user.signIn);
router.post('/sign-out', user.signOut);
router.get('/session', user.getSession);
router.get('/users/:id', user.getUserById);
router.delete('/users/:id', user.deleteUserById);

export default router;
