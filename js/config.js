var config     = {};
config.entries = [];


config.entries['radiowitness-where-to-start'] = {
  filename : "/md/radiowitness-1.md",
  date     : "August 8, 2016",
  title    : "The RadioWitness.io DSP Pipeline Part 1, Where to Start?",
  summary  : "The Radio Witness Project began in 2015 with the goal of making police radio broadcasts more accessible to journalists. From the very start it was obvious that this would be a lot of work but I really didn’t expect 18 months and three cycles of burnout. In this first post I introduce the project and explain how surprisingly difficult it was to find a starting place."
}

config.entries['radiowitness-decoding-p25'] = {
  filename : "/md/radiowitness-2.md",
  date     : "September 14, 2016",
  title    : "The RadioWitness.io DSP Pipeline Part 2, Decoding P25",
  summary  : "In the second entry of this series I walk you step by step through the process of decoding digital bits from an analog RF signal. The fundamentals of Digital Signal Processing are all covered in detail including sampling, frequency translation, resampling, baseband filtering, demodulation, and decoding. This is the 'DSP for Software Engineers' guide I wish I had 18 months ago."
}


module.exports = config;
