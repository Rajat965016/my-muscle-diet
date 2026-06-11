export const DAYS = [
  { id: 'Mon', name: 'Monday', type: 'Egg' },
  { id: 'Tue', name: 'Tuesday', type: 'Veg' },
  { id: 'Wed', name: 'Wednesday', type: 'Egg' },
  { id: 'Thu', name: 'Thursday', type: 'Veg' },
  { id: 'Fri', name: 'Friday', type: 'Egg' },
  { id: 'Sat', name: 'Saturday', type: 'Veg' },
  { id: 'Sun', name: 'Sunday', type: 'Egg' }
];

export const TARGET_PROTEIN = 130;

const SHARED_MEALS = {
  snack: {
    name: 'Mid-morning snack',
    time: '10:30 AM',
    items: [
      { name: 'Sattu sharbat 3 tbsp', protein: 10, tag: 'ADD' },
      { name: 'Roasted peanuts 30g', protein: 8, tag: 'ADD' },
    ]
  },
  lunch: {
    name: 'Lunch',
    time: '2:00 PM',
    items: [
      { name: '4 chapati', protein: 12, tag: 'existing' },
      { name: '1 bowl sabzi', protein: 3, tag: 'existing' },
      { name: '100g paneer on side', protein: 18, tag: 'ADD' },
    ]
  },
  dinner: {
    name: 'Dinner',
    time: '9:00 PM',
    items: [
      { name: 'Full plate rice', protein: 8, tag: 'existing' },
      { name: '75g dry soya chunks', protein: 39, tag: 'existing' },
      { name: '1 bowl dal', protein: 8, tag: 'existing' },
    ]
  }
};

export const EGG_DAY_PLAN = {
  note: "Boil 5 eggs tonight for tomorrow morning",
  totalProteinLabel: 166, // calculated sum
  meals: [
    {
      name: 'Breakfast',
      time: '7:00 AM',
      items: [
        { name: '2 chapati', protein: 6, tag: 'existing' },
        { name: '3 glasses milk', protein: 15, tag: 'existing' },
        { name: '5 boiled eggs', protein: 30, tag: 'ADD' },
      ]
    },
    SHARED_MEALS.snack,
    SHARED_MEALS.lunch,
    {
      name: 'Evening / Post-gym',
      time: '5:30 PM',
      items: [
        { name: '1 glass milk', protein: 8, tag: 'ADD' },
        { name: '1 banana', protein: 1, tag: 'existing' },
      ]
    },
    SHARED_MEALS.dinner
  ]
};

export const VEG_DAY_PLAN = {
  note: "Soak moong + chana tonight for tomorrow",
  totalProteinLabel: 208, // calculated sum
  meals: [
    {
      name: 'Breakfast',
      time: '7:00 AM',
      items: [
        { name: '2 chapati', protein: 6, tag: 'existing' },
        { name: '3 glasses milk', protein: 15, tag: 'existing' },
        { name: '150g dry moong sprouted chaat', protein: 35, tag: 'ADD' },
      ]
    },
    SHARED_MEALS.snack,
    SHARED_MEALS.lunch,
    {
      name: 'Evening / Post-gym',
      time: '5:30 PM',
      items: [
        { name: 'Chana chaat 200g dry soaked', protein: 38, tag: 'ADD' },
        { name: '1 glass milk', protein: 8, tag: 'ADD' },
      ]
    },
    SHARED_MEALS.dinner
  ]
};

export const getDayPlan = (type) => {
  return type === 'Egg' ? EGG_DAY_PLAN : VEG_DAY_PLAN;
};
