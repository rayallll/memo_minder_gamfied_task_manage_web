import React, { useState, useEffect } from 'react';
import './ShopArea.css';
import Popup from '../popup/Popup';

const products = [
  { id: 'stick', name: 'Stick', price: 15, imgSrc: '/stick.png', soldSrc: '/sold_stick.png' },
  { id: 'sword', name: 'Sword', price: 30, imgSrc: '/sword.png', soldSrc: '/sold_sword.png' },
  { id: 'magicBook', name: 'MagicBook', price: 40, imgSrc: '/book.png', soldSrc: '/sold_book.png' },
];

  const ShopArea = ({coin, decreaseCoin}) => {
    const [boughtItems, setBoughtItems] = useState(() => {
      const saved = localStorage.getItem('boughtItems');
      return saved ? JSON.parse(saved) : {};
    });
  useEffect(() => {
    localStorage.setItem('boughtItems', JSON.stringify(boughtItems));
  }, [boughtItems]);

  const handleBuy = (productId) => {
    const product = products.find(p => p.id === productId);
    // have coins to buy
    if (coin >= product.price) {
      const newBoughtItems = {
        ...boughtItems,
        [productId]: true,
      };
      setBoughtItems(newBoughtItems); // update state 
      decreaseCoin(product.price);
      localStorage.setItem('boughtItems', JSON.stringify(newBoughtItems)); // update localStorage
      const event = new Event('localStorageChanged');
      window.dispatchEvent(event);
      // show popup
      showCustomPopup("Purchase Successful", `You have successfully purchased the ${product.name}.`, "rgba(8,186,255, 0.7)");
    } else {
      // no enough coin to buy
      showCustomPopup("Purchase Failed", "You do not have enough coins.", "rgba(243, 97, 105, 0.7)");
    }
  };
  
  /* Popup */
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState({ title: '', body: '', background_color: ''});
  const closePopup = () => {
    setShowPopup(false);
  };
  const showCustomPopup = (title, body, background_color) => {
    setPopupMessage({ title, body, background_color });
    setShowPopup(true);
  };

  
  return (
    <div className="shop-page">
      <Popup show={showPopup} onClose={closePopup} message={popupMessage} />
      <div className="background-image"></div>
      <div className="product-container">
        {products.map((product) => (
          <div className="product" key={product.id}>
            <img src={boughtItems[product.id] ? product.soldSrc : product.imgSrc} alt={product.name}/>
            <div className="product-info">
                <h3>{product.name}</h3>
                <p>{product.price} coins</p>
                {/* Disable Buy button */}
                <button onClick={() => handleBuy(product.id)} disabled={!!boughtItems[product.id]}>
                  Buy
                </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShopArea;
