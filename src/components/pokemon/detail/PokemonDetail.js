import React from 'react';
import { Row, Space, Col, Typography, Tag, Progress } from 'antd';
import './PokemonDetail.css';
import { firstLetterCapitalize, getIdTypeFromUrl } from '../../../utils';

const { Text, Title } = Typography;
const typeDetailColorbyId = {
  '1': '#dcdcdc',
  '2': '#dc6900',
  '3': '#78dcff',
  '4': '#d28cd2',
  '5': '#fac85a',
  '6': '#b48c64',
  '7': '#46c846',
  '8': '#a08cff',
  '9': '#aac8f0', 
  '10': '#ff6900',
  '11': '#14b9ff',
  '12': '#b4f000',
  '13': '#ffe100',
  '14': '#f08cdc',
  '15': '#14f5ff',
  '16': '#5078dc',
  '17': '#787878',
  '18': '#ffafdc'
};
const statusLabel = {
  'hp': 'HP',
  'attack': 'Attack',
  'defense': 'Defense',
  'special-attack': 'Special Attack',
  'special-defense': 'Special Defense',
  'speed': 'Speed'
}

const PokemonDetail = (props) => {
  let ImageLogo = 
  <Row className="logo-container">
    <Col>
      <Space align="center">
        <img alt="pokemon" className="logo" src="https://upload.wikimedia.org/wikipedia/commons/9/98/International_Pok%C3%A9mon_logo.svg" height="180"/>
      </Space>
    </Col>
  </Row>

  if(props.data) {
    const tags = props.data.types.map(({ type }, index) => {
      const typeId = getIdTypeFromUrl(type.url) || '';
      return (<Tag color={typeDetailColorbyId[`${typeId}`]} visible key={index}>{firstLetterCapitalize(type.name)}</Tag>)
    })

    const statusIndicator = props.data.stats.map((status) => {
      return (
        <Col span={21}>
          <Progress
            strokeColor={{
              '0%': '#43cea2',
              '100%': '#185a9d',
            }}
            percent={status.base_stat/2}
            status="active"   
            format={() => statusLabel[status.stat.name]}
          />
        </Col>
      )
    })

    return (
      <div>
        { ImageLogo }
        <Row gutter={[16, 16]}>
          <Col span={6}>
            <img alt="pokemon" src={props.data.sprites.front_default} height="180"/>
          </Col>
          <Col span={18} className="profile-detail">
            <Row>
              <Col span={8}>
                <Title level={2}>{firstLetterCapitalize(props.data.name)}</Title>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Text strong>Weight</Text>
              </Col>
              <Col span={16}>
                <div>{props.data.weight/10} kg</div>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Text strong>Height</Text>
              </Col>
              <Col span={16}>
                <div>{props.data.height/10} m</div>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Text strong>Base Experience</Text>
              </Col>
              <Col span={16}>
                <div>{props.data.base_experience}</div>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Text strong>Tags</Text>
              </Col>
              <Col span={16}>
                { tags }
              </Col>
            </Row>  
          </Col>
        </Row>
        <Row gutter={[16, 16]} className="indicator">
          <Col span={24}>
              <Title level={2}>Statistic</Title>
          </Col>
          { statusIndicator }
        </Row>
      </div>
    );
  };

  return (
    
    <div>
      { ImageLogo } 
      Click on card to see pokemon detail!
    </div>
  )
};

export default PokemonDetail