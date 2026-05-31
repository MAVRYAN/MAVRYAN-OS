const morningHeadlines = [
  "Good morning{name}.",
  "Ready to build today{name}?",
  "Let's make progress this morning{name}."
];

const afternoonHeadlines = [
  "What's next{name}?",
  "Ready for the next challenge{name}?",
  "What are we building today{name}?"
];

const eveningHeadlines = [
  "Let's finish strong{name}.",
  "Continue where you left off{name}.",
  "Ready to ship something{name}?"
];

const lateNightHeadlines = [
  "Burning the midnight oil{name}?",
  "Still building{name}?",
  "One more feature before bed{name}?"
];

const generalHeadlines = [
  "Your move{name}.",
  "Ready when you are{name}.",
  "What are we building today{name}?",
  "Let's ship something amazing.",
  "Continue where you left off.",
  "Let's create something extraordinary.",
  "The canvas is yours.",
  "Time to build.",
  "Start with an idea.",
  "Turn an idea into reality.",
  "Ready for the next challenge{name}?",
  "Build. Learn. Ship.",
  "Dream it. Build it.",
  "Let's make progress today.",
  "What's the plan{name}?",
  "Create something worth sharing.",
  "The next version starts here.",
  "Ready to think bigger{name}?",
  "Let's build the future.",
  "What's on your mind{name}?",
  "Ship the next version.",
  "Build something you'll be proud of.",
  "Where do we start{name}?",
  "The next big thing starts here.",
  "Let's write some code.",
  "What problem are we solving today?",
  "Unleash your creativity.",
  "Build without limits.",
  "Let's craft something beautiful.",
  "Your imagination is the only limit.",
  "Ready to push boundaries?",
  "Let's bring your vision to life.",
  "What's the next milestone?",
  "Time to innovate.",
  "Let's create something impactful.",
  "The perfect time to start is now.",
  "What are we designing today?",
  "Let's shape the future.",
  "Ready to dive in{name}?",
  "Let's explore new ideas.",
  "Your next masterpiece awaits."
];

const LAST_HEADLINE_KEY = "mavryan-last-headline";
let lastGeneratedHeadline = "";

function generateHeadlineLogic(
  name?: string,
  previousHeadline?: string
): string {
  const hour = new Date().getHours();
  let timeHeadlines: string[] = [];

  if (hour >= 5 && hour < 12) {
    timeHeadlines = morningHeadlines;
  } else if (hour >= 12 && hour < 18) {
    timeHeadlines = afternoonHeadlines;
  } else if (hour >= 18 && hour < 23) {
    timeHeadlines = eveningHeadlines;
  } else {
    timeHeadlines = lateNightHeadlines;
  }

  let pool = [...timeHeadlines, ...generalHeadlines].map((h) =>
    h.replace("{name}", name ? `, ${name}` : "")
  );

  let storedLast = "";
  if (typeof window !== "undefined") {
    storedLast = localStorage.getItem(LAST_HEADLINE_KEY) || "";
  }

  const toExclude =
    previousHeadline ||
    lastGeneratedHeadline ||
    storedLast;

  if (toExclude) {
    const filtered = pool.filter(
      (h) => h !== toExclude
    );

    if (filtered.length > 0) {
      pool = filtered;
    }
  }

  const selected =
    pool[Math.floor(Math.random() * pool.length)];

  lastGeneratedHeadline = selected;

  if (typeof window !== "undefined") {
    localStorage.setItem(
      LAST_HEADLINE_KEY,
      selected
    );
  }

  return selected;
}

export function getPersonalizedHeadline(
  name?: string
): string {
  return generateHeadlineLogic(name);
}

export function getNextHeadline(
  previousHeadline?: string,
  name?: string
): string {
  return generateHeadlineLogic(
    name,
    previousHeadline
  );
}
