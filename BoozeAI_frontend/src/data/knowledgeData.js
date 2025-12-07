export const knowledgeData = {
  spirits: [
    {
      id: 'vodka',
      title: 'Vodka',
      animation: require('../../assets/vodka.json'), // Make sure this path corresponds to your actual asset location
      description: 'Clear, distilled, and versatile.',
      details: 'Composed primarily of water and ethanol. Traditionally made by distilling liquid from fermented cereal grains. It is the Chameleon of liquors—mixes with almost anything!',
      mixers: ['Orange Juice', 'Soda', 'Tonic', 'Ginger Beer'],
      color: '#A9D6E5', // Icy Blue
    },
    {
      id: 'gin',
      title: 'Gin',
      animation: require('../../assets/gin.json'),
      description: 'Juniper-flavored goodness.',
      details: 'Derives its predominant flavour from juniper berries. A broad category with styles ranging from London Dry to modern fruity variations.',
      mixers: ['Tonic Water', 'Vermouth', 'Lime Juice', 'Soda'],
      color: '#D8F3DC', // Pale Green
    },
    {
      id: 'rum',
      title: 'Rum',
      animation: require('../../assets/beachvacation.json'),
      description: 'Tropical sugarcane spirit.',
      details: 'Made by fermenting then distilling sugarcane molasses or juice. Can be white, gold, dark, or spiced. The heart of Tiki culture.',
      mixers: ['Coke', 'Pineapple Juice', 'Ginger Beer', 'Mint'],
      color: '#FFD6A5', // Warm Sand/Gold
    },
    {
      id: 'whiskey',
      title: 'Whiskey',
      animation: require('../../assets/whiskey.json'),
      description: 'Grain, wood, and time.',
      details: 'Made from fermented grain mash (barley, corn, rye, wheat) and aged in wooden casks. Complex, rich, and often peaty or smokey.',
      mixers: ['Soda Water', 'Ginger Ale', 'Vermouth', 'Just Ice!'],
      color: '#FFB5A7', // Amber/Reddish
    },
    {
      id: 'tequila',
      title: 'Tequila',
      animation: require('../../assets/tequila.json'),
      description: 'Spirit of the Blue Agave.',
      details: 'From Jalisco, Mexico. Made from the blue agave plant. Blanco is unaged, Reposado and Añejo are aged in oak.',
      mixers: ['Lime & Salt', 'Grapefruit Soda', 'Agave Syrup'],
      color: '#FDFCDC', // Pale Yellow
    },
    {
      id: 'wine',
      title: 'Wine',
      animation: require('../../assets/wine.json'),
      description: 'Fermented grapes, bottled poetry.',
      details: 'An alcoholic drink made from fermented grapes. Yeast consumes the sugar in the grapes and converts it to ethanol and carbon dioxide.',
      mixers: ['Soda (Spritzer)', 'Fruit (Sangria)'],
      color: '#E0B1CB', // Wine/Purple
    },
    {
      id: 'brandy',
      title: 'Brandy',
      animation: require('../../assets/brandy.json'),
      description: 'Distilled wine, aged in oak.',
      details: 'Produced by distilling wine. Brandy generally contains 35–60% alcohol by volume and is typically consumed as an after-dinner digestif.',
      mixers: ['Ginger Ale', 'Coke', 'Citrus'],
      color: '#D4A373', 
    },
    {
      id: 'bourbon',
      title: 'Bourbon',
      animation: require('../../assets/bourbon.json'),
      description: 'American corn-based whiskey.',
      details: 'A type of American whiskey, a barrel-aged distilled spirit made primarily from corn.',
      mixers: ['Water', 'Soda', 'Mint', 'Sugar'],
      color: '#B5651D',
    },
     {
      id: 'breezer',
      title: 'Breezer',
      animation: require('../../assets/breezer.json'),
      description: 'Fruit-based alcopop.',
      details: 'Bacardi Breezer is an alcoholic fruit-flavoured drink made by Bacardi that comes in a variety of fruit flavours.',
      mixers: ['Ice', 'Consumable Straight'],
      color: '#FF6F61', 
    },
  ],
  garnishes: [
    {
      id: 'lemon',
      title: 'Lemon',
      animation: require('../../assets/lemon.json'),
      text: 'The classic twist or wheel. Adds acidity and brightness.',
    },
    {
      id: 'orange',
      title: 'Orange',
      animation: require('../../assets/orange.json'),
      text: 'Essential for Old Fashioneds and sweeter cocktails.',
    },
    {
      id: 'mint',
      title: 'Mint',
      animation: require('../../assets/mint.json'),
      text: 'Crucial for Mojitos and Juleps. Slap it to release oils!',
    },
    {
      id: 'water',
      title: 'Ice',
      animation: require('../../assets/water.json'),
      text: 'The most important ingredient. Dilution + Chill = Balance.',
    },
     {
      id: 'apple',
      title: 'Apple',
      animation: require('../../assets/apple.json'),
      text: 'Great for ciders and autumn cocktails.',
    },
     {
      id: 'coconut',
      title: 'Coconut',
      animation: require('../../assets/coconut.json'),
      text: 'Cream or water, essential for tropical drinks.',
    },
     {
      id: 'coffee',
      title: 'Coffee',
      animation: require('../../assets/Coffee.json'),
      text: 'Espresso Martinis await. Deep, rich flavor.',
    },
     {
      id: 'pineapple',
      title: 'Pineapple',
      animation: require('../../assets/Pineapple.json'),
      text: 'The King of Tiki. Sweet, acidic, and frothy.',
    },
     {
      id: 'chocolate',
      title: 'Chocolate',
      animation: require('../../assets/Chocolate.json'),
      text: 'For dessert cocktails and decadent treats.',
    },
  ],
  survival: [
    {
      id: 'drink_water',
      title: 'Hydrate!',
      animation: require('../../assets/water.json'),
      text: '1 glass of water for every alcoholic drink. Your morning self will thank you.',
    },
    {
      id: 'sleep',
      title: 'Rest Up',
      animation: require('../../assets/tired.json'),
      text: 'Alcohol disrupts REM sleep. Plan for extra rest the next day.',
    },
    {
      id: 'pace_yourself',
      title: 'Pace Yourself',
      animation: require('../../assets/guydrinking.json'),
      text: 'Sip slowly. Enjoy the flavor, don’t just race to the finish.',
    },
  ],
  basics: [
    {
       id: 'shaking',
       title: 'Shake vs Stir',
       text: 'Shake for citrus/cream/egg. Stir for spirits-only.',
       details: 'The Golden Rule: If the cocktail contains juice, cream, or egg whites, SHAKE IT to aerate and emulsify the ingredients. If it consists entirely of spirits (like a Martini or Manhattan), STIR IT to chill and dilute without creating bubbles or cloudiness.',
       icon: 'shaker-outline', // MaterialCommunityIcons
       animation: require('../../assets/loading1.json'),
       color: '#F4A261'
    },
    {
       id: 'glassware',
       title: 'Glassware Guide',
       text: 'Highball for effervescence, Coupe for chilled, Rocks for spirits.',
       details: 'Glassware isnt just about looks; it affects temperature and aroma. A Coupe or Martini glass keeps heat away from the bowl (chilled drinks, no ice). A Rocks glass allows for big ice cubes (spirits, Old Fashioneds). A Highball keeps carbonation lively for longer (G&T).',
       icon: 'glass-cocktail',
       animation: require('../../assets/Sparkle.json'),
       color: '#2A9D8F'
    },
    {
       id: 'tools',
       title: 'Essential Tools',
       text: 'Jigger, Shaker, Strainer, Muddler, and Bar Spoon.',
       details: 'Don\'t eyeball it! A Jigger ensures balance. A Boston Shaker (two tins) is cleaner than a Cobbler shaker. A Hawthorne Strainer holds back ice chips. A Bar Spoon is long and twisted for smooth stirring. A Muddler extracts oils from herbs and fruit.',
       icon: 'tools',
       animation: require('../../assets/loading.json'),
       color: '#E9C46A'
    }
  ],
  families: [
    {
      id: 'sour',
      title: 'The Sour',
      subtitle: 'Spirit + Citrus + Sweet',
      text: 'The most popular family. Margarita, Daiquiri, Whiskey Sour, Gimlet. Balance is key.',
      icon: 'glass-stange',
      animation: require('../../assets/lemon.json'),
      color: '#E76F51'
    },
    {
      id: 'old_fashioned',
      title: 'Old Fashioned',
      subtitle: 'Spirit + Sugar + Bitters',
      text: 'The original cocktail definition. Boozy, stirred, and serious. Use good ice.',
      icon: 'glass-tulip',
      animation: require('../../assets/whiskey.json'),
      color: '#264653'
    },
    {
      id: 'highball',
      title: 'The Highball',
      subtitle: 'Spirit + Fizz',
      text: 'Tall and refreshing. Gin & Tonic, Cuba Libre, Moscow Mule. Carbonation lifts the aroma.',
      icon: 'glass-mug-variant',
      animation: require('../../assets/addtofav.json'),
      color: '#2A9D8F'
    }
  ],
  secrets: [
    {
      id: 'bitters',
      title: 'Bitters',
      text: 'The "Salt & Pepper" of cocktails. Angostura is the king.',
      details: 'Bitters are potent herbal infusions. Like salt in cooking, they don\'t make the drink taste like "bitters"—they bind the other flavors together and add complexity. A Manhattan without bitters is just sweet whiskey.',
      icon: 'bottle-tonic-plus',
      animation: require('../../assets/loading1.json'),
      color: '#8e44ad'
    },
    {
      id: 'syrups',
      title: 'Simple Syrup',
      text: 'Dissolve equal parts sugar and water. Essential for texture.',
      details: 'Granulated sugar doesn\'t dissolve well in cold alcohol. Simple Syrup (1:1 sugar to water) adds sweetness and a silky mouthfeel instantly. Rich Syrup (2:1) adds even more texture. Infuse it with herbs or fruit for custom flavors.',
      icon: 'spoon-sugar',
      animation: require('../../assets/sugar.json'),
      color: '#f4a261'
    },
    {
      id: 'clear_ice',
      title: 'Clear Ice',
      text: 'Freezes from one direction. Melts slower, keeps drinks cold.',
      details: 'Cloudy ice has air bubbles that melt quickly, watering down your drink. Clear ice is dense and solid. It keeps your drink colder for longer with less dilution, maintaining the perfect flavor balance from first sip to last.',
      icon: 'cube-outline',
      animation: require('../../assets/water.json'),
      color: '#4cc9f0'
    }
  ]
};
