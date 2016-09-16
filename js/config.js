var config     = {};
config.entries = [];


config.entries['radiowitness-decoding-p25'] = {
  filename : "/md/radiowitness-2.md",
  date     : "September 14, 2016",
  title    : "The RadioWitness.io DSP Pipeline Part 2, Decoding P25",
  summary  : "In the second entry of this series I walk you step by step through the process of decoding digital bits from an analog RF signal. The fundamentals of *Digital Signal Processing* are all covered in detail including sampling, frequency translation, resampling, baseband filtering, demodulation, and decoding. This is the *\"DSP for Software Engineers\"* guide I wish I had 18 months ago."
}

config.entries['radiowitness-where-to-start'] = {
  filename : "/md/radiowitness-1.md",
  date     : "August 8, 2016",
  title    : "The RadioWitness.io DSP Pipeline Part 1, Where to Start?",
  summary  : "The [Radio Witness Project](http://radiowitness.io) began in 2015 with the goal of making police radio broadcasts more accessible to journalists. From the very start it was obvious that this would be a lot of work but I really didn’t expect 18 months and three cycles of burnout. In this first post I introduce the project and explain how surprisingly difficult it was to find a starting point. Spoiler: GNURadio made me cry."
}

config.entries['ethereum-wallet-exploit'] = {
  filename : "/md/ethereum-exploit.md",
  date     : "July 6, 2016",
  title    : "Walking Past Same-origin Policy, NAT, and Firewall for Ethereum Wallet Control",
  summary  : "This vulnerability was originally reported to the Etherum Bug Bounty on June 12th, 2016. As far as I can tell no clients have been patched and any developer made aware of this has since forgotten. At the core of this attack is a *DNS Rebinding* vulnerability, in this post I explain the vulnerability, suggest an exploit, and leave you with a complete proof-of-concept exploit solution."
}

config.entries['twitter-squat'] = {
  filename : "/md/twitter-squat.md",
  date     : "June 5, 2014",
  title    : "Fighting Twitter Squatters",
  summary  : "At the time of writing this some bot is squatting [@rhodey](http://twitter.com/rhodey) on Twitter and has been for some time. I don't remember to check the availability of this handle very frequently and would hate to have it open up only to be squatted again so I put together this simple bash script."
}

config.entries['stratfor-relationship-graph'] = {
  filename : "/md/stratfor.md",
  date     : "June 28, 2012",
  title    : "Stratfor Relationship Graph",
  summary  : "In early 2012 WikiLeaks began publishing [The Global Intelligence Files](http://wikileaks.org/the-gifiles.html), over five million e-mails from the Texas headquartered \"global intelligence\" company Stratfor. Sometime during the summer of 2012 **long, long before [d3.js](https://d3js.org/)** I spent a few hours paging through these emails. Wikileak's website allows you to browse by date of release or date of the document itself but this method of examination soon lost my interest, what I really wanted was a holistic understanding of the emails without having to think all that much."
}

config.entries['ssh-fish-feeder'] = {
  filename : "/md/ssh-fish-feeder.md",
  date     : "December 17, 2012",
  title    : "SSH Fish Feeder",
  summary  : "It was the day before Winter Break 2012 and I had no more than 30 minutes to finish packing before getting the boot from my dorm room. I had everything packed in the back of my Subaru and made my way upstairs for a final look-around, wait-- what was that? The sound of running water? Could it be that the fish tank my friends and I went in on together somehow ended up in my room? **It could. it was. lame.**"
}

config.entries['4chan-regex'] = {
  filename : "/md/4chan-regex.md",
  date     : "January 1, 2007",
  title    : "4chan Regex Practice",
  summary  : "**Many, many years ago** I decided that I needed some regex practice, and background aside I'd like to think that any survey is a survey worth sharing. What follows is a quick survey of the sex and age of 4chan commenters using exclusively shell commands. This is the bottom of the barrell my friends."
}


module.exports = config;
