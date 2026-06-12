export function transformApiPlan(apiResponse) {
  const { meta, days } = apiResponse
  
  const DAYS = days.map(day => ({
    id: day.day,
    label: day.day,
    type: day.type
  }))
  
  const WEEK_PLAN = {}
  days.forEach(day => {
    WEEK_PLAN[day.day] = {
      type: day.type,
      note: day.note,
      meals: day.meals
    }
  })
  
  return {
    DAYS,
    WEEK_PLAN,
    TARGET_PROTEIN: meta.daily_protein_target,
    meta
  }
}
