---
title: Dynamic Programming kata
tags: [design, kata, functional programming, haskell, php]
categories: [functional programming]
related:

---

Last week at the Leeds Code Dojo I was introduced to a dynamic programming problem often referred to as the minimum change problem or coin problem. The premise is:

> Given an infinite supply of coins of different values, what is the least amount of coins you will need to make a desired amount of change.

As an example using British Pound Sterling (where we have coins of value 1, 2, 5, 10, 20, 50 and 100 pence), whats the fewest coins required to make 14p. Some possible options are:

 - [1,1,1,1,1,1,1,1,1,1,1,1,1,1]
 - [2,2,2,2,2,2,2]
 - [5,5,2,2]
 - [10,2,2]

There are more combinations possible, this is just illustrative. The solution using the least number of coins is [10,2,2] = 3 coins.

## The greedy solution

The first solution uses a greedy algorithm, so subtracts the largest coin and so on, so in the above example take 10 from 14, leaving 4, then take 2 and take 2 again. This seems to work in this case but for some currencies where the denomination has different values, such as Lilliputian coins [1,4,15,20,50] this doesn't always work. Take `23` for example. The greedy algorithm would choose `20` first as the biggest coin that fits the change, then require 3 x `1` coins, totaling 4 [20,1,1,1]. But [15,4,4] also totals `23` and in one fewer coin!

## The recursive solution

A more correct solution uses recursion to find the minimum number of coins required to get to the target value (minus the value of some coin).

```haskell
minNumCoins :: [Int] -> Int -> Int
minNumCoins coins target = map numCoins [0..] !! target
    where
        numCoins 0 = 0
        numCoins i | i `elem` coins = 1
        numCoins i = minimum [1 + minNumCoins coins (i-c) | c <- coins, c < i]
```

I will try to briefly describe what each line is doing
```haskell
minNumCoins :: [Int] -> Int -> Int
minNumCoins coins target = map numCoins [0..] !! target
    where numCoins = ...
```
The first line is defining the method signature. It takes a list of `coins` of type `[Int]` and a `target` change value of type `Int` and returns the minimum number of coins, also an `Int`.

In the second line I am mapping a function `numCoins` over an infinite list `[0..]`, then extracting the value using the `!!` index function, returning the value from the resulting list at `target`. I can use an infinite list because Haskell is lazy, and won't actually commute the next list elements value until the last possible moment. So although in theory it is infinite, it will stop at the `target` value.

```haskell
    where
        numCoins 0 = 0
        numCoins i | i `elem` coins = 1
        numCoins i = ...
```

Then comes the `numCoins` method. The first two cases capture the edge cases. If the index value is 0, return 0. If the index matches the value of one of our coins then just return 1, for 1 coin.

```haskell
        numCoins i = minimum [1 + minNumCoins coins (i-c) | c <- coins, c < i]
```

And then the final case, if the other two statements are not matched. `minimum` selects the minimum value from a list. The list in our case comes from the list comprehension `[1 + minNumCoins coins (i-c) | c <- coins, c < i]`. This maps through each of our list of `coins` as `c` (the `c <- coins` part), then filters the coins that are less than the value we are trying to find `i` (in `c < i`). For each value of c resulting, we're mapping it through `1 + minNumCoins coins (i-c)`. This is the recursive part of our solution - we're calling `minNumCoins` again but this time not with our original target, but with our target less the value of a coin (i-c), and adding 1 to compensate for the fact that we are adding some coin.

This works and will give us the correct answer, but it is not very efficient because for large numbers there may be lots of paths it has to go back through and re-calculate.

## Dynamic Programming

An even better solution that is still correct but more efficient, uses __memoization__ to _cache_ the result of each method call so it doesn't have to recursively look through the `numCoins` for every value. In some languages this is done by creating an array the size of the target value, and working out the value for each step in between going up to the target. Haskell provides a better way, using a lazy array. If we refer to the array from inside our function, and the array refers to other points in itself, Haskell will only compute each step value once, and remember that for us.

```haskell
import Data.Array

minNumCoins :: [Int] -> Int -> Int
minNumCoins coins target = lookup ! target
    where
        lookup = listArray (0, target) $ map numCoins [0..]
        numCoins 0 = 0
        numCoins i | i `elem` coins = 1
        numCoins i = minimum [1 + lookup ! (i-c) | c <- coins, c < i]
```

Not much has changed, but we are now selecting the target from a `lookup` value. This is instantiated as an array the size of our target value, and filled from mapping over the `numCoins [0..]` infinite list. Instead of recursively calling the `minNumCoins` method on the last line, we can simply select the value from our lookup array. This provides us with huge performance gains for looking up large values.

### Further reading

 - [Dynamic Programming - Python](http://interactivepython.org/runestone/static/pythonds/Recursion/DynamicProgramming.html)
 - [Lazy Dynamic Programming - Haskell](http://jelv.is/blog/Lazy-Dynamic-Programming/)
 - [Leeds Code Dojo - Dynamic Programming](https://github.com/LeedsCodeDojo/DynamicProgramming)