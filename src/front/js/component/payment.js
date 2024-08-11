// import React, {useState} from 'react';
// import {CardElement, useElements, useStripe} from'@stripe/react-stripe-js';
// import axios from 'axios';
// import "../../styles/app.css";

// const CARD_OPTIONS = {
// 	iconStyle: "solid",
// 	style: {
// 		base: {
// 			iconColor: "#c4f0ff",
// 			color: "#fff",
// 			fontWeight: 500,
// 			fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
// 			fontSize: "16px",
// 			fontSmoothing: "antialiased",
// 			":-webkit-autofill": { color: "#fce883" },
// 			"::placeholder": { color: "#87bbfd" }
// 		},
// 		invalid: {
// 			iconColor: "#ffc7ee",
// 			color: "#ffc7ee"
// 		}
// 	}
// }

// // // Create a Context
// // const PUBLIC_KEY = "sk_test_51PmKIH15sbCyvSjJ3pyuKWFguYloX2DtBomvH69eo18enVsrMMuDDfIjExbUClktD3VSfkMDp5YKCg4RQxoeopfg00CWru2WsJ"
// // const StripeTest = loadStripe(PUBLIC_KEY);

// export default function Payment(){
//     const [success, setsuccess] = useState(false);
//     const stripe = useStripe();
//     const elements = useElements();

//     const handleSubmit = async (event) => {
//         event.preventDefault();
//         const {paymentMethod, error } = await stripe.createPaymentMethod({
//             type: 'card',
//             card: elements.getElement(CardElement),
//         });
//         if (!error) {
//             try {
//                 // const {id} = paymentMethod
//                 const response = await axios.post('/payment', {
//                     amount: 1000, // $10.00
//                     paymentMethodId: paymentMethod.id,
//                 }, {
//                     headers: {
//                         'Authorization': `Bearer ${localStorage.getItem('token')}`,
//                     },
//                 });
//                 if (response.status === 200) {
//                     console.log('Payment successful!');
//                     setSuccess(true)
//                 }
//             } catch (error) {
//                 console.log("Error", error)
//             }
//         } else {
//             console.log(error.message)
//         }
//     }
//     return (
//         <div>
//             {!success ?
//             <form onSubmit={handleSubmit}>
//                 <fieldset className='FormGroup'>
//                     <div className='FormRow'>
//                         <CardElement options={CARD_OPTIONS} />
//                     </div>
//                 </fieldset>
//                 <button type='submit'>Pay</button>
//             </form>
//             :
//             <div>
//                 <h2>Payment Successful!</h2> </div>
//             }

//         </div>
//     );
// }