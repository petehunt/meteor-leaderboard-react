# React + Meteor leaderboard example

## Getting started

  * `git clone https://github.com/petehunt/meteor-leaderboard-react.git`
  * `cd meteor-leaderboard-react/reactapp`
  * `npm install`
  * `npm start`
  * (new terminal) `cd meteor-leaderboard/react/meteorapp`
  * `meteor`

## What's going on?

We have [deeper Meteor integration](https://github.com/benjamn/meteor-react) but it's somewhat outdated and I wanted to keep things very simple.
`reactapp` uses `browserify` to build a bundle that gets copied into the `meteorapp` directory. Then meteor does the rest!

## A note on `Session`

I am unsure if `Session` will ever be needed while using React. They work perfectly fine, so this will come down to a preferred style. The tradeoff
is going to be amount of typing vs obviousness of data flow. See [this commit](https://github.com/petehunt/meteor-leaderboard-react/commit/b27fc676f76058a49c68fc5ddf931a4711a98833).
