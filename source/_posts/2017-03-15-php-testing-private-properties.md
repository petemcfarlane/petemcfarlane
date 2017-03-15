---
title: PHP Testing your privates
tags: [php, tdd]
categories: [testing]
related:
    PHP array groupBy: php-array-group-by-function

---
I was recently writing some tests for a PHP object that had some internal state
I wanted to check.

As I was building the class with TDD it was natural for me to test the state by
adding `getter`s to the object, so I could assemble my object, run the methods I
wanted to test, then assert the resulting state of the object.

```php
<?php

class FooTest extends PHPUnit\Framework\TestCase
{
  function test_it_does_something_internally()
  {
    $foo = new Foo;
    $foo->doSomething();

    $this->assertEquals('modified', $foo->getProperty());
  }
}

class Foo
{
  private $property;

  public function doSomething()
  {
    // Some other code...
    $this->property = 'modified';
  }

  public function getProperty()
  {
    return $this->property;
  }
}
```

This all looked good, but once I had finished writing my tests and code I
realised that my tests were the only places I was using the `getProperty()`
method. I had methods in my object that were only being used in my
test. This didn't feel quite
right. I particularly didn't want clients of this object to be able to get at
the private property (which was a reference to another object in this case) and
manipulate that directly, I wanted other developers to interact with that object
_through_ this Façade class. But how did I communicate that intent?

A few options, some better than others, came to mind:

1) Drop the public `getter` method on the class, and use reflection in the test
to check the property.

```php
<?php

class FooTest extends PHPUnit\Framework\TestCase
{
  function test_it_does_something_internally()
  {
    $foo = new Foo;
    $foo->doSomething();

    $property = (new ReflectionObject($foo))->getProperty('property');
    $property->setAccessible('true');

    $this->assertEquals('modified', $property->getValue($foo));
  }
}

class Foo
{
  private $property;

  public function doSomething()
  {
    // Some other code...
    $this->property = 'modified';
  }
}
```

It does clean up the source code by removing the method, but now the test seems
a bit clunky.

2) Don't have the public `getter` in the class we are testing, but make a test
class (or anonymous class if using PHP7!) that extends the base class and add
the `getter` method in there.

```php
<?php

class FooTest extends PHPUnit\Framework\TestCase
{
  function test_it_does_something_internally()
  {
    $foo = new Class extends Foo
    {
      public function getProperty()
      {
        return $this->property;
      }
    };

    $foo->doSomething();

    $this->assertEquals('modified', $foo->getProperty());
  }
}

class Foo
{
  protected $property;

  public function doSomething()
  {
    // Some other code...
    $this->property = 'modified';
  }
}
```
Note that in order for the child test class to be able to access the property I
would have to declare the visibility as `protected` and not `private`. Also this
would not work if the class I was testing was declared as `final`, as I would
not be able to extend it.

3) Leave the `getter` method there, but mark it as `@internal` - so if other
developers tried to use it in the future, and if they are using an IDE like
PHPStorm then it would be displayed with a ~~strikethrough~~.

This is a bit unconventional, and the other developers could still use the
method as it is part of the classes public API, but if everyone on the team knew
not to use `@internal` methods then this could be the easiest option.

4) Use an integration test, stop unit testing this bit. The reason there were no
other needs to use the `getter` in the rest of the code base was because the
private property was mapped by an ORM (Doctrine in this case) to the database. I
could have made my test more of an integration test like so:

```php
<?php

class FooTest extends PHPUnit\Framework\TestCase
{
  // the entity manager would have to be constructed or passed somewhere else
  private $em;

  function test_it_does_something_internally()
  {
    $foo = new Foo;
    $foo->doSomething();

    $this->em->save($foo);

    $dbResult = // insert SQL query here: SELECT `property` FROM `table` WHERE

    $this->assertEquals('modified', $dbResult['property']);
  }
}

class Foo
{
  private $property;

  public function doSomething()
  {
    // Some other code...
    $this->property = 'modified';
  }
}
```

The plus side of this is I'm testing something closer to the real code, but
that's about the only benefit. The cons are that it requires a database
connection to run, so it will be a little bit slower, and there is that ugly,
brittle SQL query in there to fetch the data too. I guess I could use an
interface for the repository saving the element, and just save it to memory, but
then I'd still need to add a public `getter` to view the property or reflection
again, so I've not really gained anything!

5) Then last week I read [this great blog post](https://markbakeruk.net/2017/03/05/closures-anonymous-classes-test-mocking-1/) from [Mark Baker](https://twitter.com/Mark_Baker). He explains that you can bind
closures to another object, and grant them the scope of that object - meaning
you can access private properties/methods once your closure is bound to a
particular class. It deserves a demonstration:

```php
<?php

class FooTest extends PHPUnit\Framework\TestCase
{
  function test_it_does_something_internally()
  {
    $foo = new Foo;
    $foo->doSomething();

    $getProperty = function()
    {
      return $this->property;
    };

    $getPropertyOfFoo = $getProperty->bindTo($foo, $foo);

    $this->assertEquals('modified', $getPropertyOfFoo());
  }
}

class Foo
{
  private $property;

  public function doSomething()
  {
    // Some other code...
    $this->property = 'modified';
  }
}
```

To anyone who's not bound a closure to another object before this may look a
little strange at first. We have effectively moved the public `getter` from our
tested class, into a closure `$getProperty`. We then `bindTo($foo, $foo)` which
effectively means that `$this` refers to our instance of `$foo` in the closure.
We then call the closure in `$getPropertyOfFoo()`. I think this does muddle the
test a little bit so I extracted it out into a private method, which meant I
could call it multiple times in my test case too if I needed.

```php
<?php

class FooTest extends PHPUnit\Framework\TestCase
{
  function test_it_does_something_internally()
  {
    $foo = new Foo;
    $foo->doSomething();

    $this->assertEquals('modified', $this->getPropertyOf($foo));
  }

  private function getPropertyOf($obj)
  {
    return (function() {
      return $this->property;
    })->bindTo($obj, $obj)();
  }
}

class Foo
{
  private $property;

  public function doSomething()
  {
    // Some other code...
    $this->property = 'modified';
  }
}
```

I don't think this should be used everywhere as generally I prefer tests that
test behaviour rather than state, but this pattern could come in handy when you
feel your test behaviour leaking into your domain model.

Have you ever been in a similar scenario as I describe? How did you solve that?
I'd be interested to hear!
