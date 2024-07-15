// Write your code here
import './index.css'

const SimilarProducts = props => {
  const {productItem} = props
  const {imageUrl, title, brand, price, rating} = productItem
  return (
    <li className="list-item-styling">
      <img src={imageUrl} className="image-styling" alt={title} />
      <h3>{title}</h3>
      <p>{brand}</p>
      <div className="cost-rating-container">
        <p>Rs {price}</p>
        <div className="rating-container">
          <p>{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="start"
            className="star-img-styling"
          />
        </div>
      </div>
    </li>
  )
}

export default SimilarProducts
