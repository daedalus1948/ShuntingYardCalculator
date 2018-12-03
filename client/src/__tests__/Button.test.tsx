import React from 'react';
import { shallow } from 'enzyme';

import Button from '../components/Button';


describe('BUTTON COMPONENT', () => {
    
    const mockEvent = {preventDefault: () => {}};
    const spy = jest.fn();

    test('Button component calls func() on click', () => {
        const button = shallow(<Button func={spy} text={"1"} />)
        const htmlButton = button.find('div');
        htmlButton.simulate('click', mockEvent);
        expect(spy).toHaveBeenCalled();
    });

});
