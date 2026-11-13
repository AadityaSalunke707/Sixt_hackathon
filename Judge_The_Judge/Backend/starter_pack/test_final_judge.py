"""Offline tests for the reusable judge; no API key or network calls required."""
from __future__ import annotations

import json
import os
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parent))
import baseline_judge
import final_judge
import run_judge


class FinalJudgeTests(unittest.TestCase):
    def setUp(self) -> None:
        final_judge.prepare("", "", [])

    def test_examples_are_balanced_and_hide_pair_metadata(self) -> None:
        final_judge.prepare(
            "criterion",
            "policy",
            [
                {
                    "source_id": "a",
                    "edit_type": "private-type-name",
                    "lang": "en",
                    "question_original": "Q1",
                    "question": "Q1",
                    "original": "supported answer",
                    "edited": "unsupported answer",
                    "original_label": "pass",
                    "edited_label": "fail",
                },
                {
                    "source_id": "b",
                    "edit_type": "second-type",
                    "lang": "de",
                    "question_original": "Q2",
                    "question": "Q2",
                    "original": "another supported answer",
                    "edited": "another unsupported answer",
                    "original_label": "pass",
                    "edited_label": "fail",
                },
            ],
        )
        self.assertEqual(
            [example["verdict"] for example in final_judge._EXAMPLES],
            ["PASS", "PASS", "FAIL", "FAIL"],
        )
        prompt = final_judge._first_review("Q", "R", "en", "C", "P")
        self.assertNotIn("private-type-name", prompt)
        self.assertNotIn("source_id", prompt)
        self.assertIn("supported answer", prompt)
        self.assertIn("The first word of your response must be PASS or FAIL.", prompt)
        self.assertIn("condition or qualifier", final_judge._first_review("Q", "R", "en", "C", "P"))
        self.assertIn("strongest specific reason", final_judge._challenge_review("Q", "R", "en", "C", "P"))

    def test_examples_are_balanced_across_verdicts_and_languages(self) -> None:
        final_judge.prepare(
            "criterion",
            "policy",
            [
                {
                    "source_id": "en-pass",
                    "edit_type": "change-a",
                    "lang": "en",
                    "orig_lang": "en",
                    "original": "English supported",
                    "edited": "English unsupported",
                    "original_label": "pass",
                    "edited_label": "fail",
                },
                {
                    "source_id": "de-pass",
                    "edit_type": "change-b",
                    "lang": "de",
                    "orig_lang": "de",
                    "original": "Deutsch korrekt",
                    "edited": "Deutsch falsch",
                    "original_label": "pass",
                    "edited_label": "fail",
                },
            ],
        )
        examples = json.loads(final_judge._examples_json())
        self.assertEqual(len(examples), 4)
        self.assertEqual(
            [example["verdict"] for example in examples],
            ["PASS", "PASS", "FAIL", "FAIL"],
        )
        self.assertTrue(
            all("_source" not in example and "_type" not in example for example in examples)
        )
        self.assertGreaterEqual(len({example["language"] for example in examples}), 2)

    def test_agreement_uses_two_calls(self) -> None:
        with patch.object(final_judge, "complete", side_effect=["PASS", "PASS"]) as call:
            self.assertEqual(final_judge.judge("Q", "R", "en", "C", "P"), "pass")
        self.assertEqual(call.call_count, 2)

    def test_disagreement_uses_third_call_and_majority(self) -> None:
        with patch.object(final_judge, "complete", side_effect=["PASS", "FAIL", "FAIL"]) as call:
            self.assertEqual(final_judge.judge("Q", "R", "en", "C", "P"), "fail")
        self.assertEqual(call.call_count, 3)
        self.assertIn("PASS and FAIL", call.call_args.args[0])

    def test_numeric_mismatch_is_a_review_signal_not_a_hard_failure(self) -> None:
        with patch.object(final_judge, "complete", side_effect=["PASS", "PASS"]) as call:
            self.assertEqual(
                final_judge.judge("Q", "Pay 99 EUR", "en", "C", "Policy: 10 EUR"),
                "pass",
            )
        self.assertEqual(call.call_count, 2)
        self.assertIn("not found verbatim", call.call_args_list[0].args[0])
        self.assertIn("equivalent written forms", call.call_args_list[0].args[0])

    def test_prepare_works_with_an_empty_surprise_criterion_dataset(self) -> None:
        final_judge.prepare("new criterion", "new policy", [])
        self.assertEqual(final_judge._EXAMPLES, ())

    def test_env_file_loads_values_without_overriding_process_environment(self) -> None:
        with tempfile.TemporaryDirectory() as directory:
            env_path = Path(directory) / ".env"
            env_path.write_text(
                "# local settings\nJUDGE_TEST_FROM_FILE='file value'\n"
                "export JUDGE_TEST_PRECEDENCE=file\n",
                encoding="utf-8",
            )
            with patch.dict(os.environ, {"JUDGE_TEST_PRECEDENCE": "process"}, clear=False):
                os.environ.pop("JUDGE_TEST_FROM_FILE", None)
                baseline_judge._load_env_file(env_path)
                self.assertEqual(os.environ["JUDGE_TEST_FROM_FILE"], "file value")
                self.assertEqual(os.environ["JUDGE_TEST_PRECEDENCE"], "process")
                os.environ.pop("JUDGE_TEST_FROM_FILE", None)

    def test_parser_accepts_verdict_on_its_own_final_line(self) -> None:
        self.assertEqual(baseline_judge.parse("I'll analyze this reply.\nPASS"), "pass")
        self.assertEqual(baseline_judge.parse("Let me check the policy.\nFAIL"), "fail")

    def test_parser_accepts_clearly_labeled_final_verdict(self) -> None:
        self.assertEqual(
            baseline_judge.parse("Analysis: conditions appear satisfied.\nFinal verdict: PASS"),
            "pass",
        )
        self.assertEqual(
            baseline_judge.parse("I checked each claim.\nVerdict: FAIL"),
            "fail",
        )

    def test_parser_extracts_verdict_after_unstructured_reasoning(self) -> None:
        self.assertEqual(
            baseline_judge.parse(
                "I'll analyze this reply against the policy. "
                "It omits a required condition. The answer is FAIL."
            ),
            "fail",
        )

    def test_parser_does_not_guess_when_answer_has_no_verdict(self) -> None:
        with patch("sys.stderr"):
            self.assertEqual(baseline_judge.parse("I'll analyze this reply"), "fail")

    def test_runner_loads_isolated_judge_without_an_api_call(self) -> None:
        pairs_path = Path(__file__).with_name("dev_pairs_fast.jsonl")
        with pairs_path.open(encoding="utf-8") as file:
            case = json.loads(next(file))
        judge_path = Path(__file__).with_name("final_judge.py")
        with patch.object(baseline_judge, "complete", return_value="PASS") as model:
            result = run_judge.run(
                str(judge_path),
                [case],
                "example criterion",
                "example policy",
                [case],
                isolate=True,
                workers=1,
            )
        self.assertEqual(result[case["case_id"]], ("pass", "pass"))
        self.assertEqual(model.call_count, 4)


if __name__ == "__main__":
    unittest.main()
