import { DEFAULT_PROTEIN_TARGET } from '../constants';

export function transformApiPlan(apiResponse) {
  if (!apiResponse || !apiResponse.days) {
    throw new Error("Invalid plan structure: missing days");
  }

  const meta = apiResponse.meta || {};
  const targetProtein = Number(meta.daily_protein_target) || DEFAULT_PROTEIN_TARGET;
  meta.daily_protein_target = targetProtein;

  const days = Array.isArray(apiResponse.days) ? apiResponse.days : Object.values(apiResponse.days);

  const DAYS = days.map(day => {
    let dayProtein = 0;
    let dayCalories = 0;
    let hasCalorieData = false;

    if (Array.isArray(day.meals)) {
      day.meals.forEach(m => {
        if (Array.isArray(m.items)) {
          m.items.forEach(it => {
            dayProtein += Number(it.protein) || 0;
            const itemCal = Number(it.calories);
            if (!isNaN(itemCal) && itemCal > 0) {
              dayCalories += itemCal;
              hasCalorieData = true;
            }
          });
        } else if (m.calories && !isNaN(Number(m.calories)) && Number(m.calories) > 0) {
          dayCalories += Number(m.calories);
          hasCalorieData = true;
        }
      });
    }

    return {
      id: day.day,
      label: day.day,
      type: day.type || "Veg",
      note: day.note || "Stay hydrated and hit your daily macros.",
      totalProtein: Math.round(dayProtein) || targetProtein,
      totalCalories: hasCalorieData ? Math.round(dayCalories) : null,
      mealsCount: Array.isArray(day.meals) ? day.meals.length : 5
    };
  });

  const WEEK_PLAN = {};
  days.forEach(day => {
    let dayProtein = 0;
    let dayCalories = 0;
    let hasDayCalorieData = false;

    const normalizedMeals = (day.meals || []).map(m => {
      let mealProtein = 0;
      let mealCalories = 0;
      let hasMealCalorieData = false;

      const normalizedItems = (m.items || []).map(it => {
        const prot = Number(it.protein) || 0;
        const rawCal = Number(it.calories);
        const itemCal = (!isNaN(rawCal) && rawCal > 0) ? Math.round(rawCal) : null;
        
        mealProtein += prot;
        if (itemCal !== null) {
          mealCalories += itemCal;
          hasMealCalorieData = true;
        }

        return {
          name: it.name || "Healthy food item",
          protein: prot,
          calories: itemCal,
          tag: it.tag || "existing"
        };
      });

      if (!hasMealCalorieData && m.calories && !isNaN(Number(m.calories)) && Number(m.calories) > 0) {
        mealCalories = Math.round(Number(m.calories));
        hasMealCalorieData = true;
      }

      dayProtein += mealProtein;
      if (hasMealCalorieData) {
        dayCalories += mealCalories;
        hasDayCalorieData = true;
      }

      return {
        name: m.name || "Meal",
        time: m.time || "12:00 PM",
        protein: Math.round(mealProtein),
        calories: hasMealCalorieData ? Math.round(mealCalories) : null,
        items: normalizedItems
      };
    });

    const finalDayProtein = Math.round(dayProtein) || targetProtein;
    const finalDayCalories = hasDayCalorieData ? Math.round(dayCalories) : null;

    WEEK_PLAN[day.day] = {
      type: day.type || "Veg",
      note: day.note || "Stay consistent with your daily macros.",
      meals: normalizedMeals,
      totalProtein: finalDayProtein,
      totalProteinLabel: finalDayProtein,
      totalCalories: finalDayCalories
    };
  });

  return {
    DAYS,
    WEEK_PLAN,
    TARGET_PROTEIN: targetProtein,
    meta
  };
}
