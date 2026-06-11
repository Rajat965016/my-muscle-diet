export const DAYS = [
  { id: 'Mon', name: 'Monday',    type: 'Egg' },
  { id: 'Tue', name: 'Tuesday',   type: 'Veg' },
  { id: 'Wed', name: 'Wednesday', type: 'Egg' },
  { id: 'Thu', name: 'Thursday',  type: 'Veg' },
  { id: 'Fri', name: 'Friday',    type: 'Egg' },
  { id: 'Sat', name: 'Saturday',  type: 'Veg' },
  { id: 'Sun', name: 'Sunday',    type: 'Egg' },
];

export const TARGET_PROTEIN = 130;

export const WEEK_PLAN = {
  Mon: {
    type: 'Egg',
    note: 'Soak moong tonight for Tuesday breakfast.',
    meals: [
      {
        name: 'Breakfast', time: '7:00 AM',
        items: [
          { name: '2 chapati',       protein: 6,  tag: 'existing' },
          { name: '2 glasses milk',  protein: 10, tag: 'existing' },
          { name: '5 boiled eggs',   protein: 30, tag: 'ADD' },
        ]
      },
      {
        name: 'Mid-morning snack', time: '10:30 AM',
        items: [
          { name: 'Banana shake (1 banana + milk)',  protein: 6,  tag: 'ADD' },
          { name: 'Roasted peanuts 30g',             protein: 8,  tag: 'ADD' },
        ]
      },
      {
        name: 'Lunch', time: '2:00 PM',
        items: [
          { name: '4 chapati',            protein: 12, tag: 'existing' },
          { name: 'Chicken curry 150g',   protein: 35, tag: 'ADD' },
          { name: 'Cucumber + onion salad', protein: 2, tag: 'ADD' },
        ]
      },
      {
        name: 'Evening / Post-gym', time: '5:30 PM',
        items: [
          { name: '3 boiled eggs',   protein: 18, tag: 'ADD' },
          { name: '1 banana',        protein: 1,  tag: 'existing' },
        ]
      },
      {
        name: 'Dinner', time: '9:00 PM',
        items: [
          { name: '3 chapati / roti',       protein: 9,  tag: 'existing' },
          { name: '75g dry soya chunks',    protein: 39, tag: 'existing' },
          { name: 'Tomato + onion salad',   protein: 2,  tag: 'ADD' },
        ]
      },
    ]
  },

  Tue: {
    type: 'Veg',
    note: 'Soak chana tonight for Wednesday evening.',
    meals: [
      {
        name: 'Breakfast', time: '7:00 AM',
        items: [
          { name: '2 chapati',                       protein: 6,  tag: 'existing' },
          { name: '2 glasses milk',                  protein: 10, tag: 'existing' },
          { name: 'Sprouted moong chaat 150g dry',   protein: 35, tag: 'ADD' },
        ]
      },
      {
        name: 'Mid-morning snack', time: '10:30 AM',
        items: [
          { name: 'Sattu sharbat 3 tbsp',  protein: 10, tag: 'ADD' },
          { name: 'Roasted peanuts 30g',   protein: 8,  tag: 'ADD' },
        ]
      },
      {
        name: 'Lunch', time: '2:00 PM',
        items: [
          { name: '4 chapati',              protein: 12, tag: 'existing' },
          { name: '100g paneer bhurji',     protein: 18, tag: 'ADD' },
          { name: 'Cucumber + tomato salad',protein: 2,  tag: 'ADD' },
        ]
      },
      {
        name: 'Evening / Post-gym', time: '5:30 PM',
        items: [
          { name: 'Chana chaat 200g dry soaked', protein: 38, tag: 'ADD' },
          { name: '1 banana',                    protein: 1,  tag: 'existing' },
        ]
      },
      {
        name: 'Dinner', time: '9:00 PM',
        items: [
          { name: '3 chapati / roti',     protein: 9,  tag: 'existing' },
          { name: '1 bowl rajma',         protein: 15, tag: 'existing' },
          { name: '1 bowl dal',           protein: 8,  tag: 'existing' },
          { name: 'Onion + lemon salad',  protein: 1,  tag: 'ADD' },
        ]
      },
    ]
  },

  Wed: {
    type: 'Egg',
    note: 'Soak moong tonight for Thursday breakfast.',
    meals: [
      {
        name: 'Breakfast', time: '7:00 AM',
        items: [
          { name: '2 chapati',           protein: 6,  tag: 'existing' },
          { name: '2 glasses milk',      protein: 10, tag: 'existing' },
          { name: '5 boiled eggs',       protein: 30, tag: 'ADD' },
        ]
      },
      {
        name: 'Mid-morning snack', time: '10:30 AM',
        items: [
          { name: 'Banana shake (1 banana + milk)', protein: 6,  tag: 'ADD' },
          { name: 'Handful roasted chana 30g',      protein: 7,  tag: 'ADD' },
        ]
      },
      {
        name: 'Lunch', time: '2:00 PM',
        items: [
          { name: '4 chapati',               protein: 12, tag: 'existing' },
          { name: 'Egg bhurji (3 eggs)',      protein: 18, tag: 'ADD' },
          { name: 'Onion + tomato salad',     protein: 2,  tag: 'ADD' },
        ]
      },
      {
        name: 'Evening / Post-gym', time: '5:30 PM',
        items: [
          { name: '3 boiled eggs',  protein: 18, tag: 'ADD' },
          { name: '1 banana',       protein: 1,  tag: 'existing' },
        ]
      },
      {
        name: 'Dinner', time: '9:00 PM',
        items: [
          { name: '3 chapati / roti',      protein: 9,  tag: 'existing' },
          { name: '75g dry soya chunks',   protein: 39, tag: 'existing' },
          { name: 'Cucumber salad',        protein: 2,  tag: 'ADD' },
        ]
      },
    ]
  },

  Thu: {
    type: 'Veg',
    note: 'Soak chana tonight for Friday evening.',
    meals: [
      {
        name: 'Breakfast', time: '7:00 AM',
        items: [
          { name: '2 chapati',                      protein: 6,  tag: 'existing' },
          { name: '2 glasses milk',                 protein: 10, tag: 'existing' },
          { name: 'Sprouted moong chaat 150g dry',  protein: 35, tag: 'ADD' },
        ]
      },
      {
        name: 'Mid-morning snack', time: '10:30 AM',
        items: [
          { name: 'Banana shake (1 banana + milk)', protein: 6,  tag: 'ADD' },
          { name: 'Roasted peanuts 30g',            protein: 8,  tag: 'ADD' },
        ]
      },
      {
        name: 'Lunch', time: '2:00 PM',
        items: [
          { name: '4 chapati',                protein: 12, tag: 'existing' },
          { name: '100g paneer curry',        protein: 18, tag: 'ADD' },
          { name: 'Tomato + cucumber salad',  protein: 2,  tag: 'ADD' },
        ]
      },
      {
        name: 'Evening / Post-gym', time: '5:30 PM',
        items: [
          { name: 'Chana chaat 200g dry soaked', protein: 38, tag: 'ADD' },
          { name: '1 banana',                    protein: 1,  tag: 'existing' },
        ]
      },
      {
        name: 'Dinner', time: '9:00 PM',
        items: [
          { name: '3 chapati / roti',    protein: 9,  tag: 'existing' },
          { name: '1 bowl chole',        protein: 15, tag: 'existing' },
          { name: '1 bowl dal',          protein: 8,  tag: 'existing' },
          { name: 'Onion + lemon salad', protein: 1,  tag: 'ADD' },
        ]
      },
    ]
  },

  Fri: {
    type: 'Egg',
    note: 'Soak moong tonight for Saturday breakfast.',
    meals: [
      {
        name: 'Breakfast', time: '7:00 AM',
        items: [
          { name: '2 chapati',       protein: 6,  tag: 'existing' },
          { name: '2 glasses milk',  protein: 10, tag: 'existing' },
          { name: '5 boiled eggs',   protein: 30, tag: 'ADD' },
        ]
      },
      {
        name: 'Mid-morning snack', time: '10:30 AM',
        items: [
          { name: 'Sattu sharbat 3 tbsp', protein: 10, tag: 'ADD' },
          { name: 'Roasted peanuts 30g',  protein: 8,  tag: 'ADD' },
        ]
      },
      {
        name: 'Lunch', time: '2:00 PM',
        items: [
          { name: '4 chapati',              protein: 12, tag: 'existing' },
          { name: 'Mutton curry 150g',      protein: 30, tag: 'ADD' },
          { name: 'Onion + tomato salad',   protein: 2,  tag: 'ADD' },
        ]
      },
      {
        name: 'Evening / Post-gym', time: '5:30 PM',
        items: [
          { name: '3 boiled eggs',  protein: 18, tag: 'ADD' },
          { name: '1 banana',       protein: 1,  tag: 'existing' },
        ]
      },
      {
        name: 'Dinner', time: '9:00 PM',
        items: [
          { name: '3 chapati / roti',     protein: 9,  tag: 'existing' },
          { name: '75g dry soya chunks',  protein: 39, tag: 'existing' },
          { name: 'Cucumber salad',       protein: 2,  tag: 'ADD' },
        ]
      },
    ]
  },

  Sat: {
    type: 'Veg',
    note: 'Rest day — still eat all meals, muscles grow on rest days too.',
    meals: [
      {
        name: 'Breakfast', time: '7:00 AM',
        items: [
          { name: '2 chapati',                      protein: 6,  tag: 'existing' },
          { name: '2 glasses milk',                 protein: 10, tag: 'existing' },
          { name: 'Sprouted moong chaat 150g dry',  protein: 35, tag: 'ADD' },
        ]
      },
      {
        name: 'Mid-morning snack', time: '10:30 AM',
        items: [
          { name: 'Banana shake (1 banana + milk)', protein: 6,  tag: 'ADD' },
          { name: 'Handful roasted chana 30g',      protein: 7,  tag: 'ADD' },
        ]
      },
      {
        name: 'Lunch', time: '2:00 PM',
        items: [
          { name: '4 chapati',              protein: 12, tag: 'existing' },
          { name: '100g paneer sabzi',      protein: 18, tag: 'ADD' },
          { name: 'Tomato + onion salad',   protein: 2,  tag: 'ADD' },
        ]
      },
      {
        name: 'Evening snack', time: '5:30 PM',
        items: [
          { name: 'Chana chaat 200g dry soaked', protein: 38, tag: 'ADD' },
          { name: '1 banana',                    protein: 1,  tag: 'existing' },
        ]
      },
      {
        name: 'Dinner', time: '9:00 PM',
        items: [
          { name: '3 chapati / roti',    protein: 9,  tag: 'existing' },
          { name: '1 bowl rajma',        protein: 15, tag: 'existing' },
          { name: '1 bowl dal',          protein: 8,  tag: 'existing' },
          { name: 'Cucumber salad',      protein: 2,  tag: 'ADD' },
        ]
      },
    ]
  },

  Sun: {
    type: 'Egg',
    note: 'Soak moong + chana tonight for Tuesday.',
    meals: [
      {
        name: 'Breakfast', time: '7:00 AM',
        items: [
          { name: '2 chapati',       protein: 6,  tag: 'existing' },
          { name: '2 glasses milk',  protein: 10, tag: 'existing' },
          { name: '5 boiled eggs',   protein: 30, tag: 'ADD' },
        ]
      },
      {
        name: 'Mid-morning snack', time: '10:30 AM',
        items: [
          { name: 'Banana shake (1 banana + milk)', protein: 6,  tag: 'ADD' },
          { name: 'Roasted peanuts 30g',            protein: 8,  tag: 'ADD' },
        ]
      },
      {
        name: 'Lunch', time: '2:00 PM',
        items: [
          { name: '4 chapati',              protein: 12, tag: 'existing' },
          { name: 'Fish curry 150g',        protein: 28, tag: 'ADD' },
          { name: 'Onion + lemon salad',    protein: 2,  tag: 'ADD' },
        ]
      },
      {
        name: 'Evening / Post-gym', time: '5:30 PM',
        items: [
          { name: '3 boiled eggs',  protein: 18, tag: 'ADD' },
          { name: '1 banana',       protein: 1,  tag: 'existing' },
        ]
      },
      {
        name: 'Dinner', time: '9:00 PM',
        items: [
          { name: '3 chapati / roti',     protein: 9,  tag: 'existing' },
          { name: '75g dry soya chunks',  protein: 39, tag: 'existing' },
          { name: 'Tomato + cucumber salad', protein: 2, tag: 'ADD' },
        ]
      },
    ]
  },
};

export const getDayPlan = (dayId) => WEEK_PLAN[dayId];