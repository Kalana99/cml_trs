import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import HomePage from "./pages/HomePage";
import NotFoundPage from "./pages/NotFoundPage";

function AppRoutes() {

    return (
        <Routes>
            <Route exact path="/" element={<Navigate to="/home" replace/>}/>
            <Route path="/home" element={<HomePage/>}/>

            <Route path="*" element={<NotFoundPage/>}/>
        </Routes>
    );
}

function App() {
    return (
        <Router>
            <AppRoutes/>
        </Router>
    );
}

export default App;
