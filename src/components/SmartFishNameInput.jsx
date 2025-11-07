import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';
import { findMatchingFish, validateAndCorrectFishNames, getAllFishNames } from '../utils/fishNameMatching';

const SmartFishNameInput = ({ value, onChange, allFish, placeholder = "e.g., Surmai (King Fish), Pomfret (White)" }) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [matches, setMatches] = useState([]);
  const [validation, setValidation] = useState(null);

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  useEffect(() => {
    if (inputValue.trim()) {
      const matches = findMatchingFish(inputValue, allFish);
      setMatches(matches);
      
      const validation = validateAndCorrectFishNames(inputValue, allFish);
      setValidation(validation);
    } else {
      setMatches([]);
      setValidation(null);
    }
  }, [inputValue, allFish]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    const currentNames = inputValue.split(',').map(name => name.trim()).filter(name => name);
    const lastIndex = currentNames.length - 1;
    
    if (lastIndex >= 0) {
      currentNames[lastIndex] = suggestion;
    } else {
      currentNames.push(suggestion);
    }
    
    const newValue = currentNames.join(', ');
    setInputValue(newValue);
    onChange(newValue);
    setShowSuggestions(false);
  };

  const getAvailableFishNames = () => {
    return getAllFishNames(allFish);
  };

  return (
    <div className="relative">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Discounted Fish (comma-separated)
        </label>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent"
          placeholder={placeholder}
        />
        <p className="text-xs text-gray-500 mt-1">
          Enter fish names (exact or partial). System will suggest matches.
        </p>
      </div>

      {/* Validation Results */}
      {validation && (
        <div className="mt-3 space-y-2">
          {validation.warnings.map((warning, index) => (
            <div key={index} className={`flex items-center space-x-2 p-2 rounded-lg text-sm ${
              warning.includes('No matching fish found') 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : warning.includes('Please verify')
                ? 'bg-yellow-50 text-yellow-700 border border-yellow-200'
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              {warning.includes('No matching fish found') ? (
                <AlertTriangle className="w-4 h-4" />
              ) : warning.includes('Please verify') ? (
                <AlertTriangle className="w-4 h-4" />
              ) : (
                <CheckCircle className="w-4 h-4" />
              )}
              <span>{warning}</span>
            </div>
          ))}
        </div>
      )}

      {/* Suggestions Dropdown */}
      {showSuggestions && inputValue.trim() && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {/* Current Input Analysis */}
          {matches.length > 0 && (
            <div className="p-3 border-b border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Matching Fish:</h4>
              {matches.map((match, index) => (
                <div key={index} className="space-y-1">
                  <div className="text-sm text-gray-600">"{match.input}"</div>
                  {match.allMatches.map((fishMatch, fishIndex) => (
                    <button
                      key={fishIndex}
                      onClick={() => handleSuggestionClick(fishMatch.fish.name)}
                      className={`w-full text-left p-2 rounded hover:bg-gray-50 flex items-center justify-between ${
                        fishMatch.exactMatch ? 'bg-green-50' : ''
                      }`}
                    >
                      <span className="text-sm">{fishMatch.fish.name}</span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        fishMatch.exactMatch 
                          ? 'bg-green-100 text-green-700' 
                          : fishMatch.similarity > 0.7
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {fishMatch.exactMatch ? 'Exact' : `${Math.round(fishMatch.similarity * 100)}%`}
                      </span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* All Available Fish */}
          <div className="p-3">
            <h4 className="text-sm font-medium text-gray-700 mb-2">All Available Fish:</h4>
            <div className="grid grid-cols-1 gap-1 max-h-32 overflow-y-auto">
              {getAvailableFishNames().map((fishName, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(fishName)}
                  className="w-full text-left p-2 text-sm hover:bg-gray-50 rounded"
                >
                  {fishName}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Quick Add Buttons */}
      <div className="mt-3">
        <p className="text-xs text-gray-500 mb-2">Quick add popular fish:</p>
        <div className="flex flex-wrap gap-2">
          {['Surmai (King Fish)', 'Pomfret (White)', 'Prawns (Large)', 'Rohu', 'Crab (Medium)'].map((fishName) => (
            <button
              key={fishName}
              onClick={() => {
                const currentNames = inputValue.split(',').map(name => name.trim()).filter(name => name);
                if (!currentNames.includes(fishName)) {
                  const newValue = currentNames.length > 0 ? `${inputValue}, ${fishName}` : fishName;
                  setInputValue(newValue);
                  onChange(newValue);
                }
              }}
              className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
            >
              + {fishName}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SmartFishNameInput;
