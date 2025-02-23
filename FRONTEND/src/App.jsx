import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './Landing/Landing';
import Navbar from './componrnts/Navbar';
import Scheduler from './Scheduler/Scheduler';
// import About from './About';

const App = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen max-w-full overflow-hidden">
        <Navbar />
        <main className="flex-grow w-full "> {/* Removed `container mx-auto` */}
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/scheduler" element={<Scheduler />} />
          </Routes>
        </main>
        {/* <Footer /> */}
      </div>
    </Router>
  );
};

export default App;
