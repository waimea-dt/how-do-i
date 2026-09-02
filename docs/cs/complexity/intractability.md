# Real-World Impact of Intractability

Some problems are **intractable** - no computer, however powerful, can find the *guaranteed best* answer for large N in a reasonable time. But real life doesn't stop and wait for a perfect answer. Businesses, governments, and schools still have to make a decision **today**, even if it isn't provably optimal.

Since we can't solve intractable problems exactly for large N, we use:

- **Approximation algorithms** - find a solution close to the best one, quickly
- **Heuristics** - practical "rules of thumb" that usually work well

See [Approximation Algorithms & Heuristics](approximation.md) for how this works in practice.

## Real-World Examples

- **Delivery routes**: courier companies can't calculate the *perfect* route for hundreds of daily drop-offs (a [Travelling Salesperson](/cs/complexity/tsp.md)-style problem) - they use heuristics that find a *good* route in seconds
- **Staff rosters & flight crews**: airlines assigning crews to flights, or hospitals building nurse rosters, face the same NP-hard scheduling problems as [Bin Packing](/cs/complexity/bin-packing.md)
- **Chip design**: arranging millions of components on a circuit board to minimise wiring is intractable at full scale, so engineers use approximations
- **Protein folding**: predicting how a protein folds into its final 3D shape is so intractable that scientists now use AI models (like DeepMind's AlphaFold) trained to *approximate* good answers, rather than calculating them exactly

## In Your School

Intractable problems aren't just abstract examples - your own school runs into them every single week:

- **Timetabling**: fitting every class, teacher, room, and student into a clash-free timetable is closely related to **graph colouring**, a classic NP-hard problem. Timetabling software doesn't try every possible arrangement - it uses heuristics to produce a "good enough" timetable that's ready before term starts, even if a handful of students still get a minor clash
- **Bus routes**: planning the routes for school buses picking up students across a wide area is a real-world **Travelling Salesperson**-style problem - transport coordinators use practical rules of thumb, not a perfect calculation
- **Elective/subject line allocation**: fitting students into a limited number of class lines, each with limited spots and staffing, so as many students as possible get their preferred subjects, is similar to the [Knapsack Problem](/cs/complexity/knapsack.md) - schools rarely satisfy 100% of preferences, because finding the mathematically perfect allocation is too slow to compute
- **Exam scheduling**: making sure no student has two exams at once, across dozens of subjects and rooms, is another clash-avoidance problem that grows explosively harder as more subjects and students are added

> [!TIP]
> Next time your timetable has an awkward gap, or you don't get your first-choice elective, remember: the software behind it isn't broken - it's very likely solving an **intractable** problem, and "good enough, on time" beats "perfect, but never finished".

## Key Terms

<flashcards>

- # Why we can't solve intractable problems exactly

    ---

    For large N, they'd take **too long** - so we use faster methods that don't guarantee the perfect answer.

- # Two practical alternatives

    ---

    **Approximation algorithms** (proven close to optimal) and **heuristics** (practical rules of thumb).

- # School timetabling

    ---

    Closely related to **graph colouring** (NP-hard) - software uses heuristics to produce a clash-free-**ish** timetable in time for term, not a perfect one.

</flashcards>
