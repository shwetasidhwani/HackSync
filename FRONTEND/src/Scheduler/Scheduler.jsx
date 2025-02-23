import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Scheduler = () => {
  const [formData, setFormData] = useState({
    Duration_Minutes: 23,
    Mood_Before: 3,
    Mood_After: 9,
    Previous_Interaction_Gap: 20,
    Interaction_Frequency_Score: 0.6,
    Social_Preference_Score: 2,
    Interaction_Type: "Call",
    Urgency_Score: 1
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Score') || name.includes('Minutes') || name.includes('Mood') || name.includes('Gap') 
        ? parseFloat(value) 
        : value
    }));
  };

  const handleSelectChange = (value) => {
    setFormData(prev => ({
      ...prev,
      Interaction_Type: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      setPrediction(data.prediction);
    } catch (error) {
      console.error('Error:', error);
      alert('Error getting prediction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Schedule Interaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="Duration_Minutes">Duration (Minutes)</Label>
              <Input
                id="Duration_Minutes"
                name="Duration_Minutes"
                type="number"
                value={formData.Duration_Minutes}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="Mood_Before">Mood Before (1-10)</Label>
              <Input
                id="Mood_Before"
                name="Mood_Before"
                type="number"
                min="1"
                max="10"
                value={formData.Mood_Before}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="Mood_After">Mood After (1-10)</Label>
              <Input
                id="Mood_After"
                name="Mood_After"
                type="number"
                min="1"
                max="10"
                value={formData.Mood_After}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="Previous_Interaction_Gap">Previous Gap (Days)</Label>
              <Input
                id="Previous_Interaction_Gap"
                name="Previous_Interaction_Gap"
                type="number"
                value={formData.Previous_Interaction_Gap}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="Interaction_Frequency_Score">Frequency Score (0-1)</Label>
              <Input
                id="Interaction_Frequency_Score"
                name="Interaction_Frequency_Score"
                type="number"
                step="0.1"
                min="0"
                max="1"
                value={formData.Interaction_Frequency_Score}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="Social_Preference_Score">Social Preference (1-5)</Label>
              <Input
                id="Social_Preference_Score"
                name="Social_Preference_Score"
                type="number"
                min="1"
                max="5"
                value={formData.Social_Preference_Score}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="Interaction_Type">Interaction Type</Label>
              <Select 
                value={formData.Interaction_Type} 
                onValueChange={handleSelectChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Call">Call</SelectItem>
                  <SelectItem value="Meeting">Meeting</SelectItem>
                  <SelectItem value="Message">Message</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="Urgency_Score">Urgency (1-5)</Label>
              <Input
                id="Urgency_Score"
                name="Urgency_Score"
                type="number"
                min="1"
                max="5"
                value={formData.Urgency_Score}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Getting Prediction...' : 'Get Prediction'}
          </Button>

          {prediction !== null && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <h3 className="font-semibold">Model Prediction:</h3>
              <p className="text-lg">{prediction}</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default Scheduler;