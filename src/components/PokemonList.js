import React from 'react';
import { Card, List } from 'antd';
import './PokemonList.css';

const { Meta } = Card;

const PokemonList = (props) => {
    return (
      <List
        grid={{
          gutter: [16,16],
          xs: 1,
          sm: 1,
          md: 2,
          lg: 4,
          xl: 4,
          xxl: 4,
        }}
        dataSource={props.pokemons}
        renderItem={pokemon => (
          <List.Item>
            <Card
              className="card-wrapper"
              hoverable
              cover={<img alt="example" className="card-image" src={pokemon.image_url} height="180"/>}
            >
              <Meta className="cart-meta" title={pokemon.name} />
            </Card>
          </List.Item>
        )}
      />
    );
  };
  
  export default PokemonList;