# rhodey.org

## Build
```
$ npm install
$ npm run index
$ npm run bundle
```

## Deploy
```
$ docker run --name rhodey.org \
    -v /host/path/rhodey.org/nginx.conf:/etc/nginx/nginx.conf:ro \
    -v /etc/letsencrypt:/etc/letsencrypt:ro \
    -v /host/path/rhodey.org:/usr/share/nginx/html:ro \
    -p 80:80 \
    -p 443:443 \
    --restart unless-stopped \
    -d nginx
```

## todo
todo:
  + RadioWitness.io series
  + High Frequency Trading Intro
  + Tax Scrape
  + ZodiacTweets.com
  + Flock
  + ChubSAT
  + Opposite Day
  + Light Sockets
  + ZoneGuard
  + ScienceBox
  + R.O.B.
  + First Freelance Gig

## License
Copyright 2016 An Honest Effort LLC
