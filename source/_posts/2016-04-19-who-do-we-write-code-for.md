---
title: Who do we write code for?
tags: [design, php, oop]
categories: [php]
---

I was recently peeking through an open source PHP project code base, out of curiosity, to see how things had been implemented. I cloned the git repository locally and loaded up phpStorm and started browsing. I was immediately struck by the IDE highlighting issues as to undefined methods and unknown parameter types, due there not being any docblocks, type hints or interfaces.

![phpStorm highlighting syntax warning](/images/highlighted-syntax-warning-phpstorm.png)

Yellow blocks like the above were cropping up everywhere, because the IDE couldn't infer what types the variables were supposed to have. In the above case I would have expected some `Handler` type. I dug further into the bootstrapping of the object and found a `registerHandler` method defined as:

```php
public function registerHandler($handler)
{
    $this->handlers[] = $handler;
}
```

Can you spot the problem? There is no type hint for a handler here. What's wrong with this? Well as a client I could call this method and pass it a parameter of __any__ type, a string, integer or other class. This would result in a PHP Warning like so:

```php
$string = "I'm a string";
$class->registerHandler($string);
PHP Warning:  Uncaught Error: Call to a member function handle() on string in php shell code:1
```

The horror! I dug deeper and found that the `registerHandler` was called three times, and passed objects that were all named `*Handler`. These objects each had a `handle` method, which means that the code would have worked as it is written. But none of the Handler classes implemented any interface that explicitly stated they should `handle` a file, it was just that the developer writing this had to _know_ they each needed a `handle` method.

A _"proper"_ solution (one with interfaces, I thought), might look more like this:
```php
<?php

// a clearly defined interface
interface Handler
{
    public function handle();
}

// an example handler, implementing the Handler interface
class FooHandler implements Handler
{
    public function handle()
    {
        //...
    }
}

// the registerHandler method, expecting a Handler to be passed
public function registerHandler(Handler $handler)
{
    $this->handlers[] = $handler;
}
```

Now trying to pass anything other than a Handler (even if I'm passing an object with a `handle` method) will result in a PHP Fatal Error

```
PHP Fatal error:  Uncaught TypeError: Argument 1 passed to ClassName::registerHandler() must implement interface Handler, string given, called in ...
```

Ahh - job done, isn't that much better

...or is it?

Well, now in my code if I try to pass an _invalid_ parameter I will get a different kind of error highlighted in phpStorm as:

![phpStorm highlighting syntax warning](/images/highlighted-syntax-warning-phpstorm-2.png)

At least this gives me a clue about what it expected from me, so I guess that's slightly better. But nothing actually stops me from writing the above and releasing into production. There's still a need for testing and error monitoring. It doesn't mean my code is going to be completely bug free.

I spoke to the developer of this application and he said where he comes from, in the Ruby world, they don't have static, language types, only duck types - as in if you pass an object that quacks it might as well be a duck. Here it is the developers responsibility to make sure they are passing a _valid_ object.

### To whose benefit is an interface?

Defining an interface makes me _feel safer_ as a developer. I know that myself or anyone else who uses this code can only pass a _valid_ parameter, the method won't even begin to execute if the passed parameter doesn't match the argument type. But it does add some more boilerplate code.

I think the advantage of having interfaces (and abstract classes) is that it allows me to be _explicitly abstract_ in the design of my code, which brings me closer to the business language. Another plus is that it allows me to assume that if the parameters have made it past the type check, then I can safely rely on the parameters inside the method; I don't have to put in conditional statements and further type checking, thus removing boilerplate.
It might also make things easier for other developers (or our future selves) to work with in the future, instead of relying on complex concrete classes with their nitty-gritty implementation details polluting our dependencies we can just look at clean interfaces and focus on the messages passed between the collaborating parts.

Sometimes its worth questioning conventions or challenging our common understanding, and it's a great opportunity to do so when you see something done differently in a project someone else has written. I'd encourage you to think about it, talk to the developer about why they chose a certain implementation over another solution. You'll probably both learn something.

In conclusion: think more. About what you read, about what you write, about the consequences.

## Further reading
[Drop 'public' not 'var'! - by Evert Pot](https://evertpot.com/drop-public-not-var/)