---
title: Code Kata - Binary to Decimal
tags: [kata, haskell, js, tdd]
categories: [kata]
---
Here is a nice little code kata - I've implemented it in JavaScript and Haskell, which I'm learning at the moment.

> Given a binary string representation of a number, return its decimal value.

Here's the numbers 0 to 10 represented as base 2 (binary):

```
'0' // 0
'1' // 1
'10' // 2
'11' // 3
'100' // 4
'101' // 5
'110' // 6
'111' // 7
'1000' // 8
'1001' // 9
'1010' // 10
```

The first time implementing this my colleagues and I came up with some lengthy implementation, just to get our tests to pass. By the time we'd gotten to test 4/5 the code duplication became quite clear and we were able to refactor it out, as is the third step of TDD.

Here is my javascript test file. I used Tape as a test framework

```javascript
var test = require('tape'),
    bin2dec = require('./bin2dec')

test(function (t) {
    t.equal(bin2dec('0'), 0);
    t.equal(bin2dec('1'), 1);
    t.equal(bin2dec('10'), 2);
    t.equal(bin2dec('11'), 3);
    t.equal(bin2dec('100'), 4);
    t.equal(bin2dec('101'), 5);
    t.equal(bin2dec('110'), 6);
    t.equal(bin2dec('111'), 7);
    t.equal(bin2dec('1000'), 8);
    t.equal(bin2dec('1001'), 9);
    t.equal(bin2dec('1010'), 10);
    t.end();
});
```

And this is the final implementation we came up with 

```javascript
module.exports = (binaryString) => 
    Array.from(binaryString).reduce((acc, current) => acc * 2 + Number(current), 0)
```

That's pretty concise, especially using some ES6 features like anonymous functions and implicit returns.

Here's how the test code looks in Haskell:

```haskell
import Test.HUnit (Assertion, (@=?), runTestTT, Test(..), Counts(..))
import System.Exit (ExitCode(..), exitWith)
import Bin2dec (bin2dec)

exitProperly :: IO Counts -> IO ()
exitProperly m = do
  counts <- m
  exitWith $ if failures counts /= 0 || errors counts /= 0 then ExitFailure 1 else ExitSuccess

testCase :: String -> Assertion -> Test
testCase label assertion = TestLabel label (TestCase assertion)

main :: IO ()
main = exitProperly $ runTestTT $ TestList
       [ TestList bin2DecTest ]

bin2DecTest :: [Test]
bin2DecTest =
  [ testCase "zero" $
    0 @=? bin2dec "0"
  , testCase "one" $
    1 @=? bin2dec "1"
  , testCase "two" $
    2 @=? bin2dec "10"
  , testCase "three" $
    3 @=? bin2dec "11"
  , testCase "four" $
    4 @=? bin2dec "100"
  , testCase "five" $
    5 @=? bin2dec "101"
  , testCase "six" $
    6 @=? bin2dec "110"
  , testCase "seven" $
    7 @=? bin2dec "111"
  , testCase "eight" $
    8 @=? bin2dec "1000"
  , testCase "nine" $
    9 @=? bin2dec "1001"
  , testCase "ten" $
    10 @=? bin2dec "1010"
  ]
```

and here's the implementation:

```haskell
module Bin2dec (bin2dec) where

import Data.Char

bin2dec :: String -> Int
bin2dec = foldl (\acc x -> acc * 2 + digitToInt x) 0
```

Not bad! Do you have any other solutions that you think are more readable? Which do you prefer?

I must say I prefer the Haskell implementation, but I definitely prefer the JavaScript test file! I'll have to have a look at HUnit to see if I can write something simpler...

## UPDATE: Added Scala Implementation

```scala
def bin2dec (binaryString: String): Int = {
  binaryString.foldLeft(0)((acc, char) => acc * 2 + char.asDigit)
}
```

This is basically the same implementation but different language. 
```scala
"1010"                              // String = 1010
"1010".toList                       // List[Char] = List(1, 0, 1, 0)
"1010".toList.map(_.toInt)          // List[Int] = List(49, 48, 49, 48)
"1010".toList.map(_.toString)       // List[String] = List(1, 0, 1, 0)
"1010".toList.map(_.toString.toInt) // List[Int] = List(1, 0, 1, 0)
"1010".toList.map(_.asDigit)        // List[Int] = List(1, 0, 1, 0)
```

It's worth noting that converting a `Char` to `Int` returns an ASCII encoded value, so you need to use `_.toString.toInt` or the simpler `_.asDigit`.