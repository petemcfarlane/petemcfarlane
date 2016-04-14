---
title: Naming things
tags: [oop, php, design]
categories: [oop]
related:
    Named (static) constructors: named-constructors
    Value Objects, Entities and Services: value-objects-entities-services
    Object Orientated Design in PHP: object-orientated-programming-in-php
    Types, interfaces and abstracts: types-interfaces-abstracts

---

Without sounding too pretentious, I think naming things well is a skill that comes with experience. As a software designer you are given the complete freedom to name your variables, functions and classes however you choose, within the constraints of the language.

Here are some tips from lessons I've learned:

 - __be clear__ - give things their proper name. Name things how you would talk about them with the domain experts and users. Don't give variables or methods one letter names. The only exceptions may be when in a very arithmetic heavy calculations, for example, substituting `$w` and `$h` for `$width` and `$height` may be okay.
 - __be specific where necessary__ - I used to work on a system where every collection or array was called `$data`. If you have a collection of `Person` items, please don't name it `$array` or `$data`, what's wrong with `$people`?!
 - __be abstract where necessary__ - if you're naming an abstract class or interface, try to be generic, give it the abstract name you might use when talking about it in conversation.
 - __question existing names and conventions__ - how does it sound when you read the method? Does it flow? Could you speak it in conversation?
 - __use conventions__ - in PHP methods and properties are written in camelCase(). Classes and Namespaces should use StudlyCase. If in doubt, the [PSR2 standards](http://www.php-fig.org/psr/psr-2/) is a good starting place.
 - __be consistent__ - if a method is command, it should sound like a command, e.g. `sendEmail()`. If a method is interrogative, it will probably be prefixed with get*, find*, is*, or has*. `get*` implies a retrieval of something normally instantiated on an object, like a property. `find*` implies that some computation or searching may be necessary in order to retrieve something. `is*` and `has*` both imply a boolean true/false return type so they may be used in conditionals, for example `if ($object->isValid()) {...}` and `if ($post->hasComments()) {...}`.
 - __be unambiguous__ - `$list->empty()` - does this imply a question to see if a list is empty, or a command to empty the list?
 - __don't needlessly repeat types__ - for example `$basket->addToBasket($product)` would be better as `$basket->add($product)`.
 - __comments are code smells__ I find if I need to comment something it's because my code is so complicated I can't follow it or remember how it's working. This is a definite code smell, but one that is easy to fix by either extracting a complicated logic into a method or variable and using the old comment as a method or variable name.
 - __Don't be afraid to rename things__ - it is super easy to rename things especially with an IDE like phpStorm. If something doesn't sound quite right or if something changes you are free to change method/variable/class names to reflect that change. 

Do you have any other naming tips or things that you hate seeing in other code bases? Please share in the comments below and I'll update my list!