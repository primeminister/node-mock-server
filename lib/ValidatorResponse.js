
'use strict';

var util = require('util'),
	extend = util._extend,
	GetResponse = require('./GetResponse'),
	validatorLog = require('./ValidatorLog'),
	ValidatorDataSchema = require('./ValidatorDataSchema'),
	Utils = require('./Utils');

/**
 *
 * @class ValidatorResponse
 * @namespace ValidatorResponse
 * @param {object} options
 * @param {object} serverOptions
 * @constructor
 *
 * Swagger importer
 */
function ValidatorResponse(options, serverOptions) {
	this.init(options, serverOptions);
}

ValidatorResponse.prototype = extend(ValidatorResponse.prototype, Utils.prototype);
ValidatorResponse.prototype = extend(ValidatorResponse.prototype, {

	constructor : ValidatorResponse,

	_defaults: {
		path: undefined,
		method: undefined,
		expected: undefined
	},

	/**
	 *
	 * @method init
	 * called by constructor
	 * @param {object} options
	 * @param {object} serverOptions
	 * @public
	 */
	init: function (options, serverOptions) {

		options = extend(this._defaults, options || {});



		this._options = options;
		this._serverOptions = serverOptions;
		this._isValid = true;
		this._path = this._options.path;
		this._method = this._options.method.toUpperCase();
		this._expected = this._options.expected;

		if (!this.isFilledString(this._path)) {
			this._isValid = false;
			validatorLog.error('<code>options.path</code> can\'t be empty!');
		}

		if (!this.isFilledString(this._method)) {
			this._isValid = false;
			validatorLog.error('<code>options.method</code> can\'t be empty!');
		}

		if (!this.isFilledString(this._expected)) {
			this._isValid = false;
			validatorLog.error('<code>options.expected</code> can\'t be empty!');
		}

		if (this._isValid) {
			this._pathMethod = this._path + '/' + this._method;
			this._pathSchema = this._pathMethod + '/response_schema.json';
			this._pathMockData = this._pathMethod + '/mock/' + this._expected + '.json';
			this._dataSchema = {};
			this._dataExpected = {};
			this._readFiles();
		}

		validatorLog.neutral('response validation for <code>' + this._pathMockData + '</code> started');

		if (this._isValid) {
			new ValidatorDataSchema({
				schema: this._dataSchema,
				data: this._dataExpected,
				path: this._pathMethod,
				expected: this._expected,
				filePathData: this._pathMockData
			});
		}

	},

	/**
	 * @method _readFiles
	 * @returns {void}
	 * @private
	 */
	_readFiles: function () {

		var response;

		if (this._isValid) {
			try {
				this._dataSchema = JSON.parse(this.readFile(this._pathSchema));
			} catch (err) {
				validatorLog.error('cannot read file <code>' + this._pathSchema + '</code>!');
				this._isValid = false;
			}

			response = new GetResponse({
				path: this._path,
				method: this._method,
				expected: this._expected
			}, this._serverOptions);

			this._dataExpected = response.get();
		}
	}

});

module.exports = ValidatorResponse;