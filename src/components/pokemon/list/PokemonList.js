import React from 'react';
import { Card, List } from 'antd';
import './PokemonList.css';

const { Meta } = Card;

const gridOptions = {
  gutter: [16,16],
  xs: 1,
  sm: 1,
  md: 2,
  lg: 2,
  xl: 3,
  xxl: 4,
};

const PokemonList = (props) => {
  const listItem = (pokemon) => (
    <List.Item>
      <Card
        className="card-wrapper"
        onClick={() => props.onClick(pokemon.url)}
        hoverable
        cover={<img alt="pokemon" className="card-image" src={pokemon.image_url} height="180"/>}
      >
        <Meta className="cart-meta" title={pokemon.name} />
      </Card>
    </List.Item>
  );

  return (
    <List
      grid={gridOptions}
      dataSource={props.pokemons}
      renderItem={listItem}
    />
  );
};
  
  export default PokemonList;