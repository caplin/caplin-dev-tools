import chai from 'chai';
import React from 'react';
import {
	renderIntoDocument,
	findRenderedDOMComponentWithClass,
	findRenderedDOMComponentWithTag,
	Simulate
} from 'react-addons-test-utils';
import {{componentName}} from '../react-component';

describe('Testing {{componentName}} Initial', () => {
	let componentWrapper = null;

	afterEach(() => {
		componentWrapper = null;
	});

	it('should have count of zero and assigned owner when first loaded', () => {
		//given
		componentWrapper = renderIntoDocument(
		   <{{componentName}} owner="Bob"/>
		);

		//then
		const counter = findRenderedDOMComponentWithClass(componentWrapper, 'counter');
		const counterText = counter.textContent;
		chai.assert.equal(counterText, 'count:0');

		const heading = findRenderedDOMComponentWithClass(componentWrapper, 'heading');
		const headingText = heading.textContent;
		chai.assert.equal(headingText, 'This {{componentName}} Component belongs to Bob');
	})

	it('should increment count when button is clicked', () => {
		//given
		componentWrapper = renderIntoDocument(
		   <{{componentName}} />
		);
		//when
		const counterButton = findRenderedDOMComponentWithTag(componentWrapper, 'button');
		Simulate.click(counterButton);
		//then
		const counter = findRenderedDOMComponentWithClass(componentWrapper, 'counter');
		const counterText = counter.textContent;
		chai.assert.equal(counterText, 'count:1');
	})
});