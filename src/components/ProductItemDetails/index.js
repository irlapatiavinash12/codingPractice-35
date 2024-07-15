// Write your code here

import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {Link} from 'react-router-dom'

import Cookies from 'js-cookie'

import Header from '../Header'

import {CiSquareMinus} from 'react-icons/ci'

import {CiSquarePlus} from 'react-icons/ci'



import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    productDetails: {},
    similarProducts: [],
    quantity: 1,
  }

  getFormattedData = data => ({
    id: data.id,
    imageUrl: data.image_url,
    title: data.title,
    brand: data.brand,
    totalReviews: data.total_reviews,
    rating: data.rating,
    availability: data.availability,
    style: data.style,
    price: data.price,
    description: data.description,
  })

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {match} = this.props

    const {params} = match

    const {id} = params

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/products/${id}`

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }

    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const data = await response.json()

      const updatedData = this.getFormattedData(data)
      const similarProductsData = data.similar_products.map(
        eachSimiliarProduct => this.getFormattedData(eachSimiliarProduct),
      )

      this.setState({
        apiStatus: apiStatusConstants.success,
        productDetails: updatedData,
        similarProducts: similarProductsData,
      })
    }

    if (response.status === 404) {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="renderFailure-styling">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="error view"
        className="failure-image"
      />
      <h1>Product Not Found</h1>
      <Link to="/products">
        <button className="continue-button-styling">Continue Shopping</button>
      </Link>
    </div>
  )

  renderIncrementView = () => {
    this.setState(prevState => ({quantity: prevState.quantity + 1}))
  }

  renderDecrementView = () => {
    const {quantity} = this.state
    if (quantity > 1) {
      this.setState({quantity: quantity - 1})
    }
  }

  renderSuccessView = () => {
    const {productDetails, similarProducts, quantity} = this.state

    const {
      imageUrl,
      title,
      brand,
      totalReviews,
      rating,
      availability,
      price,
      description,
    } = productDetails
    return (
      <div className="success-view">
        <div className="product-details">
          <img src={imageUrl} alt="product" className="product-thumb-image" />
          <div className="productData-container">
            <h1 className="title-styling">{title}</h1>
            <p className="price-styling">Rs {price}</p>
            <div className="review-rating-container">
              <div className="rating-container">
                <p>{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star-styling"
                />
              </div>
              <p>{totalReviews} Reviews</p>
            </div>
            <p className="description-styling">{description}</p>
            <div className="availability-container">
              <p className="label-styling">Availability: </p>
              <p className="value-styling">{availability}</p>
            </div>
            <div className="availability-container">
              <p className="label-styling">Brand: </p>
              <p className="value-styling">{brand}</p>
            </div>
            <hr className="horizontal-line-styling" />
            <div className="quantity-container">
              <button
                type="button"
                className="quantity-button-styling"
                onClick={this.renderDecrementView}
              >
                <CiSquareMinus />
              </button>
              <p>{quantity}</p>
              <button
                type="button"
                className="quantity-button-styling"
                onClick={this.renderIncrementView}
              >
                <CiSquarePlus />
              </button>
            </div>
            <button className="add-to-cart" type="button">
              ADD TO CART
            </button>
          </div>
        </div>
        <h1>Similar Products</h1>
        <ul className="similar-products-styling">
          {similarProducts.map(eachProduct => (
            <SimilarProducts productItem={eachProduct} key={eachProduct.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderProductDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderProductDetails()}
      </>
    )
  }
}

export default ProductItemDetails
