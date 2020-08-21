import React, { useReducer, useState, useEffect, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { v4 } from 'uuid';
import { Layout, Row, Col, Select } from 'antd';

import './App.css';
import PokemonList from './components/PokemonList';
import PokemonDetail from './components/PokemonDetail';

const { Content } = Layout;
const { Option } = Select;

const APPEND = 'APPEND';
const FILTERED_LIST = 'FILTERED_LIST';
const RESET = 'RESET';
const IMAGE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
const DEFAULT_LIST_URL = 'https://pokeapi.co/api/v2/pokemon?limit=50';


function listPokemonReducer(state, action) {
  switch (action.type) {
    case APPEND:
      return {
        list: [...state.list, ...action.data.list],
        next: action.data.next,
        previous: action.data.previous,
      };
    case RESET:
      return {
        list: action.data.list,
        next: action.data.next,
        previous: action.data.previous,
      };
    case FILTERED_LIST:
      return {
        list: action.data.list,
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
  const [loadingList, setLoadingList] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [pokemonTypes, setPokemoTypes] = useState([]);
  const [pokemonDetail, setPokemonDetail] = useState(null);
  const [listPokemonState, listPokemonDispatch] = useReducer(listPokemonReducer, { list:[], next: null, previous: null });

  const fetchList = useCallback((url = DEFAULT_LIST_URL) => {
    fetch(url)
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
  }, [])

  // TODO: REFACTOR
  const fetchListReset = useCallback((url = DEFAULT_LIST_URL) => {
    fetch(url)
    .then((response) => response.json())
    .then((response) => {
      listPokemonDispatch(
        {
          type: RESET,
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
  }, [])

  const onCLickCard = useCallback((url) => {
    if(url){
      setLoadingDetail(true);
      fetch(url)
      .then((response) => response.json())
      .then((response) => {
        setPokemonDetail(response);
      })
      .finally(() => {
        setLoadingDetail(false);
      });
    } else {
      console.log('invalid url', url);
    }
  }, []);
  
  useEffect(() => {
    fetchList()
  }, [fetchList]);

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/type')
    .then((response) => response.json())
    .then((response) => {
      const sortedTypes = response.results.sort((a, b) => {
        a = a.name.toLowerCase();
        b = b.name.toLowerCase();
        return a < b ? -1 : b < a ? 1 : 0;
      })
      setPokemoTypes(sortedTypes)
    });
  }, []);

  const handleInfiniteOnLoad = () => {
    fetchList(listPokemonState.next);
  }

  function onChange(value) {
    console.log(value)
    if(value) {
      setLoadingList(true);
      fetch(value)
      .then((response) => response.json())
      .then((response) => {
        console.log(response.pokemon)
        listPokemonDispatch(
          {
            type: FILTERED_LIST,
            data: { 
              list: response.pokemon.map(({ pokemon }) => ({...pokemon, id: v4() , image_url: generateImageUrl(pokemon.url)})),
            }
          }
        );
      })
      .finally(() => {
        setLoadingList(false)
      });
    } else {
      fetchListReset();
    }
  }
  
  const typeOptions = pokemonTypes.map((detail, index) => <Option value={detail.url} key={index} className="capitalize">{detail.name}</Option>);

  return (
    <div className="App">
      <Layout>
        <Content>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Row gutter={[16, 16]}>
                  <div className="list">
                    <Col span={24}>
                      <Select
                        allowClear
                        showSearch
                        optionFilterProp="children"
                        style={{ width: 200 }}
                        placeholder="Select pokemon type"
                        onChange={onChange}
                        filterOption={(input, option) => {
                          console.log(input, option)
                          return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                        }}
                      >
                        {typeOptions}
                      </Select>
                    </Col>  
                    <Col span={24}>
                      <div className="infinite-scroll-container">
                        <InfiniteScroll
                          initialLoad={false}
                          pageStart={0}
                          loadMore={handleInfiniteOnLoad}
                          hasMore={!loadingList && !!listPokemonState.next}
                          useWindow={false}
                        >
                          <PokemonList pokemons={listPokemonState.list} onClick={(url) => onCLickCard(url)}/>
                        </InfiniteScroll>
                      </div>
                    </Col>
                  </div>
              </Row>
            </Col>
            <Col span={12}>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <div className="detail">
                    <PokemonDetail data={pokemonDetail}/>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Content>  
      </Layout> 
    </div>
  );
}

export default App;
