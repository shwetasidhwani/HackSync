import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";


//Shweta imports









// Dhruv Imports










// Hringkesh imports 










// Ash imports
import CognitiveLoadPredictor from "./CognitiveEngagement/CognitiveLoadPredictor";






















const App = () => {
  return (
   <BrowserRouter>
    <Routes>
    <Route path="/Cognition" element={<CognitiveLoadPredictor />} />


    </Routes>
   </BrowserRouter>
  )
}

export default App