import { useState } from 'react';
import { ChefHat, Clock, Users, Flame, Utensils } from 'lucide-react';

const CookingGuide = ({ fish }) => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const recipes = {
    'Surmai': [
      {
        id: 1,
        name: 'Surmai Tawa Fry',
        difficulty: 'Easy',
        time: '25 mins',
        servings: '4',
        ingredients: [
          '1 kg Surmai (King Fish)',
          '2 tbsp red chili powder',
          '1 tbsp turmeric powder',
          '1 tbsp coriander powder',
          '2 tbsp ginger-garlic paste',
          '2 tbsp lemon juice',
          'Salt to taste',
          'Oil for frying'
        ],
        instructions: [
          'Clean and cut fish into medium pieces',
          'Marinate with all spices and lemon juice for 30 minutes',
          'Heat oil in a tawa/pan',
          'Fry fish pieces on medium heat until golden brown',
          'Serve hot with rice and curry'
        ],
        tips: 'For extra crispiness, dust with rice flour before frying',
        image: '/images/recipes/surmai-fry.jpg'
      },
      {
        id: 2,
        name: 'Surmai Curry',
        difficulty: 'Medium',
        time: '35 mins',
        servings: '4',
        ingredients: [
          '1 kg Surmai pieces',
          '2 onions, sliced',
          '3 tomatoes, pureed',
          '1 cup coconut milk',
          '2 tbsp curry powder',
          '1 tbsp garam masala',
          'Green chilies, curry leaves',
          'Oil, salt to taste'
        ],
        instructions: [
          'Heat oil and sauté onions until golden',
          'Add tomato puree and cook until oil separates',
          'Add curry powder and cook for 2 minutes',
          'Add coconut milk and bring to boil',
          'Add fish pieces and simmer for 15 minutes',
          'Garnish with curry leaves and serve'
        ],
        tips: 'Add a pinch of sugar to balance the tanginess',
        image: '/images/recipes/surmai-curry.jpg'
      }
    ],
    'Pomfret': [
      {
        id: 3,
        name: 'Pomfret Masala Fry',
        difficulty: 'Easy',
        time: '20 mins',
        servings: '2',
        ingredients: [
          '2 medium Pomfret',
          '3 tbsp red chili powder',
          '1 tbsp turmeric',
          '2 tbsp coriander powder',
          '1 tbsp cumin powder',
          'Ginger-garlic paste',
          'Lemon juice, salt',
          'Oil for frying'
        ],
        instructions: [
          'Make slits on both sides of fish',
          'Apply masala paste and marinate for 20 minutes',
          'Heat oil in a pan',
          'Fry fish on both sides until crispy',
          'Serve with lemon wedges'
        ],
        tips: 'Don\'t overcook - Pomfret cooks quickly',
        image: '/images/recipes/pomfret-fry.jpg'
      }
    ],
    'Rohu': [
      {
        id: 4,
        name: 'Rohu Fish Curry',
        difficulty: 'Medium',
        time: '30 mins',
        servings: '4',
        ingredients: [
          '1 kg Rohu pieces',
          '2 onions, 3 tomatoes',
          '1 cup tamarind extract',
          '2 tbsp sambar powder',
          '1 tbsp turmeric',
          'Curry leaves, mustard seeds',
          'Oil, salt to taste'
        ],
        instructions: [
          'Heat oil, add mustard seeds and curry leaves',
          'Add onions and sauté until soft',
          'Add tomatoes and cook until mushy',
          'Add tamarind extract and spices',
          'Add fish pieces and cook for 15 minutes',
          'Garnish with coriander leaves'
        ],
        tips: 'Use fresh tamarind for best flavor',
        image: '/images/recipes/rohu-curry.jpg'
      }
    ]
  };

  const fishRecipes = recipes[fish.name] || [];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <ChefHat className="h-6 w-6 text-blue-600" />
          <h3 className="text-2xl font-bold text-gray-900">Cooking Guide for {fish.name}</h3>
        </div>
        <p className="text-gray-600">Discover delicious recipes to make the most of your fresh catch</p>
      </div>

      {fishRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {fishRecipes.map((recipe) => (
            <div key={recipe.id} className="card p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <h4 className="text-xl font-bold text-gray-900">{recipe.name}</h4>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(recipe.difficulty)}`}>
                  {recipe.difficulty}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{recipe.time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{recipe.servings} servings</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Flame className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Medium heat</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2 flex items-center">
                    <Utensils className="h-4 w-4 mr-2" />
                    Ingredients
                  </h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {recipe.ingredients.map((ingredient, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        {ingredient}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">Instructions</h5>
                  <ol className="text-sm text-gray-600 space-y-2">
                    {recipe.instructions.map((instruction, index) => (
                      <li key={index} className="flex items-start">
                        <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                          {index + 1}
                        </span>
                        {instruction}
                      </li>
                    ))}
                  </ol>
                </div>

                {recipe.tips && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <h6 className="font-semibold text-yellow-800 mb-1">💡 Pro Tip</h6>
                    <p className="text-sm text-yellow-700">{recipe.tips}</p>
                  </div>
                )}

                <button
                  onClick={() => setSelectedRecipe(selectedRecipe === recipe.id ? null : recipe.id)}
                  className="w-full btn-primary"
                >
                  {selectedRecipe === recipe.id ? 'Hide Details' : 'View Full Recipe'}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <ChefHat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-600 mb-2">Recipes Coming Soon!</h4>
          <p className="text-gray-500">We're working on adding delicious recipes for {fish.name}</p>
        </div>
      )}

      {/* General Cooking Tips */}
      <div className="card p-6 bg-gradient-to-r from-blue-50 to-cyan-50">
        <h4 className="text-lg font-bold text-gray-900 mb-4">🐟 General Fish Cooking Tips</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <h5 className="font-semibold text-blue-600 mb-2">Freshness Check</h5>
            <ul className="text-gray-600 space-y-1">
              <li>• Clear, bright eyes</li>
              <li>• Firm, springy flesh</li>
              <li>• Fresh, ocean-like smell</li>
            </ul>
          </div>
          <div>
            <h5 className="font-semibold text-blue-600 mb-2">Cooking Methods</h5>
            <ul className="text-gray-600 space-y-1">
              <li>• Fry: High heat, quick cooking</li>
              <li>• Curry: Medium heat, longer simmer</li>
              <li>• Grill: Medium-high, 4-6 mins per side</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookingGuide;
