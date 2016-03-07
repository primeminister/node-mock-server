
var assert = require('assert'),
	GetResponse = require('../lib/GetResponse');

module.exports = function(serverOptions, _getFile) {

	var pathExpGetResponse = './test/expected/get-response';

	// GET call
	it('response from GET /product/{productCode}', function() {
		var response,
			data,
			expected;

		response = new GetResponse({
			path: serverOptions.restPath + '/products/#{productCode}',
			method: 'get',
			expected: 'success'
		}, serverOptions);
		expected = _getFile(pathExpGetResponse + '/01.json');
		data = response.get();
		assert.equal(JSON.stringify(data), expected);
	});

	// POST call
	it('response from POST /product/{productCode}', function() {
		var response,
			data,
			expected;

		response = new GetResponse({
			path: serverOptions.restPath + '/products/#{productCode}',
			method: 'post',
			expected: 'success'
		}, serverOptions);
		expected = _getFile(pathExpGetResponse + '/02.json');
		data = response.get();
		assert.equal(JSON.stringify(data), expected);
	});

	// FAKER call
	it('response from GET /product/{productCode} - with faker', function() {
		var response,
			data;

		response = new GetResponse({
			path: serverOptions.restPath + '/products/#{productCode}',
			method: 'get',
			expected: 'faker'
		}, serverOptions);
		data = response.get();

		assert.equal(typeof data.price, 'object');
		assert.equal(typeof data.card, 'object');
		assert.equal(typeof data.email, 'string');
	});

	// FUNCTIONS call
	it('response from GET /product/{productCode} - with functions', function() {
		var response,
			data;

		response = new GetResponse({
			path: serverOptions.restPath + '/products/#{productCode}',
			method: 'get',
			expected: 'func'
		}, serverOptions);
		data = response.get();

		assert.equal(typeof data.image, 'object');
		assert.equal(typeof data.image.url, 'string');
		assert.equal(typeof data.image.alt, 'string');
	});

	// REQUEST DATA call
	it('response from GET /product/{productCode} - with request data', function() {
		var response,
			data;

		response = new GetResponse({
			path: serverOptions.restPath + '/products/#{productCode}',
			method: 'get',
			expected: 'request-data'
		}, serverOptions);
		data = response.get();

		assert.equal(data.currentPage, 3);
	});

};