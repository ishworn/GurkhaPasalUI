import { toast, ToastContainer, ToastOptions } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

/**
 * Function to display a toast notification.
 * @param message The message to display in the toast
 * @param type The type of toast (success, error, info, warning)
 * @param options Additional options for the toast (optional)
 */









export const showToast = (
  message: string,
  type: "success" | "error" | "info" | "warning" = "info",
  options: ToastOptions = {}
) => {
  const defaultOptions: ToastOptions = {
    position: "top-right",
    autoClose: 3000, // Automatically close after 3 seconds
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  switch (type) {
    case "success":
      toast.success(message, { ...defaultOptions, ...options });
      break;
    case "error":
      toast.error(message, { ...defaultOptions, ...options });
      break;
    case "info":
      toast.info(message, { ...defaultOptions, ...options });
      break;
    case "warning":
      toast.warning(message, { ...defaultOptions, ...options });
      break;
    default:
      toast(message, { ...defaultOptions, ...options });
      break;
  }
};

/**
 * ToastContainer must be included somewhere in your app (e.g., in your main layout or at the top level of the app)
 */
export const ToastNotificationContainer = () => {
  return (
    <ToastContainer
      
      position="top-right"
      autoClose={3000}  
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
};
