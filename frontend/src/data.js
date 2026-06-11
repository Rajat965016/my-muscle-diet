const DAY_NAMES = {
  Mon: 'Monday',
  Tue: 'Tuesday',
  Wed: 'Wednesday',
  Thu: 'Thursday',
  Fri: 'Friday',
  Sat: 'Saturday',
  Sun: 'Sunday'
};

/**
 * Transforms the raw API JSON response from OpenAI into the shape 
 * the existing frontend components expect.
 */
export function getPlanData(apiResponse) {
  if (!apiResponse || !apiResponse.days) {
    return {
      DAYS: [],
      WEEK_PLAN: {},
      targetProtein: 130
    };
  }

  // Generate the DAYS array for the DaySelector
  const DAYS = apiResponse.days.map(d => ({
    id: d.day,
    name: DAY_NAMES[d.day] || d.day,
    type: d.type // "Veg", "Egg", or "NonVeg"
  }));

  // Generate a dictionary keyed by day ID for quick lookups
  const WEEK_PLAN = {};
  
  apiResponse.days.forEach(day => {
    // Dynamically calculate the total protein for this day
    const totalProteinLabel = day.meals.reduce((total, meal) => {
      return total + meal.items.reduce((mealTotal, item) => mealTotal + item.protein, 0);
    }, 0);

    WEEK_PLAN[day.day] = {
      type: day.type,
      note: day.note,
      totalProteinLabel,
      meals: day.meals
    };
  });

  return {
    DAYS,
    WEEK_PLAN,
    targetProtein: apiResponse.meta?.daily_protein_target || 130
  };
}