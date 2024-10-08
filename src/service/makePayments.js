import { toast } from "react-hot-toast"
import { PAYMENT_ENDPOINTS } from "./api"

const {
    INITIATE_PAYMENT,
    VERIFY_PAYMENT,
} = PAYMENT_ENDPOINTS;

// Load the Razorpay SDK from the CDN
function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script")
        script.src = src
        script.onload = () => {
            resolve(true)
        }
        script.onerror = () => {
            resolve(false)
        }
        document.body.appendChild(script)
    })
}

// Buy the Course
export async function payForBookings(
    token,
    totalRent,
    bookingIds,
    currUser,
    navigate,
) {
    const toastId = toast.loading("Loading...")
    try {
        // Loading the script of Razorpay SDK
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")

        if (!res) {
            toast.error(
                "Razorpay SDK failed to load. Check your Internet Connection."
            )
            return
        }

        const response = await fetch(INITIATE_PAYMENT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ amount: totalRent * 100, bookingIds }),
        });

        const responseText = await response.text(); // Get raw response text
        console.log("response text ", responseText); // Log the response for debugging

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}, message: ${responseText}`);
        }

        const data = JSON.parse(responseText); // Parse it as JSON
        console.log("data", data);

        const { orderId, amount, currency } = data;

        const razrpay_key = import.meta.env.VITE_REACT_APP_RAZORPAY_KEY_ID;
        console.log("razorpay key from env:", razrpay_key); // Log the key to check its value

        const options = {
            key: razrpay_key, // Pass the Razorpay key
            amount: amount, // Amount from order (in paise)
            currency: currency, // Currency from order
            order_id: orderId, // Pass the orderId from backend here
            handler: function (response) {
                verifyPayment(response.razorpay_payment_id, response.razorpay_order_id, response.razorpay_signature, navigate, token, bookingIds);
            },
            prefill: {
                name: currUser?.name || currUser.username,
            },
        };


        const paymentObject = new window.Razorpay(options)

        paymentObject.open()
        paymentObject.on("payment.failed", function (response) {
            toast.error("Oops! Payment Failed.")
            console.log(response.error)
        })
    } catch (error) {
        console.log("PAYMENT API ERROR............", error)
        toast.error("Could Not make Payment.")
    }
    toast.dismiss(toastId)
}

// Verify payment on the server
//    const verifyPayment = async (paymentId, orderId, signature, navigate, token, bookingIds) => {
//     const toastId = toast.loading('Verifying Payment');
//     try {
//         if (!token) {
//             toast.error('User not authenticated');
//             return;
//         }

//         const response = await fetch(VERIFY_PAYMENT, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${token}`,
//             },
//             body: JSON.stringify({
//                 paymentId,
//                 orderId,
//                 signature,
//                 bookingIds
//             }),
//         });

//         // const data = await response.json();

//         if (response.ok) {
//             toast.success('Payment verified successfully');
//             toast.dismiss(toastId)
//             navigate("/dashboard");
//         } else {
//             toast.dismiss(toastId)
//             toast.error('Payment verification failed');
//         }
//     } catch (error) {
//         console.log(error);
//         toast.dismiss(toastId)
//         toast.error('Error during payment verification');
//     }
// };

// Verify payment on the server
const verifyPayment = async (paymentId, orderId, signature, navigate, token, bookingIds) => {
    const toastId = toast.loading('Verifying Payment');
    try {
        if (!token) {
            toast.error('User not authenticated');
            return;
        }

        // Updated payload structure to include bookingIds and payment details
        const payload = {
            bookingIds: bookingIds,  // Include the array of booking IDs
            payload: {
                payment: {
                    entity: {
                        id: paymentId,  // Payment ID
                        order_id: orderId,  // Razorpay order ID
                        signature: signature  // Payment signature
                    }
                }
            }
        };

        const response = await fetch(VERIFY_PAYMENT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),  // Send the structured payload
        });

        if (response.ok) {
            toast.success('Payment verified successfully');
            toast.dismiss(toastId);
            navigate("/dashboard");
        } else {
            toast.dismiss(toastId);
            toast.error('Payment verification failed');
        }
    } catch (error) {
        console.log(error);
        toast.dismiss(toastId);
        toast.error('Error during payment verification');
    }
};

