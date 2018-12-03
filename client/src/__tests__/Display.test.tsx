import React from 'react';
import { mount } from 'enzyme';

import Display from '../components/Display';


describe('DISPLAY', () => {

    test('Display component renders props correctly', () => {
        let display = mount(<Display expression="33+11" result="44" />);
        expect(display.props().expression).toEqual('33+11');
        expect(display.props().result).toEqual('44');
      });
})
