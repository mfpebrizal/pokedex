import React, { useReducer, useState, useEffect } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { v4 } from 'uuid';
import { Layout, Row, Col } from 'antd';

import './App.css';
import PokemonList from './components/PokemonList';

const { Content } = Layout;

const APPEND = 'APPEND';
const FILTERED_LIST = 'FILTERED_LIST';
const IMAGE_URL = 'https://pokeres.bastionbot.org/images/pokemon';

const listPokemonInitialState = {
  list:[],
  next: null,
  previous: null
};
const listPokemonTypeinitialState = [];

function listPokemonReducer(state, action) {
  switch (action.type) {
    case APPEND:
      return {
        list: [...state.list, ...action.data.list],
        next: action.data.next,
        previous: action.data.previous,
      };
    case FILTERED_LIST:
      return {
        list: action.list,
        next: null,
        previous: null,
      };
    default:
      throw new Error();
  }
}

const generateImageUrl = (url) => {
  if (url) {
    const split = url.match(/^https:\/\/pokeapi.co\/api\/v2\/pokemon\/(\d+)/);
    return `${IMAGE_URL}/${split[1]}.png`;
  }
  return '';
};

function App() {  
  const [loadingList, setLoadingList] = useState(listPokemonTypeinitialState);
  const [pokemonTypes, setPokemoTypes] = useState(listPokemonTypeinitialState);
  const [listPokemonState, listPokemonDispatch] = useReducer(listPokemonReducer, listPokemonInitialState);

  useEffect(() => {
    setLoadingList(true);
    fetch('https://pokeapi.co/api/v2/pokemon?limit=50')
    .then((response) => response.json())
    .then((response) => {
      listPokemonDispatch(
        {
          type: APPEND,
          data: {
            list: response.results.map((detail) => ({...detail, id: v4() , image_url: generateImageUrl(detail.url)})),
            next: response.next,
            previous: response.previous
          }
        }
      );
    })
    .finally(() => {
      setLoadingList(false)
    });
  }, []);

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/type')
    .then((response) => response.json())
    .then((response) => {
      setPokemoTypes(response.results)
    });
  }, []);

  const handleInfiniteOnLoad = () => {
    setLoadingList(true);
    fetch(listPokemonState.next)
    .then((response) => response.json())
    .then((response) => {
      listPokemonDispatch(
        {
          type: APPEND,
          data: {
            list: response.results.map((detail) => ({...detail, id: v4() , image_url: generateImageUrl(detail.url)})),
            next: response.next,
            previous: response.previous
          }
        }
      );
    })
    .finally(() => {
      setLoadingList(false);
    });
  }

  return (
    <div className="App">
      <Layout>
        <Content>
          <Row gutter={[16, 16]}>
            <Col  span={12}>
              <Row gutter={[16, 16]}>
                  <div className="list">
                    <Col span={24}>
                      <div>filter</div>
                    </Col>  
                    <Col span={24}>
                      <div className="infinite-scroll-container">
                        <InfiniteScroll
                          initialLoad={false}
                          pageStart={0}
                          loadMore={!loadingList && handleInfiniteOnLoad}
                          hasMore={!!listPokemonState.next}
                          useWindow={false}
                        >
                          <PokemonList pokemons={listPokemonState.list}/>
                        </InfiniteScroll>
                      </div>
                    </Col>
                  </div>
              </Row>
            </Col>
            <Col span={12}>
              <div>Detail</div>
            </Col>
          </Row>
        </Content>  
      </Layout> 
    </div>
  );
}

export default App;
