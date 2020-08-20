import React from 'react';
import { Card, List } from 'antd';
import './PokemonList.css';

const { Meta } = Card;
const gridOptions = {
  gutter: [16,16],
  xs: 1,
  sm: 1,
  md: 2,
  lg: 4,
  xl: 4,
  xxl: 4,
};

const listItem = (pokemon) => (
  <List.Item>
    <Card
      className="card-wrapper"
      hoverable
      cover={<img alt="example" className="card-image" src={pokemon.image_url} height="180"/>}
    >
      <Meta className="cart-meta" title={pokemon.name} />
    </Card>
  </List.Item>
);

const PokemonList = (props) => {
  return (
    <List
      grid={gridOptions}
      dataSource={props.pokemons}
      renderItem={listItem}
    />
  );
};
  
  export default PokemonList;