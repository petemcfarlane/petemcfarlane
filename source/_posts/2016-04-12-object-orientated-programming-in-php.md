---
title: Object Oriented Programming in PHP
tags: [oop, php, design, mentoring]
categories: [oop]
related:
    Docker - first steps: docker
    "Docker and Uncomplicated Firewall (UFW)": docker-and-ufw

---

I had a question from one of the people I'm mentoring on [http://phpmentoring.org](http://phpmentoring.org). 

> _How do I decide what is an object and what should be a method?_

This may seem a trivial question to someone who as been writing object orientated (OO) code for a while, but I can remember learning about objects and being perplexed by their properties, inheritance and much more when I started learning.

This is intended to be an introductory level article, some basic knowledge of PHP is assumed but not much OO experience.

### Firstly, what is an object?

Put simply, it is something in your application that can have both state (_properties_) and also behavior (_methods_) that usually represents something in real life (we call this modeling our domain). 

We can design objects wherever it makes sense to: for introducing a new piece of logic, or creating a feature. A well designed object should do (or represent) one thing (this is called SRP or the Single Responsibility Principle). There is no limit to the number of objects we can create or use in an applications, it is often better to have lots of small, simple objects that can be composed together to make up a larger application. Smaller, simpler objects are
 
 - easier to understand, read and reason about
 - easier to re-use (in this application and other applications)
 - easier to change or replace in the future
 - easier to unit test
 - easier to name if it has only one responsibility or capability
 - will probably have less dependencies on other code
 - easier to debug when things go wrong

Properties are like variables that belong to the object. They can be set to any primitive types (strings, integers, floats, arrays) or even other objects, and they change or mutate over time.

Methods are similar to functions except they belong, or relate, to the object. They are normally split into _imperative_ (commanding) or _interrogative_ (questioning) categories, and ideally each method will __do one thing only__.

### Visibility

Properties and methods can have different _visibilities_ (public, private or protected) which alter the scope of the property or method, and affect how other objects can interact with it.

 - __public__ means fully accessible to any other objects or calls outside of the object itself.
 - __private__ means only accessible within the object (i.e. from internal methods). No outsider can access the private properties or methods.
 - __protected__ is similar to private, except if another class extends an object with protected properties/methods then these can be accessed from the child as well as the parent.

### What is a class?

A class is often called the blueprint for an object. An object is an _instance_ of a class. To create an instance of a class (_object_) you typically use the `new` keyword, such as `new MyClass();`. Using the new keyword calls a special reserved method on the class called `__construct()`. The constructor may take parameters or set up internal properties of the object if needs be. It is usually important that any parameters or dependencies the object needs to be considered _valid_ are given at construction time.