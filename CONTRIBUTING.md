# Contributing

We welcome contributions to Samui Wallet. Please follow these guidelines to ensure a smooth process.

## How to Contribute

1.  **Fork the Repository:** Start by forking the main repository to your own GitHub account.
2.  **Create a Branch:** Create a new branch for your feature or bugfix, prefixed with your GitHub username. This user is the owner of the branch and the one who creates the PR. They are responsible for answering questions and following up in order to land it PR quickly. Prevent using `feat`/`fix` as a prefix, instead use the commit message to indicate the role of the commit.
    ```bash
    git checkout -b <your-github-username>/your-feature-name
    ```
3.  **Make Changes:** Write your code. Ensure it adheres to the existing code style.
4.  **Test Your Changes:** Run any existing tests and add new tests for your changes.
5.  **Commit:** Write a clear and concise commit message using conventional commits.
    ```bash
    git commit -m "feat: Add new feature"
    ```
6.  **Push:** Push your branch to your fork.
    ```bash
    git push origin <your-github-username>/your-feature-name
    ```
7.  **Open a Pull Request (PR):** Open a PR from your branch to the `main` branch of the original repository. Provide a clear description of your changes.

### Keep Pull Requests Small and Focused

We strongly prefer small, single-purpose PRs. Large PRs delay merges and increase bugs. Break features into increments. Unrelated fixes belong in separate issues/PRs.

Try to break down large features into smaller, incremental changes. Each PR should represent a single, logical unit of work.

Avoid including unrelated changes. If you notice something that needs fixing but is outside the scope of your current work, create a separate [issue](https://github.com/samui-build/samui-wallet/issues/new/choose) or address it in a follow-up PR. This helps keep your PRs focused and easy to review.

## Keeping Your Branch Updated

As you work, the `main` branch may be updated with other changes. It's important to keep your branch up-to-date to avoid merge conflicts and maintain a clean commit history.

**Please use `rebase` instead of `merge` to sync your branch.** Rebasing rewrites your branch's history on top of the latest `main`, creating a linear and easier-to-follow history. Merging `main` into your branch creates messy "merge commits" that clutter the project history.

### Rebasing Workflow

1.  **Fetch the latest changes from `upstream` (the original repository):**
    ```bash
    git fetch upstream
    ```
    *(If you haven't configured an `upstream` remote yet, you can add it with: `git remote add upstream https://github.com/samui-build/samui-wallet.git`)*

2.  **Ensure you are on your feature branch:**
    ```bash
    git checkout <your-github-username>/your-feature-name
    ```

3.  **Rebase your branch on top of `upstream/main`:**
    ```bash
    git rebase upstream/main
    ```

4.  **Resolve any conflicts:** If Git reports any conflicts, open the conflicting files, resolve the issues, and then continue the rebase:
    ```bash
    git add .
    git rebase --continue
    ```

5.  **Force-push the updated branch to your fork:** Since rebasing rewrites history, you'll need to force-push.
    ```bash
    git push --force-with-lease origin <your-github-username>/your-feature-name
    ```

## Progress and priorities

We follow a pragmatic development philosophy summarized by the mantra: "Make it work, make it right, make it fast."

1.  **Make it work:** The first priority is to get a functional implementation. This means building a solution that meets the core requirements, is covered by tests, and is well-coded.
2.  **Make it right:** Once it works, we iterate. This involves refactoring the code to be cleaner, more maintainable, and better structured. We improve upon the initial solution based on feedback and deeper understanding.
3.  **Make it fast:** After the solution is working and well-structured, we address performance. Optimization is a deliberate step, not a premature one. Remember, "you can't optimize what you can't measure."

This iterative approach doesn't mean we accept low-quality code. It means we are mindful of avoiding "rabbit holes" and premature optimization. If we identify a potential improvement that is not critical for the initial implementation, we prefer creating a follow-up issue rather than trying to build the "perfect" solution from the start.

## Feedback and Discussion

Healthy debate is welcome, but the way we communicate matters. To keep our feedback process constructive and focused, please follow these guidelines.

### How to Give Feedback

**Provide actionable suggestions.** Instead of simply stating that you dislike something, propose an alternative. This is more constructive and saves unnecessary back-and-forth.

-   **Instead of:** "I don't like this approach."
-   **Try:** "I see you're using X. I think Y might be a better fit here because of Z. What are your thoughts?"

**Reason from first principles.** Arguments should be based on technical merit and project goals, not just personal preference or habit. An appeal to tradition ("I've always done it this way") is not a compelling argument on its own. Instead, explain *why* an approach is better by tying it back to our principles of clean, maintainable, and pragmatic code.

### Where to Give Feedback

Keep discussions focused on the task at hand. The primary goal of a Pull Request (PR) is to get it merged once it's "good enough."

-   **PR comments are not a forum.** Reviews should focus on improving the code within that specific PR.
-   If a review sparks a thought about an unrelated topic, please move the discussion to a more appropriate venue, such as [**Discord**](http://samui.build/go/discord) or a [**new GitHub issue**](https://github.com/samui-build/samui-wallet/issues/new/choose).
-   Any discussion that isn't a pressing issue or directly improving the quality of the PR should be postponed. This keeps our PRs small, focused, and moving forward.

Ultimately, we ship code, not comments. Let's prioritize actions that help us meet our goals and maintain a healthy ratio of commits to comments.

## A Note on AI-Generated Code

We are supportive of using AI tools to _assist_ your development process (e.g., for boilerplate, optimization suggestions, or debugging).

However, we do not accept "vibe-coded" or purely AI-generated contributions. You must be able to explain, test, and take full ownership of every line of code you submit.

**Pull requests containing code that the author clearly does not understand will be rejected.** You are the developer, not the prompt engineer. All code must be intentional and understood.

## Code of Conduct

This project and everyone participating in it are governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.
