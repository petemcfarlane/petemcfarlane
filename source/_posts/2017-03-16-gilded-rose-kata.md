---
title: Code Kata - Gilded Rose
tags: [kata, haskell, php, phunkie, tdd]
categories: [kata]
---

The Gilded Rose Kata is a refactoring based kata. It is available from this
GitHub in many languages. I tried to solve it in PHP and also Haskell.

I started by writing test cases that matched the requirements in the
description, and yet ran with the existing code.

Once I felt I had the test cases sufficiently covered, I began to refactor the
code - the interesting part.

The first thing I refactored was pushing the behaviour of updating an `Item` onto
the `Item` itself, so the `GildedRose` was just looping over all the items in its
inventory and calling `update` on them.

```haskell
updateQuality :: GildedRose -> GildedRose
updateQuality = map updateItem

updateItem :: Item -> Item
updateItem (Item name sellIn quality) = ...
```

The code was full of conditionals, switching on the item name or type.

This was easy to extract behaviour based on the item name in Haskell thanks to
pattern matching:

```haskell
updateItem :: Item -> Item
updateItem (Item "Aged Brie" sellIn quality) = ...
updateItem (Item "Backstage passes to a TAFKAL80ETC concert" sellIn quality) = ...
updateItem (Item "Sulfuras, Hand of Ragnaros" sellIn quality) = ...
updateItem (Item "Sulfuras, Hand of Ragnaros" sellIn quality) = ...
updateItem (Item name sellIn quality) = ...
```

Once I had the different edge cases handled, I could extract conditionals out
from the most general case at the bottom.

This is my final solution:

```haskell
module GildedRose where

type GildedRose = [Item]

data Item = Item { name :: String, sellIn :: Int, quality :: Int } deriving (Eq)

instance Show Item where
  show (Item name sellIn quality) =
    name ++ ", " ++ show sellIn ++ ", " ++ show quality

updateQuality :: GildedRose -> GildedRose
updateQuality = map updateItem

restrictQuality :: Int -> Int
restrictQuality = min 50 . max 0

updateItem :: Item -> Item
updateItem (Item "Aged Brie" sellIn quality) =
  Item "Aged Brie" sellIn' quality'
    where sellIn'   = sellIn - 1
          quality'  = restrictQuality $ if sellIn > 0
                                        then quality + 1
                                        else quality + 2

updateItem (Item "Backstage passes to a TAFKAL80ETC concert" sellIn quality) =
  Item "Backstage passes to a TAFKAL80ETC concert" sellIn' (restrictQuality quality')
    where sellIn' = sellIn - 1
          quality'
            | sellIn < 1  = 0
            | sellIn < 6  =  quality + 3
            | sellIn < 11 =  quality + 2
            | otherwise   =  quality + 1

updateItem (Item "Sulfuras, Hand of Ragnaros" sellIn _) =
  Item "Sulfuras, Hand of Ragnaros" sellIn 80

updateItem (Item "Conjured Mana Cake" sellIn quality) =
  Item "Conjured Mana Cake" sellIn' quality'
    where sellIn'  = sellIn - 1
          quality' = restrictQuality $ if sellIn > 0
                                       then quality - 2
                                       else quality - 4

updateItem (Item name sellIn quality) =
  Item name sellIn' quality'
    where sellIn'  = sellIn - 1
          quality' = restrictQuality $ if sellIn > 0
                                       then quality - 1
                                       else quality - 2

```

You can see when I got round to adding the Conjured item it was just a case of
adding an extra case to the pattern matching.
