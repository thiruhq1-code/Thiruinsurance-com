import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { InsuranceProvider } from "./context/InsuranceContext";
import { ToastProvider } from "./context/NotificationContext";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <InsuranceProvider>
            <AppRoutes />
          </InsuranceProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
