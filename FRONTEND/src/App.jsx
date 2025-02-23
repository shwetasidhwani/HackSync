import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";


//Shweta imports
import SocialNetwork from "./SocialNetwork/SocialNetwork";








// Dhruv Imports










// Hringkesh imports 










// Ash imports
import CognitiveLoadPredictor from "./CognitiveEngagement/CognitiveLoadPredictor";
import MLCalendar from "./Calender/MLCalender";






















const App = () => {
  return (
   <BrowserRouter>
    <Routes>

      {/* Shweta Routes  */}
      <Route path="/SocialNetwork" element={<SocialNetwork />} />











      {/* Dhruv Routes  */}
























      {/* Hringkesh Routes  */}



















    {/* Ashmit Routes */}
    <Route path="/Cognition" element={<CognitiveLoadPredictor />} />
    <Route path="/Calendar" element={<MLCalendar />} />









    </Routes>
   </BrowserRouter>
  )
}

export default App;
