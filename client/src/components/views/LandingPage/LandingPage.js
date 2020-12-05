import React, { useEffect, useState } from 'react'
import { RocketOutlined } from "@ant-design/icons";
import axios from 'axios'
import { Col, Card, Row } from 'antd'
import Meta from 'antd/lib/card/Meta';
import ImageSlider from '../../utils/ImageSlider'
import Checkbox from './Section/CheckBox'
import RadioBox from './Section/RadioBox'
import SearchFeature from './Section/SearchFeature'
import {continents, price} from './Section/Datas'

function LandingPage() {

    const [Product, setProduct] = useState([])
    const [Skip, setSkip] = useState(0)
    const [Limit, setLimit] = useState(8)
    const [PostSize, setPostSize] = useState(0)

    const [Filters, setFilters] = useState({
        continents: [],
        price: []
    })

    const [SearchTerm, setSearchTerm] = useState("")

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
                        cover={<a href={`/product/${product._id}`}><ImageSlider images={product.images} /></a>}
                    >
                        <Meta 
                            title={product.title}
                            description={`${product.price}`}
                        />
                    </Card>
                </Col>
    })

    const showFilteredResults = (filters) => {
        let body = {
            skip:0,
            limit:Limit,
            filters:filters
        }

        getProducts(body)
        setSkip(0)
    }

    const handlePrice = (value) => {
        const data = price
        let array = []

        for (let key in data) {
            if(data[key]._id === parseInt(value, 10)){
                array = data[key].array
            }
        }

        return array
    }

    const handleFilters = (filters, category) => {
        const newFilters = {...Filters}
        newFilters[category] = filters

        if(category === "price"){
            let priceValue = handlePrice(filters)
            newFilters[category] = priceValue
        }

        showFilteredResults(newFilters)
        setFilters(newFilters)
    }

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

    const updateSearchTerm = (newSearchTerm) => {

        let body = {
            skip : 0,
            limit : Limit,
            filters:Filters,
            searchTerm:newSearchTerm
        }

        setSkip(0)
        setSearchTerm(newSearchTerm)
        getProducts(body)
    }

    return (
        <div style={{width:'75%', margin:'3rem auto'}}>
            <div style={{textAlign:'center'}}>
                <h2>Lets Travel Anywhere <RocketOutlined type="rocket" /></h2>
            </div>

            {/* Filter*/}
            <Row gutter={[16, 16]}>
                <Col lg={12} xs={24} >
                    <Checkbox list={continents} handleFilters={filters => handleFilters(filters, "continents")} />    
                </Col>
                <Col lg={12} xs={24} >
                    <RadioBox list={price} handleFilters={filters => handleFilters(filters, "price")} />
                </Col>
            </Row> 

            {/* Search */}
            <div style={{display:'flex', justifyContent:'flex-end', margin:'1rem auto'}}>
                <SearchFeature 
                    refreshFunction={updateSearchTerm}
                />
            </div>

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
