# 🎄 Advent of Code 2022 - day 11 🎄

## Info

Task description: [link](https://adventofcode.com/2022/day/11)

## Notes

#### Part 2:

As we keep playing the game, the worry levels start to grow very fast reaching ridiculous amounts, and operations like sum, multiply or modulus takes longer, so we need to keep our worry levels manageable. So we need to find a least common multiple that can be used to reduce the values instead of 3 as in part 1.

Intuition here is

> For any set of integers n, p and d: if p mod d = 0, then (n mod p) mod d = n mod d
> (mentioned here https://www.reddit.com/r/adventofcode/comments/ziw4aq/2022_day_11_part_2_so_about_the_trick/)
> ...

In this case: d is the divisor (different for each monkey), n is the input number (worry level), and n mod p is the reduced number. What the above observation shows is that if you take p to be a common multiple for every possible d, then you may safely replace n by n mod p without messing up any future divisibility test. Since all the monkey divisors are different primes, the minimum number p that satisfies these conditions is simply the product of all those primes.
