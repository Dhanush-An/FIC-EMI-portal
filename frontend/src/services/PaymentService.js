import axios from 'axios';
import API_BASE_URL from '../config';

const API_URL = `${API_BASE_URL}/api/payments`;

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const processDownPayment = async (amount, applicationId, candidateName, candidateEmail) => {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    alert('Razorpay SDK failed to load. Are you online?');
    return;
  }

  try {
    const token = localStorage.getItem('token');
    const orderRes = await axios.post(`${API_URL}/order`, { 
      amount, 
      type: 'DownPayment',
      applicationId 
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const order = orderRes.data.data;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SiriIK4zfVaFIF',
      amount: order.amount,
      currency: order.currency,
      name: 'FIC Consultancy',
      description: 'EMI Down Payment',
      order_id: order.id,
      handler: async function (response) {
        const verifyRes = await axios.post(`${API_URL}/verify`, {
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
          applicationId
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (verifyRes.data.success) {
          alert('Payment Successful!');
          window.location.reload();
        }
      },
      prefill: {
        name: candidateName,
        email: candidateEmail,
      },
      theme: {
        color: '#2563eb',
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();

  } catch (error) {
    console.error('Payment Error:', error.response?.data || error.message);
    alert(`Failed to initiate payment!\nURL: ${API_URL}/order\nError: ${error.response?.data?.error || error.message}`);
  }
};
