import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import User from "./pages/User";
import Admin from "./pages/Admin";
import Navbar from "./components/Navbar";
function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <Navbar />
                <Routes>
                    <Route exact path="/" element={<Home />} />
                    <Route exact path="/user" element={<User />} />
                    <Route exact path="/admin" element={<Admin />} />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;
