import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import PokemonDetail from './PokemonDetail';

configure({ adapter: new Adapter() });

describe('<PokemonDetail />', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<PokemonDetail />);   
    });

    it('tes', () => {
        wrapper.setProps({ data: null });
        expect(wrapper.find('.empty-detail')).toHaveLength(1);
    })
})

