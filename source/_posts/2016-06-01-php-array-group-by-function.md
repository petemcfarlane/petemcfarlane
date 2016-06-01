---
title: PHP Group array by key or callback
tags: [kata, haskell, js, tdd]
categories: [kata]
---

Have you ever needed to group an array of data in PHP and had to write awkward loops or array_reduce code to accomplish this?

I've created a small package (just one function actually) and published it on Packagist.com so you can conveniently install it into your PHP applications with Composer.

```
composer install group-by/group-by
```


It adds a grouping functionality to arrays, allowing you to group by passing each item in the array to a callback.

Here's how you might want to use it:

```php
<?php

use function GroupBy\groupBy;

// $students in an array of `stdClass Object`
$students = [
    (object) ['name' => 'adam', 'year' => '10'],
    (object) ['name' => 'becky', 'year' => '12'],
    (object) ['name' => 'chris', 'year' => '11'],
    (object) ['name' => 'deborah', 'year' => '10'],
    (object) ['name' => 'edward', 'year' => '12'],
];

$groupByYear = function ($student) {
    return $student->year;
};

$groupedByYear = groupBy($students, $groupByYear);

/*
$groupedByYear is now equal to
[
    [10] => [
        [0] => stdClass Object
            (
                [name] => adam
                [year] => 10
            )
        [1] => stdClass Object
            (
                [name] => deborah
                [year] => 10
            )
        ]
    [12] => [
        [0] => stdClass Object
            (
                [name] => becky
                [year] => 12
            )
        [1] => stdClass Object
            (
                [name] => edward
                [year] => 12
            )
        ]
    [11] => [
        [0] => stdClass Object
            (
                [name] => chris
                [year] => 11
            )
    ]
]
*/
```

You could also group an array of arrays, like so:


```php
<?php

use function GroupBy\groupBy;

$numberList = [1, 2, 3, 4, 5, 987, 554, 32];

// The array item value will be passed to the callback.
$oddOrEven = function ($n) {
    return $n % 2 == 0 ? 'even' : 'odd';
};

$oddAndEven = groupBy($numberList, $oddOrEven);

/*
$oddAndEven is now equal to
[
    'odd' => [1, 3, 5, 987],
    'even' => [2, 4, 554, 32],
];
*/
```

If you are grouping a group of arrays by a sub array key, you can just pass the string value of that key, like so:

```php
<?php

use function GroupBy\groupBy;

$students = [
    ['name' => 'adam', 'year' => '10'],
    ['name' => 'becky', 'year' => '12'],
    ['name' => 'chris', 'year' => '11'],
    ['name' => 'deborah', 'year' => '10'],
    ['name' => 'edward', 'year' => '12'],
];

$groupedByYear = groupBy($students, 'year');

/*
$groupedByYear is equal to
[
    10 => [
        ['name' => 'adam', 'year' => '10'],
        ['name' => 'deborah', 'year' => '10'],
    ],
    11 => [
        ['name' => 'chris', 'year' => '11'],
    ],
    12 => [
        ['name' => 'becky', 'year' => '12'],
        ['name' => 'edward', 'year' => '12'],
    ],
]
*/
```

I have been using Haskell and Scala more recently and have found these groupBy methods very useful. I'm surprised I couldn't find a simple way to do this in PHP, so hopefully this will be useful to other people too.

Let me know if you like it or have any suggestions to improve it.
