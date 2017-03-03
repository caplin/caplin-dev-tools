import chai from 'chai';
import { mount, shallow } from 'enzyme';
import chaiEnzyme from 'chai-enzyme'
import React from 'react';
import {{componentName}} from '../react-component';

const expect = chai.expect;
chai.use(chaiEnzyme());

describe('Testing {{componentName}} Initial', () => {
	let componentWrapper = null;

	afterEach(() => {
		componentWrapper = null;
	});

	it('should have count of zero and assigned owner when first loaded', () => {
		//given
		componentWrapper = shallow(<{{componentName}} owner="Bob"/>);
		//then
		expect(componentWrapper.find('.counter')).to.have.text('count:0');
		expect(componentWrapper.find('.heading')).to.have.text('This {{componentName}} Component belongs to Bob');
	})

	it('should increment count when button is clicked', () => {
		//given
		componentWrapper = shallow(<{{componentName}} />);
		//when
		componentWrapper.find('button').simulate('click');
		//then
		expect(componentWrapper.find('.counter')).to.have.text('count:1');
	})
});