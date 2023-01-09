import "./App.css";
import { useEffect, useState } from "react";
import { Button, TextField, Box } from "@mui/material";
import axios from "axios";

function App() {
  const [amount, setAmount] = useState(0);

  const [razorPaymentId, setRazorPaymentId] = useState("");
  const [razorOrderId, setRazorOrderId] = useState("");
  const [razorSignature, setRazorSignature] = useState("");

  const verifySignature = () => {
    axios
      .post("http://localhost:8080/payment/verify", {
        razorOrderId,
        razorPaymentId,
        razorSignature,
      })
      .then((res) => {
        if (res.data.status === "success") {
          console.log(res.data.message);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const showRazorpay = (orderId) => {
    const options = {
      key: " YOUR KEY",
      amount: amount,
      currency: "INR",
      order_id: orderId,
      handler: function (response) {
        setRazorPaymentId(response.razorpay_payment_id);
        setRazorOrderId(orderId);
        setRazorSignature(response.razorpay_signature);
      },
    };
    var displayCheckout = new window.Razorpay(options);
    displayCheckout.open();

    
  };

  useEffect(()=>{
    verifySignature();
  },[razorPaymentId])

  const handlePayment = () => {
    if (amount === 0) {
      alert("amount should be greater than 0");
      return;
    }
    axios.post("http://localhost:8080/payment/orderId", {
        amount: amount,
      })
      .then((res) => {
        if (res.data.status === "success") {
          showRazorpay(res.data.orderId);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAmount = (e) => {
    setAmount(e.target.value);
  };

  return (
    <div className="App">
      <Box sx={{ mt: 2, p: 2 }}>
        <TextField
          id="standard-basic"
          label="Amount"
          variant="standard"
          onChange={(e) => handleAmount(e)}
        />
      </Box>
      <Box>
        <Button sx={{}} onClick={handlePayment} variant="contained">
          Pay Now
        </Button>
      </Box>
    </div>
  );
}

export default App;
