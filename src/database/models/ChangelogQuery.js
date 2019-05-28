/*
 * Copyright (c) 2019 Arthur LE RAY
 */

'use strict';

const Model = require('./Model');

module.exports = class ChangelogQuery extends Model
{
    static get tableName()
    {
        return 'ChangelogQuery';
    }
};
