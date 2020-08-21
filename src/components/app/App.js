import React, { useReducer, useState, useEffect, useCallback } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { v4 } from 'uuid';
import { Layout, Row, Col, Select } from 'antd';

import PokemonList from '../pokemon/list/PokemonList';
import PokemonDetail from '../pokemon/detail/PokemonDetail';

import './App.css';

import { generateImageUrl } from '../../utils';
import { APPEND, FILTERED_LIST, RESET, DEFAULT_LIST_URL } from '../../constant';

const { Content } = Layout;
const { Option } = Select;

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



function App() {  
  const [loadingList, setLoadingList] = useState(false);
  const [ , setLoadingDetail] = useState(false)
  const [ , setLoadingType] = useState(false)
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
  }, []);

  // TODO: REFACTOR
  const fetchListReset = useCallback((url = DEFAULT_LIST_URL) => {
    setLoadingList(true);
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
  }, []);

  const fetchTypes = useCallback(() => {
    setLoadingType(true);
    fetch('https://pokeapi.co/api/v2/type')
      .then((response) => response.json())
      .then((response) => {
        const sortedTypes = response.results.sort((a, b) => {
          a = a.name.toLowerCase();
          b = b.name.toLowerCase();
          return a < b ? -1 : b < a ? 1 : 0;
        })
        setPokemoTypes(sortedTypes)
      })
      .finally(() => {
        setLoadingType(false);
      });
  }, []);

  const fetchDetail = useCallback((url) => {
    setLoadingDetail(true);
    fetch(url)
      .then((response) => response.json())
      .then((response) => {
        setPokemonDetail(response);
      })
      .finally(() => {
        setLoadingDetail(false);
      });
  }, []);

  const onCLickCard = useCallback((url) => {
    if(url){
      fetchDetail(url)
    }
  }, [fetchDetail]);
  
  useEffect(() => {
    fetchList();
    fetchTypes();
  }, [fetchList, fetchTypes]);

  const handleInfiniteOnLoad = () => {
    fetchList(listPokemonState.next);
  }

  function onChange(value) {
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
