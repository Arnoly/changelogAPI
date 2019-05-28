/*
 * Copyright (c) 2019 Arthur LE RAY
 */

'use strict';

const Knex = require('../knex');
const {Model} = require('objection');
Model.knex(Knex);
module.exports = Model;
