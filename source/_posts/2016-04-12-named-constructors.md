---
title: Named constructors
tags: [oop, php, design]
categories: [oop]
related:
    Naming things: naming-things
    Value Objects, Entities and Services: value-objects-entities-services
    Object Orientated Design in PHP: object-orientated-programming-in-php
    Types, interfaces and abstracts: types-interfaces-abstracts

---

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

