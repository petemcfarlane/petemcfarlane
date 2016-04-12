---
title: Types, Interfaces and Abstracts
tags: [oop, php, design]
categories: [oop]
---

### Types

Types are an important concept of OOP. A _type_ refers to a behavioral characteristic of a class, object or interface. There are a few basic scalar types built into the language - `boolean`, `integer`, `float`, `string`, `array`, `object`, `resource` and `null`, and it is probable that you will create your own custom types.
In fact, every object you create will have at least its own type (the objects class name). It may have more than one type if it implements one or more _interface_ types. If it extends another class it will also inherit the type(s) from that parent class.

Some languages only support strict typing, like Java or Scala - where types have to be declared. Some languages don't have any type system, like Ruby. PHP sits in the middle: you can have some typing, or choose to use strict typing everywhere (drastically improved in PHP 7) or use very-little-to-no typing.

The purpose of a type is it allows you to write your code in an abstract, flexible manor (with _some_ certainty that the code will at least be compatible). This is because instead of introducing dependencies elsewhere in your code that depend on a specific, concrete class, you can be more flexible and just depend on the parts you need at that point in time. At runtime, your code doesn't care about what specific object it receives, just so long as it meets the type dependency.

I say the above with _some certainty_ is because just because an object has a type, it doesn't guarantee it to be bug free or correct, it just means that the application won't even compile if the types don't match. Where languages benefit from being less strict (or not typed) is that the programmers can pass any object to anywhere, and if a class calls a method or property on the passed object which it doesn't have then an exception will probably be raised at that point. 

### Interface

"Interface" has many occurrences in software, user _interface_ (UI), application programming _interface_ (api), a PHP _interface_. Essentially they all imply the same thing - a predefined, set of ways a user or client can manipulate or interrogate something.

Interfaces in PHP look a bit like classes, but with two major differences - they only have method names without the implementation details, and they cannot be instantiated and made an object.

There are two particularly useful uses for interfaces. One is for abstracting a type, or sharing behavior. The other is for separating code at boundaries.

As an example, a `MediaPlayer` might `play` multiple formats or types of `Media`, including `MP3`, `WAV`, `AIFF`. Each of these types will probably have different instructions and properties relating to decoding, sample rate, channel splitting and D/A conversion but we can leave all those nitty-gritty implementation details up to the individual type. All we care about from the MediaPlayers perspective is that we can `play(Media)`.

```php
class MediaPlayer
{
	public function play(Media $media)
	{
		$media->play();
	}
}
```
```php
interface Media
{
	public function play();
}
```
```php
class MP3 implements Media
{
	public function play()
	{
		// specific instructions to decode/play an mp3.
	}
}
```
```php
class WAV implements Media
{
	public function play()
	{
		// specific instructions to decode/play an wav.
	}
}
```
```php
class AIFF implements Media
{
	public function play()
	{
		// specific instructions to decode/play an aiff.
	}
}
```
