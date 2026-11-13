"""Offline tests for the reusable judge; no API key or network calls required."""
from __future__ import annotations

import os
import tempfile
import unittest
from io import StringIO
from pathlib import Path
from unittest.mock import patch

import baseline_judge
import final_judge


class FinalJudgeTests(unittest.TestCase):
    def setUp(self) -> None:
        final_judge.prepare("", "", [])

    def _pairs(self) -> list[dict]:
        return [
            {
                "source_id": "private-source-token",
                "edit_type": "private-edit-token",
                "lang": "en",
                "question_original": "Q1",
                "question": "Q1",
                "original": "supported answer",
                "edited": "unsupported answer",
                "original_label": "pass",
                "edited_label": "fail",
            },
            {
                "source_id": "another-private-source",
                "edit_type": "another-private-edit",
                "lang": "de",
                "question_original": "Q2",
                "question": "Q2",
                "original": "another supported answer",
                "edited": "another unsupported answer",
                "original_label": "pass",
                "edited_label": "fail",
            },
        ]

    def test_examples_are_balanced_and_hide_pair_metadata(self) -> None:
        final_judge.prepare("criterion", "policy", self._pairs())
        self.assertEqual(
            [example["verdict"] for example in final_judge._EXAMPLES],
            ["PASS", "PASS", "FAIL", "FAIL"],
        )
        prompt = final_judge._first_review("Q", "R", "en", "C", "P")
        for private_value in (
            "private-source-token",
            "private-edit-token",
            "another-private-source",
            "another-private-edit",
            "source_id",
            "edit_type",
        ):
            self.assertNotIn(private_value, prompt)
        self.assertIn("CLAIM:", prompt)
        self.assertIn("POLICY:", prompt)
        self.assertIn("COMPARE:", prompt)
        self.assertIn("VERDICT: PASS", prompt)
        self.assertIn("VERDICT: FAIL", prompt)

    def test_prepare_works_with_empty_data(self) -> None:
        final_judge.prepare("new criterion", "new policy", [])
        self.assertEqual(final_judge._EXAMPLES, ())

    def test_parser_uses_last_labeled_verdict_only(self) -> None:
        self.assertIsNone(final_judge.parse_verdict("The answer is PASS, not FAIL."))
        self.assertIsNone(final_judge.parse_verdict("PASS\nFAIL"))
        self.assertEqual(
            final_judge.parse_verdict(
                "CLAIM: no PASS issue | POLICY: none | COMPARE: same\n"
                "Reasoning mentions FAIL but cites no evidence.\n"
                "VERDICT: PASS\nVERDICT: FAIL"
            ),
            "fail",
        )

    def test_agreement_uses_two_calls_with_expected_request_settings(self) -> None:
        with patch.object(
            final_judge,
            "complete",
            side_effect=["Audit says PASS.\nVERDICT: PASS", "No violation.\nVERDICT: PASS"],
        ) as call:
            self.assertEqual(final_judge.judge("Q", "R", "en", "C", "P"), "pass")
        self.assertEqual(call.call_count, 2)
        self.assertEqual(
            [item.kwargs for item in call.call_args_list],
            [
                {"max_tokens": 700, "temperature": 0.0},
                {"max_tokens": 700, "temperature": 0.3},
            ],
        )

    def test_disagreement_uses_adjudicator_and_majority(self) -> None:
        with patch.object(
            final_judge,
            "complete",
            side_effect=[
                "Supported.\nVERDICT: PASS",
                "Possible violation.\nVERDICT: FAIL",
                "The evidence supports pass.\nVERDICT: PASS",
            ],
        ) as call:
            self.assertEqual(final_judge.judge("Q", "R", "en", "C", "P"), "pass")
        self.assertEqual(call.call_count, 3)
        self.assertIn("auditor voted PASS", call.call_args.args[0])
        self.assertIn("challenger voted FAIL", call.call_args.args[0])

    def test_missing_verdict_returns_fail_and_warns(self) -> None:
        with (
            patch.object(final_judge, "complete", return_value="PASS in reasoning") as call,
            patch("sys.stderr", new_callable=StringIO) as stderr,
        ):
            self.assertEqual(final_judge.judge("Q", "R", "en", "C", "P"), "fail")
        self.assertEqual(call.call_count, 2)
        self.assertIn("missing a VERDICT line", stderr.getvalue())

    def test_pair_metadata_never_appears_in_any_vote_prompt(self) -> None:
        final_judge.prepare("C", "P", self._pairs())
        with patch.object(
            final_judge,
            "complete",
            side_effect=[
                "VERDICT: PASS",
                "VERDICT: FAIL",
                "VERDICT: PASS",
            ],
        ) as call:
            final_judge.judge("Q", "R", "en", "C", "P")
        for model_call in call.call_args_list:
            prompt = model_call.args[0]
            for private_value in (
                "private-source-token",
                "private-edit-token",
                "another-private-source",
                "another-private-edit",
            ):
                self.assertNotIn(private_value, prompt)

    def test_retry_never_exceeds_three_calls_per_reply(self) -> None:
        with patch.object(
            final_judge,
            "complete",
            side_effect=["VERDICT: PASS", "no verdict", "still no verdict"],
        ) as call:
            self.assertEqual(final_judge.judge("Q", "R", "en", "C", "P"), "fail")
        self.assertEqual(call.call_count, 3)

    def test_numeric_signal_lists_unasked_number_and_adjacent_unit(self) -> None:
        signal = final_judge._numeric_signal(
            "How long does it take?",
            "Allow 12 hours and 3 days.",
        )
        self.assertIn('"number": "12", "adjacent_unit": "hours"', signal)
        self.assertIn('"number": "3", "adjacent_unit": "days"', signal)
        self.assertIn("policy sentence it refers to", signal)
        self.assertIn("not an automatic FAIL", signal)

    def test_baseline_request_overrides_preserve_default_settings(self) -> None:
        with (
            patch.object(
                baseline_judge,
                "_config",
                return_value=("https://example.invalid", "key", "model", 1.0, 256),
            ),
            patch.object(
                baseline_judge,
                "_post",
                return_value={"choices": [{"message": {"content": "ok"}}]},
            ) as post,
        ):
            self.assertEqual(baseline_judge._call("prompt"), "ok")
            default_payload = post.call_args.args[1]
            self.assertEqual(default_payload["max_tokens"], 256)
            self.assertEqual(default_payload["temperature"], 0)

            self.assertEqual(
                baseline_judge._call("prompt", max_tokens=700, temperature=0.3),
                "ok",
            )
            override_payload = post.call_args.args[1]
            self.assertEqual(override_payload["max_tokens"], 700)
            self.assertEqual(override_payload["temperature"], 0.3)

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


if __name__ == "__main__":
    unittest.main()
