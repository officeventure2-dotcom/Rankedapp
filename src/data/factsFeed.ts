import type { FactTopic } from '../utils/artwork';

export interface FeedFact {
  id: string;
  topic: FactTopic;
  /** Short label shown on the picture, e.g. "Astronomy". */
  field: string;
  title: string;
  body: string;
}

export const FACT_TOPICS: Array<{ id: FactTopic; label: string }> = [
  { id: 'space', label: 'Space' },
  { id: 'physics', label: 'Physics' },
  { id: 'chemistry', label: 'Chemistry' },
  { id: 'biology', label: 'Biology' },
  { id: 'body', label: 'Human Body' },
  { id: 'earth', label: 'Earth' },
  { id: 'history', label: 'History' },
  { id: 'tech', label: 'Technology' },
  { id: 'math', label: 'Maths' },
  { id: 'mind', label: 'Mind' }
];

export const FEED_FACTS: FeedFact[] = [
  // Space
  { id: 'sp1', topic: 'space', field: 'Planetary science', title: 'A day on Venus outlasts its year', body: 'Venus spins so slowly that one rotation takes about 243 Earth days, while its trip around the Sun takes only about 225. Its day is longer than its year.' },
  { id: 'sp2', topic: 'space', field: 'Astrophysics', title: 'A teaspoon of neutron star', body: 'Neutron stars pack more than the mass of the Sun into a ball roughly 20 km across. A single teaspoon of that matter would weigh billions of tonnes.' },
  { id: 'sp3', topic: 'space', field: 'Astronomy', title: 'Sunlight is eight minutes old', body: 'Light from the Sun takes about 8 minutes and 20 seconds to reach Earth. If the Sun vanished, we would not notice for a little over eight minutes.' },
  { id: 'sp4', topic: 'space', field: 'Planetary science', title: 'Saturn would float', body: 'Saturn is the only planet in our solar system less dense than water. Its average density is about 0.69 g/cm³, so a bathtub big enough to hold it would let it float.' },

  // Physics
  { id: 'ph1', topic: 'physics', field: 'Thermodynamics', title: 'Why ice floats', body: 'Water is unusual: it expands as it freezes. Ice is about 9% less dense than liquid water, which is why lakes freeze from the top down and fish survive below.' },
  { id: 'ph2', topic: 'physics', field: 'Acoustics', title: 'Silence in space', body: 'Sound needs something to travel through. In the vacuum of space there is no air to carry it, so explosions there are completely silent. In air at 20 °C sound moves at about 343 m/s.' },
  { id: 'ph3', topic: 'physics', field: 'Thermodynamics', title: 'The coldest possible temperature', body: 'Absolute zero is −273.15 °C (0 kelvin). It is the point where particles have the least possible motion, and nothing can be cooled below it.' },
  { id: 'ph4', topic: 'physics', field: 'Atmospheric physics', title: 'Lightning is hotter than the Sun', body: 'The air around a lightning bolt can reach about 30,000 °C, roughly five times hotter than the Sun’s visible surface at about 5,500 °C.' },

  // Chemistry
  { id: 'ch1', topic: 'chemistry', field: 'Food chemistry', title: 'Honey that never spoils', body: 'Honey is so low in water and so acidic that microbes struggle to grow in it. Sealed honey found in ancient Egyptian tombs, thousands of years old, is still considered edible.' },
  { id: 'ch2', topic: 'chemistry', field: 'Materials', title: 'Diamond and pencil lead are cousins', body: 'Diamond and graphite are both pure carbon. The only difference is how the atoms are arranged: a rigid 3D lattice in diamond, and slippery stacked sheets in graphite.' },
  { id: 'ch3', topic: 'chemistry', field: 'Elements', title: 'Only two liquid elements', body: 'At normal room temperature and pressure, just two elements are liquids: mercury (a metal) and bromine (a reddish-brown non-metal).' },
  { id: 'ch4', topic: 'chemistry', field: 'Cosmochemistry', title: 'Gold is stardust', body: 'Elements heavier than iron are forged in extreme events such as supernovae and colliding neutron stars. The gold in jewellery was made in cosmic explosions long before Earth existed.' },

  // Biology
  { id: 'bi1', topic: 'biology', field: 'Zoology', title: 'Octopuses have three hearts', body: 'Two hearts pump blood through the gills and one circulates it around the body. Their blood is blue because it uses copper-based haemocyanin instead of iron-based haemoglobin.' },
  { id: 'bi2', topic: 'biology', field: 'Genetics', title: 'Close cousins in DNA', body: 'Humans and chimpanzees share roughly 98–99% of their DNA sequence. Small differences in when and how genes are switched on account for much of what sets us apart.' },
  { id: 'bi3', topic: 'biology', field: 'Ecology', title: 'The underground forest network', body: 'Many trees are linked by fungal threads in the soil. Through them, trees can swap sugars and chemical signals, which is why scientists sometimes call it the “wood wide web”.' },
  { id: 'bi4', topic: 'biology', field: 'Extremophiles', title: 'The animal that survived space', body: 'In 2007, tardigrades (tiny “water bears”) were exposed to the vacuum of space on a European Space Agency mission. Many survived and some even went on to reproduce.' },

  // Human body
  { id: 'bo1', topic: 'body', field: 'Anatomy', title: 'Babies have more bones', body: 'A newborn has around 300 bones and cartilage pieces. Many fuse together as we grow, leaving an adult skeleton of 206 bones.' },
  { id: 'bo2', topic: 'body', field: 'Physiology', title: 'A heart that never rests', body: 'The average resting heart beats around 100,000 times a day, pushing blood through roughly 100,000 km of blood vessels.' },
  { id: 'bo3', topic: 'body', field: 'Cell biology', title: 'Trillions of cells', body: 'An adult human body is made of roughly 30 to 40 trillion cells, and it contains a similar number of microbes living on and inside us.' },
  { id: 'bo4', topic: 'body', field: 'Digestion', title: 'A stomach that rebuilds itself', body: 'The stomach lining is exposed to strong acid, so its surface cells are replaced every few days. That constant renewal protects the stomach from digesting itself.' },

  // Earth
  { id: 'ea1', topic: 'earth', field: 'Geography', title: 'The farthest peak from Earth’s centre', body: 'Mount Everest is the highest above sea level, but because Earth bulges at the equator, Ecuador’s Chimborazo has the summit farthest from the planet’s centre.' },
  { id: 'ea2', topic: 'earth', field: 'Oceanography', title: 'Half our oxygen comes from the sea', body: 'Tiny drifting plants and algae called phytoplankton produce about half of the oxygen in our atmosphere, even though they are invisible to the naked eye.' },
  { id: 'ea3', topic: 'earth', field: 'Geography', title: 'The biggest desert is ice', body: 'A desert is defined by how little precipitation it gets, not by heat. Antarctica, at around 14 million km², is the largest desert on Earth.' },
  { id: 'ea4', topic: 'earth', field: 'Geophysics', title: 'A core as hot as the Sun’s surface', body: 'Earth’s inner core is a solid ball of iron and nickel at roughly 5,000 to 6,000 °C, about the temperature of the Sun’s surface.' },

  // History
  { id: 'hi1', topic: 'history', field: 'Ancient history', title: 'Cleopatra and the Moon', body: 'The Great Pyramid was built around 2560 BC. Cleopatra lived about 2,500 years later, which is closer in time to the Moon landing in 1969 than to the pyramid’s construction.' },
  { id: 'hi2', topic: 'history', field: 'Education', title: 'Older than the Aztecs', body: 'Teaching at Oxford began around 1096. The Aztec city of Tenochtitlan was founded in 1325, so the university is older than the Aztec Empire’s capital.' },
  { id: 'hi3', topic: 'history', field: 'Myths', title: 'The Great Wall myth', body: 'It is often said that the Great Wall is visible from space. Astronauts say it is extremely hard to see with the naked eye from orbit, because it is long but very narrow.' },
  { id: 'hi4', topic: 'history', field: 'Inventions', title: 'The press that changed Europe', body: 'Around 1440, Johannes Gutenberg introduced movable-type printing in Europe. Books became far cheaper and ideas spread faster than ever before.' },

  // Technology
  { id: 'te1', topic: 'tech', field: 'Computing history', title: 'The first computer “bug”', body: 'In 1947, operators of Harvard’s Mark II computer found a moth stuck in a relay and taped it into the logbook. The term “debugging” became famous, thanks in part to Grace Hopper.' },
  { id: 'te2', topic: 'tech', field: 'Networks', title: 'The internet runs under the sea', body: 'More than 95% of international data travels through cables laid on the ocean floor, not through satellites.' },
  { id: 'te3', topic: 'tech', field: 'Navigation', title: 'GPS needs relativity', body: 'Satellite clocks tick slightly faster than clocks on the ground. Without correcting for relativity, GPS positions would drift by kilometres within a single day.' },
  { id: 'te4', topic: 'tech', field: 'Computing history', title: 'The first programmer', body: 'In 1843, Ada Lovelace published an algorithm meant to run on Charles Babbage’s Analytical Engine. It is often described as the first computer program.' },

  // Maths
  { id: 'ma1', topic: 'math', field: 'Number theory', title: '0.999… is exactly 1', body: 'The repeating decimal 0.999… is not “almost” 1: it is equal to 1. For example, 1/3 = 0.333…, and three of those add up to 0.999… and also to 1.' },
  { id: 'ma2', topic: 'math', field: 'Combinatorics', title: 'More chess games than atoms', body: 'The number of possible chess games is estimated at 10¹²⁰ (Shannon’s number), far more than the roughly 10⁸⁰ atoms in the observable universe.' },
  { id: 'ma3', topic: 'math', field: 'Probability', title: 'The birthday paradox', body: 'In a room of just 23 people, there is better than a 50% chance that two share a birthday. With 70 people it is above 99.9%.' },
  { id: 'ma4', topic: 'math', field: 'Exponential growth', title: 'Fold paper to the Moon', body: 'Each fold doubles a sheet’s thickness. In theory, folding a 0.1 mm sheet 42 times would make a stack over 400,000 km tall, enough to reach the Moon.' },

  // Mind
  { id: 'mi1', topic: 'mind', field: 'Neuroscience', title: 'A hungry organ', body: 'The brain is only about 2% of body weight but uses roughly 20% of the body’s energy at rest.' },
  { id: 'mi2', topic: 'mind', field: 'Neuroscience', title: '86 billion neurons', body: 'The human brain contains about 86 billion neurons, each able to connect to thousands of others, which makes trillions of connections.' },
  { id: 'mi3', topic: 'mind', field: 'Psychology', title: 'The forgetting curve', body: 'In 1885 Hermann Ebbinghaus showed that we forget new information quickly unless we review it. Spacing out your reviews is one of the most reliable ways to remember.' },
  { id: 'mi4', topic: 'mind', field: 'Sleep science', title: 'Sleep files your memories', body: 'During sleep the brain replays and strengthens things learned during the day. A good night’s sleep after studying helps the information stick.' }
];
