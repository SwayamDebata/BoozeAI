const adjectives = ['Cool', 'Witty', 'Brave', 'Shy', 'Goofy'];
const animals = ['Panda', 'Tiger', 'Sloth', 'Koala', 'Zebra'];

function generateUsername() {
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  return `${adjective}${animal}`;
}

module.exports = generateUsername;
