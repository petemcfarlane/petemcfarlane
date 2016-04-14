---
title: Types, Interfaces and Abstracts
tags: [oop, php, design]
categories: [oop]
related:
    Object Orientated Design in PHP: object-orientated-programming-in-php
    Value Objects, Entities and Services: value-objects-entities-services
    Naming things: naming-things

---

## Types

Types are an important concept of OOP. A _type_ refers to a behavioral characteristic of a class, object or interface. There are a few basic scalar types built into the language - `boolean`, `integer`, `float`, `string`, `array`, `object`, `resource` and `null`, and it is probable that you will create your own custom types.
In fact, every object you create will have at least its own type - the objects class name. It may have more than one type if it implements one or more _interface_ types. If it extends another class it will also inherit the type(s) from that parent class.

Some languages only support strict typing, like Java or Scala - where types have to be declared. Some languages don't have any type system, like Ruby or JavaScript. PHP sits in the middle: you can have some typing, or choose to use strict typing everywhere (drastically improved in PHP 7) or use very-little-to-no typing, it's up to the developer.

The purpose of a type is it allows you to write your code in an abstract, flexible manor (with _some_ certainty that the code will at least be compatible). This is because instead of introducing dependencies in your code that depend on a specific, concrete class, you can be more flexible and just depend on the parts or _types_ you need at that point in time. At runtime, your code doesn't care about what specific object it receives, just so long as it meets the type dependency.

I say the above with _some certainty_ is because just because an object has a type, it doesn't guarantee it to be bug free or correct, it just means that the application won't even compile if the types don't match. If you don't use types then programmers can pass any object as any parameter, and if a method or property doesn't exist then an exception will probably be raised. 

## Interfaces

"Interface" has many occurrences in software, user _interface_ (UI), application programming _interface_ (api), a PHP _interface_. Essentially they all imply the same thing - a predefined, set of ways a user or client can manipulate or interrogate something.

Interfaces in PHP look a bit like classes, but with two major differences - they only have method names (they don't contain implementation details), and they cannot be instantiated and made an object.

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

To demonstrate an example of using an interface at a boundary think about a persistence layer. Lets say you have a `RecordCollection` that you want to store `Records` in. Lets make `RecordCollection` an interface, as we're not sure yet how we're going to implement it, but we know it should have at least a `store(Record)` method.

```php
<?php

interface RecordCollection
{
    public function store(Record $record);
}
```

Lets also have a basic `Record`. For demo purposes the record won't be fully coded.
```php
<?php

class Record {
	public $artist;
}
```

The first case we might need to create an implementation of the RecordCollection might be in our test suite (especially if we're doing TDD). Instead of using a database for persistence, for speed and performance we could simply use an in memory array. This will allow us to test against our RecordCollection, but after the request the array will be lost - it is not persistent.

```php
<?php

class InMemoryRecordCollection implements RecordCollection
{
    private $records = [];

    public function store(Record $record)
    {
        $this->records[] = $record;
    }
}
```

Okay, so the above implementation is probably fine for tests or doing things on-the-fly, but what if we want long term persistence? Well, we could use a database, but that still seems a bit overkill. Lets use a regular flat file, loading and saving the records to disk on every request.

```php
<?php

class FileSystemRecordCollection implements RecordCollection
{
    private $storageFile;
    private $records = [];

    public function __construct($filePath)
    {
        $this->storageFile = $filePath;
        $this->records = unserialize(file_get_contents($filePath)) ?: [];
    }

    public function __sleep()
    {
        file_put_contents($this->storageFile, serialize($this->records));
    }

    public function store(Record $record)
    {
        $this->records[] = $record;
    }
}
```

Now we have a working persistent solution. This is very similar to the InMemoryRecordCollection, but when it's loaded it reads all the Records that are saved in the file into an array, and when it is destroyed (when the PHP request is finished) the array is serialized back to the file. (In reality you may wish to add some error checking).

But what happens if your system needs to have a database version for some reason, maybe other applications use it, or the file system isn't powerful enough to support concurrent connections. Ok, then you may have a database implementation, something like so:

```php
<?php

class DBRecordCollection implements RecordCollection
{
    private $db;

    public function __construct(PDO $db)
    {
        $this->db = $db;
    }

    public function store(Record $record)
    {
        $this->db
            ->prepare("INSERT INTO record_collection ...")
            ->bindParam('artist', $record->artist)
            ->execute();
    }
}
```
<small>Obviously, the SQL above is purely for demonstration purposes only</small>

And voilà, we have a database implementation. The point is that our _interface_ never changed, and we can depend on that interface throughout our code base without worrying about what storage mechanism is used. 

## Abstracts

Abstracts are like an interface in that they can't be constructed, but are somewhat like a class in that the methods _can_ contain implementation code. To instantiate an abstract you must create a concrete _class_ that _extends_ the abstract. This will have to implement all the abstract or undefined methods from the parent abstract method. Sounds complex, but maybe an illustration will help:

```php
<?php

abstract class Quadrilateral
{
    protected $width;
    protected $height;

    public function __construct($width, $height)
    {
        $this->width = $width;
        $this->height = $height;
    }

    abstract public function area();

    public function perimeter()
    {
        return $this->width * 2 + $this->height * 2;
    }
}
```

Above we have our _abstract_ class - note the `abstract` keyword before class. This means we cannot initialize it with `$shape = new Quadrilateral();`. Instead we will have to extend it.
Also notice that there are some predefined methods, `__construct`, `area` and `perimeter`. Perimeter has a default implementation so doesn't need to be redefined in the child subclasses. Area has no implementation and is prefixed with `abstract` so this will have to be defined in any subclass.

Lets make three subclasses of Quadrilateral, namely Square, Rectangle and Rhombus (Diamond)

```php
<?php

class Square extends Quadrilateral
{
    public function __construct($width)
    {
        parent::__construct($width, $width);
    }

    public function area()
    {
        return $this->width ** 2;
    }
}

$square = new Square(2);
echo $square->area(); // outputs 4
echo $square->perimeter(); // outputs 8
```

Notice that our Square extends our base abstract Quadrilateral. We have to define `area` (which is just the width squared) but the perimeter doesn't need to be re-implemented, as it is implemented, and correct, in our abstract class.
Note we have overridden the constructor as well, as a Square must have equal height and width, we don't need to redeclare both parameters. To override a method, just redeclare it in the child concrete class. If you want to access the original or parent method, then access it through `parent::methodName($parameters)`, as demonstrated in the Square constructor.


```php
<?php

class Rectangle extends Quadrilateral
{
    public function area()
    {
        return $this->width * $this->height;
    }
}

$rectangle = new Rectangle(3, 6);
echo $rectangle->area(); // outputs 18
echo $rectangle->perimeter(); // outputs 18

```
Our rectangle above is very close to a quadrilateral, so we don't need to override much, but we do still need to define the area method, which is just the width * height.

```php
<?php

class Rhombus extends Quadrilateral
{
    public function area()
    {
        return $this->width * $this->height / 2;
    }

    public function perimeter()
    {
        $side = sqrt($this->width ** 2 + $this->height ** 2);
        return $side * 4;
    }
}

$rhombus = new Rhombus(3, 4);
echo $rhombus->area(); // outputs 6
echo $rhombus->perimeter(); // outputs 20
```
Our final shape, the Rhombus, (or squashed square turned 45˚ on its side) doesn't need to override the constructor (here I'm referring to the diagonals between the corners as width and height, not the edges). It must implement area, which is the product of the diagonals divided by 2. It has overridden the perimeter because although it was defined in the abstract, we want to call different code, namely find the length of one side and multiply by 4.
