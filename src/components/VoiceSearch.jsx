import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Search, X } from 'lucide-react';

const VoiceSearch = ({ onSearch, onClose, fishList = [] }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [language, setLanguage] = useState('en-IN');
  
  const recognitionRef = useRef(null);
  const synthRef = useRef(null);

  useEffect(() => {
    // Check for speech recognition support
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = language;
      
      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setIsProcessing(false);
      };
      
      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }
        
        setTranscript(finalTranscript || interimTranscript);
        
        if (finalTranscript) {
          processVoiceCommand(finalTranscript);
        }
      };
      
      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        setIsProcessing(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    // Check for speech synthesis support
    if ('speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [language]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const processVoiceCommand = (command) => {
    setIsProcessing(true);
    
    // Process the voice command
    const processedCommand = command.toLowerCase().trim();
    
    // Common fish names in different languages
    const fishKeywords = {
      'surmai': 'surmai',
      'king fish': 'surmai',
      'pomfret': 'pomfret',
      'rohu': 'rohu',
      'katla': 'katla',
      'prawns': 'prawns',
      'crab': 'crab',
      'price': 'price',
      'rate': 'rate',
      'cost': 'cost',
      'fresh': 'fresh',
      'available': 'available',
      'stock': 'stock'
    };

    // Extract search terms
    const searchTerms = [];
    Object.entries(fishKeywords).forEach(([keyword, value]) => {
      if (processedCommand.includes(keyword)) {
        searchTerms.push(value);
      }
    });

    // If no specific fish mentioned, use the entire command
    if (searchTerms.length === 0) {
      searchTerms.push(processedCommand);
    }

    // Perform search
    const { results, matchedFish, resolvedQuery, normalizedTerms } = performSearch(searchTerms, processedCommand);
    setSearchResults(results);
    
    // Auto-trigger search in catalog with the best match
    const searchQuery = (resolvedQuery || normalizedTerms.join(' ') || processedCommand || '').trim();
    if (searchQuery && typeof onSearch === 'function') {
      onSearch(searchQuery, {
        matchedFish,
        searchTerms: normalizedTerms,
        rawCommand: command
      });
    }
    
    // Speak the results
    speakResults(results, processedCommand);
    
    setIsProcessing(false);
  };

  const performSearch = (searchTerms, originalCommand) => {
    const normalizedTerms = Array.from(
      new Set(
        searchTerms
          .map(term => term.toLowerCase().trim())
          .filter(Boolean)
      )
    );
    
    const cleanedCommand = originalCommand.toLowerCase().trim();
    const commandTokens = cleanedCommand.split(/\s+/).filter(Boolean);
    
    let matchedFish = fishList.filter(fish => {
      const fishName = (fish.name || '').toLowerCase();
      if (!fishName) return false;
      return normalizedTerms.some(term => fishName.includes(term));
    });
    
    if (matchedFish.length === 0 && commandTokens.length) {
      matchedFish = fishList.filter(fish => {
        const fishName = (fish.name || '').toLowerCase();
        if (!fishName) return false;
        return commandTokens.some(token => fishName.includes(token));
      });
    }
    
    const results = [];
    
    if (matchedFish.length > 0) {
      results.push({
        type: 'fish',
        message: matchedFish.length === 1
          ? `Found ${matchedFish[0].name} in today’s list`
          : `Found ${matchedFish.length} fish matching your request`,
        data: matchedFish
      });
    }
    
    if (cleanedCommand.includes('price') || cleanedCommand.includes('rate')) {
      results.push({
        type: 'price',
        message: 'Here are today\'s fish rates',
        data: matchedFish.length
          ? matchedFish.map(fish => `${fish.name} – ₹${fish.rate}`)
          : normalizedTerms
      });
    } else if (cleanedCommand.includes('fresh') || cleanedCommand.includes('available') || cleanedCommand.includes('stock')) {
      results.push({
        type: 'availability',
        message: 'Here are the fresh fish available today',
        data: matchedFish.length
          ? matchedFish
              .filter(fish => fish.inStock)
              .map(fish => `${fish.name} – In Stock`)
          : matchedFish.map(fish => fish.name)
      });
    }
    
    if (results.length === 0) {
      results.push({
        type: 'search',
        message: `Searching for: ${normalizedTerms.join(', ') || cleanedCommand}`,
        data: normalizedTerms.length ? normalizedTerms : commandTokens
      });
    }
    
    const resolvedQuery = matchedFish.length > 0
      ? matchedFish[0].name
      : (normalizedTerms[0] || cleanedCommand);
    
    return {
      results,
      matchedFish,
      resolvedQuery,
      normalizedTerms
    };
  };

  const speakResults = (results, originalCommand) => {
    if (synthRef.current) {
      const utterance = new SpeechSynthesisUtterance();
      
      if (results.length > 0) {
        utterance.text = results[0].message;
      } else {
        utterance.text = 'Sorry, I didn\'t understand that. Please try again.';
      }
      
      utterance.lang = language;
      utterance.rate = 0.8;
      utterance.pitch = 1;
      
      synthRef.current.speak(utterance);
    }
  };

  const handleSearch = () => {
    const trimmedTranscript = transcript.trim();
    const fishResult = searchResults.find(
      (result) => result.type === 'fish' && Array.isArray(result.data) && result.data.length > 0
    );
    
    const fallbackQuery = trimmedTranscript || (fishResult ? fishResult.data[0].name : '');
    const safeQuery = (fallbackQuery || '').trim();
    
    if (safeQuery && typeof onSearch === 'function') {
      onSearch(safeQuery, {
        matchedFish: fishResult ? fishResult.data : [],
        rawCommand: transcript
      });
    }
    
    onClose();
  };

  const clearTranscript = () => {
    setTranscript('');
    setSearchResults([]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">Voice Search</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {!isSupported ? (
          <div className="text-center py-8">
            <MicOff className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-600 mb-2">Voice Search Not Supported</h4>
            <p className="text-gray-500">Your browser doesn't support voice search. Please use text search instead.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Language Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              >
                <option value="en-IN">English (India)</option>
                <option value="hi-IN">Hindi (India)</option>
                <option value="mr-IN">Marathi (India)</option>
                <option value="gu-IN">Gujarati (India)</option>
                <option value="bn-IN">Bengali (India)</option>
              </select>
            </div>

            {/* Voice Controls */}
            <div className="text-center">
              <div className="mb-4">
                <button
                  onClick={isListening ? stopListening : startListening}
                  className={`w-20 h-20 rounded-full flex items-center justify-center text-white transition-all duration-300 ${
                    isListening 
                      ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                      : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  {isListening ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
                </button>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                {isListening ? 'Listening... Speak now' : 'Click to start voice search'}
              </p>
              
              <div className="space-y-2 text-sm text-gray-500">
                <p>Try saying:</p>
                <p>"Surmai price" • "Fresh fish available" • "Pomfret rate"</p>
              </div>
            </div>

            {/* Transcript */}
            {transcript && (
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">You said:</h4>
                  <button
                    onClick={clearTranscript}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-gray-700">{transcript}</p>
              </div>
            )}

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">Search Results:</h4>
                {searchResults.map((result, index) => (
                  <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-blue-700 font-medium">{result.message}</p>
                    
                    {result.type === 'fish' && Array.isArray(result.data) && result.data.length > 0 && (
                      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {result.data.slice(0, 6).map((fish) => (
                          <div
                            key={`${fish.id ?? fish.name}-${fish.rate}`}
                            className="bg-white/80 rounded-lg px-3 py-2 flex items-center justify-between text-sm text-gray-700"
                          >
                            <div>
                              <p className="font-semibold text-gray-900">{fish.name}</p>
                              <p className="text-xs text-gray-500 capitalize">{fish.category}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-blue-600">₹{fish.rate}</p>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  fish.inStock ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                                }`}
                              >
                                {fish.inStock ? 'In Stock' : 'Out of Stock'}
                              </span>
                            </div>
                          </div>
                        ))}
                        {result.data.length > 6 && (
                          <p className="text-xs text-gray-500 col-span-full">
                            Showing first 6 matches. Try refining your search for more specific results.
                          </p>
                        )}
                      </div>
                    )}
                    
                    {result.type !== 'fish' && Array.isArray(result.data) && result.data.length > 0 && (
                      <p className="mt-2 text-xs text-gray-600">
                        {result.data.join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Processing Indicator */}
            {isProcessing && (
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-600 mt-2">Processing your request...</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handleSearch}
                disabled={!transcript.trim()}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </button>
              <button
                onClick={onClose}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceSearch;
