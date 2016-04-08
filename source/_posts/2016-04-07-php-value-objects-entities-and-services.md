---
title: PHP Value Objects, Entities and Services
categories: [OOP, php]
draft: true

---

I had a question from one of the people I'm mentoring on [http://phpmentoring.org](http://phpmentoring.org). 

> _How do I decide what is an object and what should be a method?_

This may seem a trivial question to someone who as been writing object orientated (OO) code for a while, but I can remember learning about objects and being perplexed by their properties, inheritance and much more when I started learning.

This is intended to be an introductory level article, some basic knowledge of PHP is assumed but not much OO experience.

### Firstly, what is an object?

Put simply, it is something in your application that can have both state (_properties_) and also behavior (_methods_) that usually represents something in real life (we call this modeling our domain). 

Properties are like variables that belong to the object. They can be set to any primitive types (strings, ints, floats, arrays) or even other objects, and they change over time.

Methods are similar to functions except they belong, or relate, to the object. They are normally split into _imperative_ (commanding) or _interrogative_ (questioning) categories, and ideally each method will __do one thing only__.

Properties and methods can have different _visibilities_ (public, private or protected) which alter the scope of the property or method, and affect how other objects can interact with it.

 - __Public__ means fully accessible to any other objects or calls outside of the object itself.
 - __Private__ means only accessible within the object (i.e. from internal methods). No outsider can access the private properties or methods.
 - __Protected__ is similar to private, except if another class extends an object with protected properties/methods then these can be accessed from the child as well as the parent.

### What is a class?

A class is often called the blueprint for an object. An object is an _instance_ of a class. To create an instance of a class (_object_) you typically use the `new` keyword, such as `new MyClass();`. Using the new keyword calls a special reserved method on the class called `__construct()`. The constructor may take parameters or set up internal properties of the object if needs be. It is usually important that any parameters or dependencies the object needs to be considered _valid_ are given at construction time.

### Named constructors

I said objects are often created using the `new` keyword before a class, but sometimes you may want multiple ways to instantiate an object, for example with different parameters, or with an explicitly named method. In some programming languages you can use _method overloading_ to pass different parameters to the constructor but PHP doesn't have that. In PHP we use _named constructors_ like so:

```php
class Distance
{
	private $distance;

	private function __construct($kilometers)
	{
		$this->distance = $kilometers;
	}

	public static function fromKilometers($kilometers)
	{
		return new Distance($kilometers);
	}

	public static function fromMiles($miles)
	{
		return new Distance($miles * 1.60934);
	}
}
```

Here you'll see that the constructor has been made private so we can't create new Distance objects with our usual `new Distance(32)`. Instead we can call `Distance::fromKilometers(32)` or `Distance::fromMiles(19.88)` and we will be returned a new Distance object (as private methods are only accessible within the same class).

### Value Objects

Value objects are little jigsaw pieces that make up a large part of your domain code. They model real life values or ideas into objects. They are typically quite small, not because they are unimportant but because they encapsulate one single idea well. Examples might include distance, money, date, time, location, region, temperature, email address. They are typically formed from primitive values (ints, strings, arrays or other objects) but they carry much more information than their primitive parts. They are a great way to encapsulate validation rules and other behavior, all in one place. They can be considered equal based on their value, for example, one instance of a Length object with a value of 5km should be considered equivalent to another instance of a Length object with a value of 5km. If you give me a £5 note, it is considered the same as any other £5 note, which is _not_ the same as a $5 bill!
There is one key aspect that separates them from entities in that they don't have an identity in your domain.

### Entities

Entities are similar to value objects in that they can have properties and methods, but they also have a unique identity which doesn't change over time. Take a User object, for example: this is typically uniquely identified with an ID. The user may change their address, password, name, even gender but they will remain the same, unique person. There may be two users in your system, both called "John Smith" but that doesn't mean they are the same person. To _identify_ each different John Smith we assign them an identity or ID.

The difference can be quite subtle to pick up on at first, but it is very useful to distinguish for writing clean, declarative, decoupled code.

### Types

