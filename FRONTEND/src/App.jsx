import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";


//Shweta imports









// Dhruv Imports
import Landing from "./Landing/Landing";
import Scheduler from "./Scheduler/Scheduler";
import Navbar from "./components/Navbar";










// Hringkesh imports 










// Ash imports
import CognitiveLoadPredictor from "./CognitiveEngagement/CognitiveLoadPredictor";
import MLCalendar from "./Calender/MLCalender";





















const App = () => {
  return (

   <BrowserRouter>
    <Routes>
    <div className="flex flex-col min-h-screen max-w-full overflow-hidden">
        <Navbar />
        <main className="flex-grow w-full "> 
      {/* Shweta Routes  */}












      {/* Dhruv Routes  */}
            <Route path="/" element={<Landing />} />
            {/* <Route path="/scheduler" element={<Scheduler />} /> */}























      {/* Hringkesh Routes  */}



















    {/* Ashmit Routes */}
    <Route path="/Cognition" element={<CognitiveLoadPredictor />} />
    <Route path="/Calendar" element={<MLCalendar />} />








    </main>
        {/* <Footer /> */}
      </div>
    </Routes>
   </BrowserRouter>
  )
}

export default App;
