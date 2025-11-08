import { BrowserRouter } from "react-router-dom";
import { ProductsPage } from "./pages/ProductsPage";

function App() {
  return (
    <BrowserRouter>
      <ProductsPage />
    </BrowserRouter>
  );
}

export default App;
