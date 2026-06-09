import type { User, JournalEntry } from '../models/users.model';

export const CURRENT_USER: User = {
  id: 'u-001',
  name: 'Krystian John Dumapit',
  email: 'kjedumapit@gmail.com',
  createdAt: '2025-01-01T00:00:00.000Z',
};

export const JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'e-001',
    userId: 'u-001',
    title: 'Morning Dew & Clarity',
    content:
      'The world felt particularly quiet this morning. I sat by the window with a cup of chamomile tea and watched the dew cling to the leaves outside. There was something deeply still about it — not empty, but full in a way that words barely reach. I have been rushing through days lately, and this morning felt like a pause button the universe pressed on my behalf. I want to hold onto this feeling longer.',
    preview:
      'The world felt particularly quiet this morning. I sat by the window and...',
    mood: 'grateful',
    tags: ['#meditation', '#peace'],
    hasImage: false,
    createdAt: '2026-06-09T08:30:00.000Z',
    updatedAt: '2026-06-09T08:30:00.000Z',
  },
  {
    id: 'e-002',
    userId: 'u-001',
    title: 'The Silent Mountains',
    content:
      'There is a specific kind of silence found only at high altitudes. It\'s not an absence of sound, but a presence — a weight that presses gently on your chest and reminds you that you are small, and that being small is perfectly fine. I hiked up to the ridge today and sat there for nearly an hour without looking at my phone. The clouds moved below me. Below me. That alone changed something.',
    preview:
      "There is a specific kind of silence found only at high altitudes. It's not an absence of sound, but a...",
    mood: 'reflective',
    tags: ['#nature', '#reflection'],
    hasImage: true,
    imageColor: '#334155',
    createdAt: '2026-06-09T21:15:00.000Z',
    updatedAt: '2026-06-09T21:15:00.000Z',
  },
  {
    id: 'e-003',
    userId: 'u-001',
    title: 'On Letting Things Go',
    content:
      'I spent most of today thinking about a conversation from three weeks ago that I handled badly. I kept replaying it, reshaping it, casting myself as either the villain or the misunderstood hero. Neither felt true. The truth is messier — I was tired, said something careless, and the other person was hurt. I apologized. They accepted. And yet here I am, still circling it. Maybe letting go is less of a decision and more of a practice you come back to, again and again.',
    preview:
      'I spent most of today thinking about a conversation from three weeks ago...',
    mood: 'reflective',
    tags: ['#growth', '#mindfulness'],
    hasImage: false,
    createdAt: '2026-06-05T22:00:00.000Z',
    updatedAt: '2026-06-05T22:00:00.000Z',
  },
  {
    id: 'e-004',
    userId: 'u-001',
    title: 'A Surprisingly Good Tuesday',
    content:
      'Nothing extraordinary happened. Work was work. Lunch was leftover pasta. But somewhere between a spontaneous walk after dinner and a long call with my sister, the day turned warm in a way that Tuesday rarely manages. She told me she bought a plant and named it after me. A cactus. I choose not to read into that.',
    preview:
      'Nothing extraordinary happened. Work was work. Lunch was leftover pasta. But somewhere between...',
    mood: 'happy',
    tags: ['#gratitude', '#everyday'],
    hasImage: false,
    createdAt: '2026-06-02T20:45:00.000Z',
    updatedAt: '2026-06-02T20:45:00.000Z',
  },
  {
    id: 'e-005',
    userId: 'u-001',
    title: 'The Bookstore Find',
    content:
      'Wandered into a second-hand bookstore I\'ve passed a hundred times but never entered. Bought three books I probably won\'t read for months and one I started on the way home. It\'s a 1987 paperback about a lighthouse keeper in Iceland. There is something romantic about books that have been held by strangers — I keep imagining who underlined passages before me and what they were going through.',
    preview:
      "Wandered into a second-hand bookstore I've passed a hundred times but never entered...",
    mood: 'happy',
    tags: ['#books', '#discovery'],
    hasImage: true,
    imageColor: '#78350f',
    createdAt: '2026-05-28T15:30:00.000Z',
    updatedAt: '2026-05-28T15:30:00.000Z',
  },
  {
    id: 'e-006',
    userId: 'u-001',
    title: 'Anxiety at 2 AM',
    content:
      'Woke up at 2:14 AM with that familiar tightness. Not about anything specific — the worst kind. The kind that attaches itself to everything: the unanswered email, the project that\'s stalling, the feeling that I am always one step behind where I should be. I made tea. I wrote a list. Not a to-do list, a things-that-are-actually-fine list. It helped, a little. Sleep came back around 4.',
    preview:
      'Woke up at 2:14 AM with that familiar tightness. Not about anything specific — the worst kind...',
    mood: 'anxious',
    tags: ['#anxiety', '#sleepless'],
    hasImage: false,
    createdAt: '2026-05-21T02:14:00.000Z',
    updatedAt: '2026-05-21T02:14:00.000Z',
  },
  {
    id: 'e-007',
    userId: 'u-001',
    title: 'First Swim of the Season',
    content:
      'The water was still cold — colder than expected — but I went in anyway. That first shock of cold, the gasping, the way every small worry immediately becomes irrelevant: I\'d forgotten how good it feels. Swam until the sun shifted and then lay on the rocks until I was dry. The whole afternoon felt like it belonged to a younger version of me.',
    preview:
      "The water was still cold — colder than expected — but I went in anyway. That first shock of...",
    mood: 'excited',
    tags: ['#swimming', '#summer', '#nature'],
    hasImage: true,
    imageColor: '#0c4a6e',
    createdAt: '2026-05-15T14:00:00.000Z',
    updatedAt: '2026-05-15T14:00:00.000Z',
  },
  {
    id: 'e-008',
    userId: 'u-001',
    title: 'Gratitude List (No Particular Reason)',
    content:
      'Hot coffee that stays hot. The friend who always texts back at the right time. Rain on windows when I\'m inside. That one song I can\'t stop playing. My desk lamp. Soup. The way the city smells after a storm. Whoever invented the snooze button — and also, separately, my own stubbornness in eventually getting up. This list could go on. I think that\'s the point.',
    preview:
      'Hot coffee that stays hot. The friend who always texts back at the right time...',
    mood: 'grateful',
    tags: ['#gratitude', '#lists'],
    hasImage: false,
    createdAt: '2026-05-10T19:00:00.000Z',
    updatedAt: '2026-05-10T19:00:00.000Z',
  },
  {
    id: 'e-009',
    userId: 'u-001',
    title: 'Hard Conversation, Good Outcome',
    content:
      'Finally had the talk I\'d been dreading for two weeks. Sat down, said the things I\'d rehearsed, and then said different, better things instead — the ones I hadn\'t planned. It went well. Not perfectly, but honestly, and that felt more important. We talked for three hours. By the end there was pizza and a kind of lightness I hadn\'t expected. Avoidance costs more than the conversation ever does.',
    preview:
      "Finally had the talk I'd been dreading for two weeks. Said the things I'd rehearsed and then...",
    mood: 'reflective',
    tags: ['#relationships', '#growth', '#courage'],
    hasImage: false,
    createdAt: '2026-04-30T20:00:00.000Z',
    updatedAt: '2026-04-30T20:00:00.000Z',
  },
  {
    id: 'e-010',
    userId: 'u-001',
    title: 'Rain Day, No Plans',
    content:
      'Everything was cancelled. The errands, the coffee with a colleague, the vague intention to be productive. It rained all day — the kind that means business — and I stayed in. Made a proper breakfast for the first time in weeks. Finished half a novel. Reorganized my bookshelf for no reason except that it needed doing. Days with no agenda have a texture I forget to appreciate until I\'m inside one.',
    preview:
      'Everything was cancelled. The errands, the coffee with a colleague, the vague intention to be productive...',
    mood: 'neutral',
    tags: ['#slowday', '#rest', '#rain'],
    hasImage: true,
    imageColor: '#1e3a5f',
    createdAt: '2026-04-18T11:00:00.000Z',
    updatedAt: '2026-04-18T11:00:00.000Z',
  },
  {
    id: 'e-011',
    userId: 'u-001',
    title: 'Watching the City Wake Up',
    content:
      'Couldn\'t sleep. Ended up on the balcony at 5:30 AM with a blanket and a phone I promised myself I wouldn\'t check. The city was doing the slow, unselfconscious thing it does before it remembers it\'s being watched — delivery trucks, a lone jogger, a cat on a wall. The sky turned from grey to pink to pale gold. I\'ve lived here three years and never seen this version of the place before.',
    preview:
      "Couldn't sleep. Ended up on the balcony at 5:30 AM with a blanket and a phone I promised myself...",
    mood: 'reflective',
    tags: ['#city', '#dawn', '#stillness'],
    hasImage: true,
    imageColor: '#312e81',
    createdAt: '2026-04-07T05:30:00.000Z',
    updatedAt: '2026-04-07T05:30:00.000Z',
  },
  {
    id: 'e-012',
    userId: 'u-001',
    title: 'New Skill, Many Failures',
    content:
      'Started learning to cook Thai food properly. The first attempt at pad krapow was an edible failure — too much fish sauce, not enough heat, basil added at entirely the wrong time. But I ate it anyway, and laughed about it, and that felt like progress of a different kind. I think the point of learning new things isn\'t competence, at least not at first. It\'s permission to be bad at something with a good attitude.',
    preview:
      'Started learning to cook Thai food properly. The first attempt at pad krapow was an edible failure...',
    mood: 'happy',
    tags: ['#cooking', '#learning', '#failure'],
    hasImage: false,
    createdAt: '2026-03-22T19:30:00.000Z',
    updatedAt: '2026-03-22T19:30:00.000Z',
  },
];
