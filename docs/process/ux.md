# User Experience (UX)

UX design considers everything a person encounters when using a product: the visual design, the words on screen, how long things take, what happens when something goes wrong, and whether the end result matches what they were hoping for.

## UI? UX? Usability?

- The **user interface** is **how** the user interacts with a system
- **Usability** is about whether a system *works*
- **User experience (UX)** is about how using it *feels*

![UI vs UX](_assets/ux/ui-vs-ux.png)

A product can be technically usable but still frustrating, confusing, or unpleasant - **good UX means the whole interaction feels smooth, satisfying, and right for the user**.


# UX Core Principles

Good UX can be summed up with a small set of practical rules. Keep these in mind while designing and testing.

> [!TIP]
> If you want to read more about good UX and the principles to follow, see [Laws of UX](https://lawsofux.com/), or this article from [UX Design Institute](https://www.uxdesigninstitute.com/blog/ux-design-principles-2026/)



<cards size="">

## <i data-lucide="user-round"></i> Know Your User

> Design for real people, not yourself.

The single biggest UX mistake is assuming your users think like you do. Different people have different goals, skills, expectations, and patience levels.

![](_assets/ux/users.png)

#### Consider:
- Who will use this? (age, experience, context)
- What is their main goal?
- What device will they use most?

> [!EXAMPLE]
> To make sure that I know my users well, and that the system works well for them, I will:
> - Talk to my end-users to discover specific needs they have
> - Regularly test my ideas, designs and the system with the end-users to see what is working well or not
> - etc.

---

## <i data-lucide="map"></i> Clear User Flows

> Make key tasks follow a clear path.

A user flow is the step-by-step path to complete a task. Each flow should be short, clear, and free of dead ends.

![](_assets/ux/flow-steps.png)

#### Consider:
- What are your top 1-2 tasks (e.g. sign up, find info, submit form)?
- How many steps does each task take?
- Where might users get stuck?

> [!EXAMPLE]
> To make sure that the user has clear interactions that 'flow' well, I will:
> - Plan out key user flows early in the design and discuss them with end-users
> - Regularly test the system with end users to ensure that they can intuitively perform tasks with minimal help
> - etc.


---

## <i data-lucide="layout-dashboard"></i> Consistent and Clear

> Don't make users relearn where things are.

Users learn faster when pages are consistent. Keep navigation, buttons, and layouts predictable.

![](_assets/ux/consistent.png)

#### Consider:
- Are similar pages laid out in a similar way?
- Is the navigation consistent across all pages?
- Are buttons and links easy to spot?

A great way to ensure consistency in your design is to use a design system (e.g. via CSS variables and rules):

![](_assets/ux/design-system.png)

> [!EXAMPLE]
> To make sure that create a system that is consistent and clear, I will:
> - Come up with a design system that takes into account the needs of the end-users
> - Discuss layouts and prototypes with end-users to ensure they are clear
> - etc.


---

## <i data-lucide="timer"></i> Keep Tasks Quick

> Every extra click, wait, or step costs goodwill.

If tasks take too long, users give up. Reduce steps and remove unnecessary friction.

![](_assets/ux/waiting.png)

#### Consider:
- Can common tasks be completed in as few steps as possible?
- Are loading times acceptable for your users?
- Are forms as short as possible?

> [!EXAMPLE]
> To make sure that the system is as efficient as possible, I will:
> - Design all actions to have the minimal number of steps / screens as possible
> - Regularly test the system with end users to measure how easy / frustrating it is to perform key tasks
> - etc.


---

## <i data-lucide="message-circle"></i> Clear, Helpful Language

> Every word in your interface is part of the UX.

Labels, button text, and error messages should be simple and direct.

![](_assets/ux/clear-language.png)

#### Consider:
- Are labels and button text specific and action-oriented? ("Save changes" not "Submit")
- Is the reading level appropriate for the target audience?
- Do error messages explain what went wrong and how to fix it?

> [!EXAMPLE]
> To make sure that language is as helpful as possible, I will:
> - Use text that meets the needs of my end-users in terms of reading level
> - Check Māori translations of all text with a first-language speaker
> - etc.


---

## <i data-lucide="test-tube-diagonal"></i> Test and Improve

> Your assumptions will be wrong. Testing shows you where.

Simple testing catches problems early. Even 2-3 users can reveal major issues.

![](_assets/ux/test.png)

#### Consider:
- Have people outside the design team tried to use it?
- Were they able to complete core tasks without help?
- What should you change based on their feedback?

> [!EXAMPLE]
> To make sure that the system gives the best possible UX for my users, I will:
> - Regularly test the design and working system with end users to gather feedback
> - Act upon the feedback to improve the system at every stage
> - etc.

</cards>

