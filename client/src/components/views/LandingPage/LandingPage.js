import React, { useEffect, useState } from 'react'
import { RocketOutlined } from "@ant-design/icons";
import axios from 'axios'
import { Col, Card, Row } from 'antd'
import Meta from 'antd/lib/card/Meta';
import ImageSlider from '../../utils/ImageSlider'
import Checkbox from './Section/CheckBox'
import {continents} from './Section/Datas'

function LandingPage() {

    const [Product, setProduct] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [PostSize, setPostSize] = useState(0)

    useEffect(() => {

        let body = {
            skip:Skip,
            limit:Limit
        }

        getProducts(body)

    }, [])

    const renderCards = Product.map((product, index) => {
        return  <Col lg={6} md={8} xs={24} key={index}>
                    <Card
                        cover={<ImageSlider images={product.images} />}
                    >
                        <Meta 
                            title={product.title}
                            description={`${product.price}`}
                        />
                    </Card>
                </Col>
        
        
    })

    const getProducts = (body) => {
        axios.post('api/product/products', body)
            .then(response=> {
                if(response.data.success){
                    if(body.loadMore){
                        setProduct([...Product, ...response.data.productsInfo])
                    }else{
                        setProduct(response.data.productsInfo)
                    }
                    setPostSize(response.data.postSize)
                }else{
                    alert('상품 불러오기 실패')
                }
            })
    }

    const loadMoreHandler = () => {
        let skip = Skip + Limit

        let body = {
            skip:skip,
            limit:Limit,
            loadMore:true
        }

        getProducts(body)
        setSkip(skip)
    }

    return (
        <div style={{width:'75%', margin:'3rem auto'}}>
            <div style={{textAlign:'center'}}>
                <h2>Lets Travel Anywhere <RocketOutlined type="rocket" /></h2>
            </div>

            {/* Filter*/}

            {/* CheckBox */}
            <Checkbox list={continents}/>

            {/* RadioBox */}

            {/* Search */}

            {/* Cards */}

            <Row gutter={[16, 16]}>
                {renderCards}
            </Row>
            <br />

            {PostSize >= Limit && 
            <div style={{display:'flex', justifyContent:'center'}}>
                <button onClick={loadMoreHandler}>더보기</button>
            </div>
            }
            
        </div>

    )
}

export default LandingPage
