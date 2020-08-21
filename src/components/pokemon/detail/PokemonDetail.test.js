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

    it('class empty-detail SHOULD be exist if null value of data property is asssigned to the component', () => {
        wrapper.setProps({ data: null });
        expect(wrapper.find('.empty-detail')).toHaveLength(1);
    })

    it('class empty-detail SHOULD NOT be exist if props is asssigned to the component', () => {
        wrapper.setProps({ data: { types: [], stats: [], sprites: { front_default: '' } } });
        expect(wrapper.find('.empty-detail')).toHaveLength(0);
    })
})

