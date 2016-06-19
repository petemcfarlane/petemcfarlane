---
title: Transpose
tags: [functional programming, php, package]
categories: [functional programming]
related:
    PHP array groupBy: php-array-group-by-function

---

A little known function, with not too many use cases, but a powerful and elegant
tool to have in your belt.

The transpose function takes a multi-dimensional array, and switches the row
indices with the column indices. A visualisation might explain things more clearly:

Consider we have a 2D array of columns 1 to 4 and rows A to D:
```
A1 A2 A3 A4
B1 B2 B3 B4
C1 C2 C3 C4
D1 D2 D3 D4
```

By transposing that array we end up with the following:

```
A1 B1 C1 D1
A2 B2 C2 D2
A3 B3 C3 D3
A4 B4 C4 D4
```

It's the same data, but the columns and rows have been switched around.

## Use cases

We used this in a code kata last week, the exercise was to convert an ascii
representation of digits and transform that to a string of numbers
e.g.
```
 _     _  _ 
| |  | _| _|
|_|  ||_  _|
            
```
becomes `"0123"`

Each number is 4 lines tall and three characters wide (space, pipe or
underscore only).

Here is the pseudo code and steps for how we solved this:

Split the ascii string into lines
```
[
    " _     _  _ ",
    "| |  | _| _|",
    "|_|  ||_  _|",
    "            ",
]
```

Map over each line, splitting the line into an array of strings of length 3
```
[
    [ " _ ", "   ", " _ ", " _ " ],
    [ "| |", "  |", " _|", " _|" ],
    [ "|_|", "  |", "|_ ", " _|" ],
    [ "   ", "   ", "   ", "   " ],
]
```

Transpose the array, so we have an array of ascii characters

```
[
    [ " _ ", "| |", "|_|", "   " ], // zero
    [ "   ", "  |", "  |", "   " ], // one
    [ " _ ", " _|", "|_ ", "   " ], // two
    [ " _ ", " _|", " |_", "   " ], // three
]
```

Lets map over and concat the above into an array of strings
```
[
    " _ | ||_|   ", // zero
    "     |  |   ", // one
    " _  _||_    ", // two
    " _  _| |_   ", // three
]
```

Now we have an array of chars in string form we can use this to lookup the
numeric value from a hash map.

```
function lookup ($ascii)
{
    $asciiMap = [
        " _ | ||_|   ",
        "     |  |   ",
        " _  _||_    ",
        " _  _| _|   ",
        "   |_|  |   ",
        " _ |_  _|   ",
        " _ |_ |_|   ",
        " _   |  |   ",
        " _ |_||_|   ",
        " _ |_| _|   ",
    ];

    if (false !== $n = array_search($ascii, $asciiMap)) {
        return (string) $n;
    }
}
```

If we map our `lookup` function over our previous strings we get

```
[
    "0",
    "1",
    "2",
    "3",
]
```

Hopefully you can see now that we just need to concat the above array to return
our final result
```
"0123"
```
et voilà!

> Some more solutions to the kata above, implemented in Haskell, JavaScript and PHP.
http://github.com/petemcfarlane/ascii-number-ocr-kata
PRs in other languages welcome!

If you're using a language without the transpose function, you may have to write
something like this:

```
$rows = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
];

function transpose ($rows)
{
    $temp = [];

    foreach ($rows as $r => $columns) {
        foreach ($columns as $c => $value) {
            $temp[$c][$r] = $value;
        }
    }

    return $temp;
}
```

or you could just pull in a function from another library, e.g.
[PHP](http://packagist.org/packages/petemc/transpose) 😉

Another use case for `transpose`, for cleaning up form input, by Adam Wathan:
http://adamwathan.me/2016/04/06/cleaning-up-form-input-with-transpose/