---
title: Value Objects, Entities and Services
tags: [oop, php, design]
categories: [oop]
related:
    Object Orientated Design in PHP: object-orientated-programming-in-php
    Types, interfaces and abstracts: types-interfaces-abstracts
    Naming things: naming-things

---

### Value Objects

Value objects are little jigsaw pieces that make up a large part of your domain code. They model real life values or ideas into objects. They are typically quite small, not because they are unimportant but because they encapsulate one single idea well. Examples might include distance, money, date, time, location, region, temperature, email address. They are typically formed from primitive values (ints, strings, arrays or other objects) but they carry much more information than their primitive parts. They are a great way to encapsulate validation rules and other behavior, all in one place. They can be considered equal based on their value, for example, one instance of a Length object with a value of 5km should be considered equivalent to another instance of a Length object with a value of 5km. If you give me a £5 note, it is considered the same as any other £5 note, which is _not_ the same as a $5 bill!
There is one key aspect that separates them from entities in that they don't have an identity in your domain.

### Entities

Entities are similar to value objects in that they can have properties and methods, but they also have a unique identity which doesn't change over time. Take a User object, for example: this is typically uniquely identified with an ID. The user may change their address, password, name, even gender but they will remain the same, unique person. There may be two users in your system, both called "John Smith" but that doesn't mean they are the same person. To _identify_ each different John Smith we assign them an identity or ID.

The difference can be quite subtle to pick up on at first, but it is very useful to distinguish for writing clean, declarative, decoupled code.

### Services

A service, to be pretty vague, typically doesn't have a value itself (unlike a value object) and doesn't have an identity (unlike a entity would). A service can be some utility object that manages persistence, or it could be something that transforms your entities or applies an algorithm to your other domain objects, or perhaps a http web client that fetches data from an API.
You may have services inside your domain, and also third party services dotted around your domain that plug into your application (like adapters in Hexagonal Architecture).

