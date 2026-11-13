# Our recipe for building an LLM judge

This is the reusable procedure implemented by `final_judge.py`. Apply the same
procedure to both criteria; only the criterion, policy, and labeled dev examples
are inputs.

## Step 1. Diagnose
The included baseline report shows its largest failure is `condition_removal`
(0.067 catch), followed by weak `hedge_removal` catch (0.500). Harmless
sentence reordering is also a risk (0.733 keep). Baseline full-dev results:
combined 0.697, macro catch 0.592, macro keep 0.847.

On our 226-case full dev run, the remaining largest weakness is still
`condition_removal` (0.367 catch; 19 of 30 cases were diagnosed as wrong),
followed by `hedge_removal` (0.700 catch). Harmless `sentence_reorder` keep is
0.700 and translation keep is 0.750. These categories need more work; the
overall score does not mean every important edit is reliably detected.

Check the full report and `diagnose.py` output before tuning; group validation
by `source_id` because the same source replies recur across edits/languages.

## Step 2. Split: rules vs. LLM
The code compares digit strings in the reply and policy to flag possible numeric
discrepancies. This is only a review signal: equivalent units, spelled-out
numbers, and irrelevant numbers make a deterministic fail unsafe. The LLM
checks semantic equivalence, conditions, scope, certainty, and whatever the
criterion requires.

Never turn a lexical mismatch into an automatic failure without evidence that
the rule is safe across all labels, languages, and criteria.

## Step 3. Improve the LLM part
`prepare()` collects labeled single-reply examples from the supplied dev data.
For each reply, the prompt selects up to two PASS and two FAIL examples,
preferring the reply's language and diversifying source and edit type without
exposing pair metadata to the judge. Two independently framed, balanced prompts
map claimed benefits to their full policy rule and explicitly check whether its
qualifications, prerequisites, scope and exceptions are preserved. A FAIL
requires identifying the claim and the specific policy limit it overstates;
translation, reordering and less-generous wording are explicitly treated as
non-violations on their own. The second review independently checks both
false-negative and false-positive risks rather than searching only for reasons
to fail. A third call is used only when the first two verdicts disagree. The
model remains the required `claude-haiku-4.5`.

This keeps the maximum at three calls per reply and avoids hard-coding either
criterion. Run on the fast dev subset first, then inspect full dev results and
per-language/per-edit-type metrics before deciding whether to change the recipe.

## Step 4. Verify
Before and after, on the full dev set and per language.

| | combined | catch | keep |
|---|---|---|---|
| Baseline (included report) | 0.697 | 0.592 | 0.847 |
| Ours (previous prompt, 226-case dev) | 0.747 | 0.692 | 0.810 |

The scorer reports a +0.050 combined-score change versus baseline. Catch rose
by 0.101 and keep fell by 0.037. Kappa was 0.540 versus baseline 0.531.
These results were measured with the configured model and the labeled dev set;
the dev set was also used to choose examples and prompts, so this is not an
independent estimate of unseen performance. The run judged 235 distinct replies
to produce verdicts for the 226 cases. The policy-qualification prompt was
refined afterward; its score has not yet been measured, so 0.747 must not be
reported as the result for the latest code.

## Surprise criterion
What did you change for the new criterion? (Only inputs may change: the criterion text and the examples.)

| | combined | catch | keep |
|---|---|---|---|
| Baseline | not supplied for surprise criterion | — | — |
| Ours, recipe unchanged | pending surprise inputs and API run | — | — |

Use the new criterion and its labeled examples as inputs only. Do not edit the
judge, prompt logic, or selection rules for the surprise run.

## What did not work

The first prompt/parser version generated responses the parser could not read;
those verdicts were counted as failures and produced an unusable score. The
prompt and parser were updated, then the full dev run completed with no
unparseable-answer warnings.

The improved recipe still misses many condition removals and sometimes flags
harmless reordering or translation. The dev examples are few and repeated
across languages, so improvements on this set may not transfer to unseen cases.
Run the unchanged recipe on the surprise criterion and hidden cases before
claiming generalization.
