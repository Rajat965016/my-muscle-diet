import React, { useState, useEffect } from 'react';

const STEP_COUNT = 3;

function Pill({ label, isSelected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-4 py-2.5 rounded-full text-sm font-bold border transition-all duration-200 select-none ${
        isSelected 
          ? 'bg-[#163816] text-app-green border-app-green' 
          : 'bg-[#1f1f1f] text-gray-400 border-[#333333] hover:bg-[#252525]'
      }`}
    >
      {label}
    </button>
  );
}

function PillGroup({ label, options, selectedValue, onSelect, error, direction = "row" }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-app-muted mb-2.5 uppercase tracking-wider">{label}</label>
      <div className={`flex ${direction === 'col' ? 'flex-col space-y-2.5' : 'flex-wrap gap-2.5'}`}>
        {options.map(opt => (
          <Pill key={opt} label={opt} isSelected={selectedValue === opt} onClick={() => onSelect(opt)} />
        ))}
      </div>
      {error && <p className="text-red-500 text-xs mt-1.5 font-semibold">{error}</p>}
    </div>
  );
}

function InputField({ label, type = 'text', value, onChange, placeholder, min, max, error }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-app-muted mb-1.5 uppercase tracking-wider">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        className={`w-full bg-[#1a1a1a] border rounded-xl px-4 py-3 text-white focus:outline-none transition-colors font-medium placeholder-gray-600 ${
          error ? 'border-red-500 focus:border-red-500' : 'border-[#2a2a2a] focus:border-app-green'
        }`}
      />
      {error && <p className="text-red-500 text-xs mt-1.5 font-semibold">{error}</p>}
    </div>
  );
}

export default function Onboarding({ onSubmit }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    email: "", 
    name: "", 
    age: "", 
    weight: "", 
    height: "", 
    gender: "",
    goal: "", 
    activity_level: "", 
    diet_type: "", 
    allergies: "",
    city: "", 
    budget: "", 
    gym_timing: "", 
    protein_target: 130
  });

  useEffect(() => {
    console.log("Current step:", currentStep);
  }, [currentStep]);

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep = (stepToValidate) => {
    const newErrors = {};
    if (stepToValidate === 1) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Valid email is required";
      if (!formData.name || formData.name.length < 2 || !/^[a-zA-Z\s]+$/.test(formData.name)) newErrors.name = "Name must be at least 2 letters (letters and spaces only)";
      
      const ageNum = parseInt(formData.age, 10);
      if (isNaN(ageNum) || ageNum < 10 || ageNum > 80) newErrors.age = "Age must be between 10 and 80";
      
      const weightNum = parseFloat(formData.weight);
      if (isNaN(weightNum) || weightNum < 30 || weightNum > 200) newErrors.weight = "Weight must be between 30 and 200 kg";
      
      const heightNum = parseFloat(formData.height);
      if (isNaN(heightNum) || heightNum < 100 || heightNum > 250) newErrors.height = "Height must be between 100 and 250 cm";
      
      if (!formData.gender) newErrors.gender = "Please select a gender";
    } 
    else if (stepToValidate === 2) {
      if (!['Bulk Up', 'Lose Fat', 'Maintain'].includes(formData.goal)) newErrors.goal = "Please select a primary goal";
      if (!formData.activity_level) newErrors.activity_level = "Please select an activity level";
      if (!formData.diet_type) newErrors.diet_type = "Please select a diet type";
    } 
    else if (stepToValidate === 3) {
      if (!formData.city || formData.city.length < 2) newErrors.city = "City must be at least 2 characters";
      if (!formData.budget) newErrors.budget = "Please select a budget";
      if (!formData.gym_timing) newErrors.gym_timing = "Please select a gym timing";
      
      const proteinNum = parseInt(formData.protein_target, 10);
      if (isNaN(proteinNum) || proteinNum < 80 || proteinNum > 300) newErrors.protein_target = "Protein target must be between 80 and 300";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    if (validateStep(3)) {
      setIsSubmitting(true);
      await onSubmit(formData);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-app-bg text-app-text p-5 max-w-md mx-auto flex flex-col font-sans">
      <div className="py-6">
        <h1 className="text-2xl font-black text-white uppercase tracking-wide">Personalize Plan</h1>
        <p className="text-app-green font-bold text-sm mt-1">Step {currentStep} of {STEP_COUNT}</p>
        
        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-[#1f1f1f] rounded-full overflow-hidden mt-4">
          <div 
            className="h-full bg-app-green transition-all duration-300"
            style={{ width: `${(currentStep / STEP_COUNT) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="flex-1 bg-app-card border border-app-border rounded-2xl p-6 shadow-lg mb-6 overflow-y-auto hide-scrollbar animate-fade-slide-up">
        {Object.keys(errors).length > 0 && (
          <div className="mb-6 p-4 border border-red-500 bg-red-900/20 rounded-xl text-red-500 font-bold text-sm text-center">
            Please fix the errors below before continuing
          </div>
        )}

        {currentStep === 1 && (
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white mb-6">Your Stats</h2>
            
            <InputField label="Email Address" type="email" value={formData.email} onChange={(e) => updateForm('email', e.target.value)} placeholder="you@example.com" error={errors.email} />
            <InputField label="Full Name" value={formData.name} onChange={(e) => updateForm('name', e.target.value)} placeholder="e.g. Rahul Sharma" error={errors.name} />
            
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Age" type="number" value={formData.age} onChange={(e) => updateForm('age', e.target.value)} placeholder="15-60" error={errors.age} />
              <InputField label="Weight (kg)" type="number" value={formData.weight} onChange={(e) => updateForm('weight', e.target.value)} placeholder="e.g. 65" error={errors.weight} />
            </div>
            
            <InputField label="Height (cm)" type="number" value={formData.height} onChange={(e) => updateForm('height', e.target.value)} placeholder="e.g. 175" error={errors.height} />
            
            <PillGroup 
              label="Gender" 
              options={['Male', 'Female']} 
              selectedValue={formData.gender} 
              onSelect={(val) => updateForm('gender', val)} 
              error={errors.gender} 
            />
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white mb-6">Your Goals</h2>
            
            <PillGroup 
              label="Primary Goal" 
              options={['Bulk Up', 'Lose Fat', 'Maintain']} 
              selectedValue={formData.goal} 
              onSelect={(val) => updateForm('goal', val)} 
              error={errors.goal} 
            />

            <PillGroup 
              label="Activity Level" 
              options={['Light (1-2x/week)', 'Moderate (3-4x/week)', 'Intense (5-6x/week)']} 
              selectedValue={formData.activity_level} 
              onSelect={(val) => updateForm('activity_level', val)} 
              error={errors.activity_level} 
              direction="col"
            />

            <PillGroup 
              label="Diet Type" 
              options={['Pure Veg', 'Veg + Eggs', 'Non-Veg']} 
              selectedValue={formData.diet_type} 
              onSelect={(val) => updateForm('diet_type', val)} 
              error={errors.diet_type} 
            />

            <InputField 
              label="Allergies (Optional)" 
              value={formData.allergies} 
              onChange={(e) => updateForm('allergies', e.target.value)} 
              placeholder="e.g. peanuts, lactose" 
            />
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white mb-6">Your Lifestyle</h2>
            
            <InputField label="City" value={formData.city} onChange={(e) => updateForm('city', e.target.value)} placeholder="e.g. Mumbai" error={errors.city} />
            
            <PillGroup 
              label="Budget" 
              options={['Low (₹150/day)', 'Medium (₹300/day)', 'High (₹500+/day)']} 
              selectedValue={formData.budget} 
              onSelect={(val) => updateForm('budget', val)} 
              error={errors.budget} 
              direction="col"
            />

            <PillGroup 
              label="Gym Timing" 
              options={['Morning', 'Evening']} 
              selectedValue={formData.gym_timing} 
              onSelect={(val) => updateForm('gym_timing', val)} 
              error={errors.gym_timing} 
            />

            <InputField label="Daily Protein Target (g)" type="number" value={formData.protein_target} onChange={(e) => updateForm('protein_target', e.target.value)} error={errors.protein_target} />
          </div>
        )}
      </div>

      <div className="flex justify-between items-center pb-4 space-x-4">
        {currentStep > 1 ? (
          <button 
            onClick={handleBack}
            className="px-6 py-4 rounded-xl text-white font-bold bg-transparent hover:bg-[#1a1a1a] transition-colors border border-[#333]"
          >
            Back
          </button>
        ) : (
          <div /> // Placeholder to keep flex alignment
        )}

        {currentStep < 3 ? (
          <button 
            onClick={handleNext}
            className="flex-1 py-4 rounded-xl text-white font-bold bg-[#22c55e] hover:bg-green-400 transition-colors"
          >
            Next Step
          </button>
        ) : (
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 py-4 rounded-xl text-white font-bold bg-[#22c55e] hover:bg-green-400 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 shadow-[0_0_15px_rgba(34,197,94,0.3)]"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span>⚡ Generate My Diet Plan</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
