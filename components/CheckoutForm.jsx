import React, { useState } from 'react';
import { urlFor } from '../lib/client';
import { useStateContext } from '../context/StateContext';
import axios from 'axios';
import { useRouter } from 'next/router';

const CheckOutForm = ({setModal}) => {
  const router = useRouter();
  
  
  const { totalPrice, totalQuantities, cartItems,setShowCart } = useStateContext();
  const [formData, setFormData] = useState({
    FullName: '',
    Phone: '',
    Email: '',
    City: '',
    Address: '',
    NearbyPlace: '',
  });


  const iconForField = (fieldName) => {
    switch (fieldName.toLowerCase()) {
      case 'fullname':
        return 'fas fa-user';
      case 'phone':
        return 'fas fa-phone';
      case 'email':
        return 'fas fa-envelope';
      case 'city':
        return 'fas fa-city';
      case 'address':
        return 'fas fa-map-marker-alt';
      case 'nearbyplace':
        return 'fas fa-map-pin';
      default:
        return 'fas fa-question';
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://api-ap-south-1.hygraph.com/v2/clpxsaihiizcg01ta5yy5fgmq/master",
        {
          query: `
            mutation MyMutation {
              createFormdetails(
                data: {
                  goodName: "${formData.FullName}",
                  address: "${formData.Address}",
                  city: "${formData.City}",
                  products: "${cartItems}",
                  productsquantity: "${totalQuantities}",
                  email: "${formData.Email}",
                  phone: "${formData.Phone}",
                  nearbyPlace: "${formData.NearbyPlace}"
                }
              ) {
                id
                address
                city
                createdAt
                email
                goodName
                nearbyPlace
                phone
                products
                productsquantity
              }
            }
          `,
        }
      );
  
      const {
        data: { createFormdetails },
      } = response.data;
      
      console.log("Form created successfully!", createFormdetails);
      setFormData({
        FullName: "",
        Address: "",
        City: "",
        Email: "",
        Phone: "",
        NearbyPlace: "",
      });
      localStorage.setItem('formId', createFormdetails.id);
      setModal(false);
      setShowCart(false);
      router.push('/success');
      
    } catch (error) {
      console.error("Error creating form:", error);
    }
  };
  

  return (
    <div>
     
      <div>
        {cartItems.map((item) => (
          <div key={item._id}>
            <img
              src={urlFor(item.image[0])}
              className="cart-product-image2"
              alt={item.name}
            />
            <h4>
              Product: {item.name} | Quantity: {item.quantity}
            </h4>
          </div>
        ))}
      </div>
        <div className="formbold-main-wrapper">
          <div className="formbold-form-wrapper">
            <form onSubmit={handleSubmit}>
              {Object.keys(formData).map((fieldName) => (
                <div className="formbold-mb-5" key={fieldName}>
                  <label htmlFor={fieldName} className="formbold-form-label">
                    <i className={iconForField(fieldName)}></i> {fieldName}
                  </label>
                  <input
                    type="text"
                    name={fieldName.toLowerCase()}
                    id={fieldName.toLowerCase()}
                    placeholder={fieldName}
                    className="formbold-form-input"
                    value={formData[fieldName]}
                    onChange={(e) => handleInputChange(fieldName, e.target.value)}
                    required
                  />
                </div>
              ))}
              <div>
                <button className="formbold-btn">Submit with Total price of Rupees {totalPrice}</button>
              </div>
            </form>
          </div>
        </div>
     
    </div>
  );
};

export default CheckOutForm;
