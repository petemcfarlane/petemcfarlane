---
title: Subjective Opinions on Objects
tags: [design, oop]
categories: [design]
related:
    "Who do we write code for?": who-do-we-write-code-for
    "Object Oriented Programming in PHP": object-orientated-programming-in-php
---

This year I've been trying to practice functional programming, in languages such as Scala and Haskel, but also looking for opportunity to apply these patterns in PHP and JavaScript.

I have used object oriented programming for the past few years and considered it superior to procedural code. It makes large complicated spaghetti code small and modular, only having to consider small pieces of logic or data at a time, and encapsulates behavior with data types. It is also useful because it enables one to use a more abstract type system and forget about implementation details. But I haven't until recently considered the cost or trade offs associated. There are some interesting videos by Brian Will posted below. The titles seem click-bait-y and I don't necessarily agree with all of his opinions; but he does provide some compelling arguments against OOP, namely that state and managing multiple states is hard and error prone. He takes some example OO code and redactors it to use functions and nested functions. This is something that I have started to use more in Haskell; Haskell has temporary variables defined in other functions with `let` or `where` keywords. What I mean is that they are scoped variables or nested functions to another function. This makes it easier to write more comprehensible and clearer functions, thinking about smaller parts of a problem, without introducing fluff and polluting the global namespace.

I'm a fan of Rich Hickeys talks (he is the creator of the Clojure programming language). He describes systems as parts that take information in and return information out. His advice for handling data is that 90% of the time, a map [hash or associative array] is good enough. Leverage the fact that you can use generic manipulation built into the language. He argues that whilst we use OOP to help with encapsulation, _information_ itself doesn't have behavior, so there should be no functions or methods to _encapsulate_! Instead just functions that transform data from one state to another.

As an exercise, a colleague and I tried to refactor an existing OO code base of his. It had 20 classes in the `src/` directory alone, plus 10 spec files and several feature files. We tried to distill the package to what it actually does (which happened to be verifying a PayPal instant payment notification or IPN) and were able to reproduce most of the functionality in a 3 line function and a single test file. This was a huge difference, and just highlighted to me how frequently I must over-engineer my solutions to problems in code.

I haven't decided that all OOP is inherently bad (just yet) but I am looking at alternative ways to model my domain in a more functional way.

Object-Oriented Programming is Bad - Brian Will
<iframe width="560" height="315" src="https://www.youtube.com/embed/QM1iUe6IofM" frameborder="0" allowfullscreen></iframe>

Object-Oriented Programming is Embarrassing: 4 Short Examples - Brian Will
<iframe width="560" height="315" src="https://www.youtube.com/embed/IRTfhkiAqPw" frameborder="0" allowfullscreen></iframe>

Rails Conf 2012 Keynote: Simplicity Matters by Rich Hickey
<iframe width="560" height="315" src="https://www.youtube.com/embed/rI8tNMsozo0" frameborder="0" allowfullscreen></iframe>