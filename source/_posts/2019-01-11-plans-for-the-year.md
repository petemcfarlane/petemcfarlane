---
title: Plans for the year [2019]
tags: [php, functional programming, js, devops]
categories: [random musings]
---

I've learnt a lot in 2018, but unfortunately I didn't document anything to this blog. Could be something to do with the sleep deprivation of having a 1 year old to deal with, or just that it's been such a full on productive work year?

I don't really have a great excuse, so I thought I'd share a few notes at the start of the year then hopefully this will motivate me to do some more learning and writing.

## Things that look cool

### Siler

On the back end, and in PHP world I've only just found [Siler](https://siler.leocavalcante.com) though it dates back at least to 2017. It's a very small, functional framework for PHP. You define your routes, with a regex, a method (HTTP verb) and then return a handler (callable, closure or anonymous function), or even a file name. It is a change from a typical Model View Controller mentality (not originally intended for the web) and away from using objects for everything. It doesn't mean you can't use objects elsewhere in your domain code, in fact the author encourages using OO in your domain.

### GraphQL

This looks pretty neat, though I've only just touched the surface. One I've struggled with before now is having a consistent, query-able API. GraphQL lets you query deeply nested relational data in a predictable, scalable fashion. It also lets you run pre-defined mutations. It also acts as a type system between your API server and clients - this is really nice for consumers as they can easily see what type of data is available, how it is related and what they can do with it, all without having to make multiple http requests. It's a bit like HATEOS but preloaded upfront.

### Elm

On the front end, I'm still really interested in [Elm](http://elm-lang.org). After spending time with the compiler I can attest to the home page slogan that it is a "delightful language for reliable webapps". I wonder if I will have more opportunity to do more front end this year? I do have to work with React from time to time but I must confess I do often find it a less that pleasurable experience, but that could be down to how I'm using it and my limited exposure and understanding of it, rather than the tool itself which is obviously loved by many!

### Glitch

This is a fantastic online IDE and back-end server all in one. This is how easy programming should be, focus on your creative software building - where you can add value - and let the machines take care of installing dependencies, building assets and serving those in near real time. The collaborative editor works _pretty well_, not quite as smooth as a desktop IDE like VS Code or the Intellij products, but you get live collaboration which is neat. It doesn't seem take itself too seriously, with playful artwork, fun friendly messages, with a large helping of emoji everywhere. This is a seriously cool problem to work on (DevOps with no barriers). With some services like Amazon and Google offering server-less architecture, but from my experience there is still a lot of config and steps to follow to get these working. Glitch is an ideal place for rapid application development and prototyping. There are restrictions - the app goes to sleep after 5 minutes of no requests, so it is slightly slower to spin up the next request. Also you can only make 40000 requests an hour. But it is easy to download the project as a zip file or export it to GitHub, so you can then run your code wherever you fancy.

