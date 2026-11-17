#!/usr/bin/env python3
"""
Rule of Three (Listing x3) Script Generator Module for Claude Code.
Automates NLP/Trance script construction from modular JSON input payloads.
"""

import json
from typing import Dict, Any, List

class RuleOfThreeGenerator:
    """Builder class for assembling Dreier-Rhythmus sentences."""

    @staticmethod
    def build_pace_pace_lead(pace_1: str, pace_2: str, lead: str) -> str:
        return f"{pace_1.strip()}, {pace_2.strip()}, and {lead.strip()}."

    @staticmethod
    def build_vakog_triad(visual: str, auditory: str, kinesthetic: str) -> str:
        return f"You can {visual.strip()}, {auditory.strip()}, and {kinesthetic.strip()}."

    @staticmethod
    def build_progressive_listing(effort: str, waiting: str, automatic: str) -> str:
        return (
            f"Isn't it interesting how sometimes you {effort.strip()}, "
            f"other times you {waiting.strip()}, "
            f"and then suddenly {automatic.strip()}?"
        )

    @staticmethod
    def build_triad_chain(subject: str, verb: str, items: List[str]) -> str:
        if len(items) != 3:
            raise ValueError("Triad chain requires exactly 3 items.")
        return f"{subject.strip()} {verb.strip()} {items[0].strip()}, {items[1].strip()}, and {items[2].strip()}."

    @staticmethod
    def build_parts_synthesis(part_a: str, part_b: str, synthesis: str) -> str:
        return (
            f"Part of your mind might {part_a.strip()}, "
            f"while another part {part_b.strip()}, "
            f"and both parts are {synthesis.strip()}."
        )

    @classmethod
    def assemble(cls, data: Dict[str, Any]) -> str:
        p1 = cls.build_pace_pace_lead(**data["pace_pace_lead"])
        p2 = cls.build_vakog_triad(**data["vakog_triad"])
        p3 = cls.build_progressive_listing(**data["progressive_listing"])
        p4 = cls.build_triad_chain(
            data["triad_items"]["subject"],
            data["triad_items"]["verb"],
            data["triad_items"]["items"]
        )
        p5 = cls.build_parts_synthesis(**data["parts_synthesis"])
        
        return f"{p1}\n\n{p2}\n\n{p3}\n\n{p4}\n\n{p5}"

if __name__ == "__main__":
    sample_payload = {
        "pace_pace_lead": {
            "pace_1": "You are sitting here right now",
            "pace_2": "listening to the sound of my voice",
            "lead": "you can begin to notice how easily your breathing settles into a natural rhythm"
        },
        "vakog_triad": {
            "visual": "notice the quiet space behind your eyes",
            "auditory": "hear the calm cadence of my voice",
            "kinesthetic": "feel a soothing warmth moving down through your chest and shoulders"
        },
        "progressive_listing": {
            "effort": "try to relax and it feels like effort",
            "waiting": "just wait and let time pass",
            "automatic": "there comes a moment where a deep, quiet calm simply takes over"
        },
        "triad_items": {
            "subject": "Your brain",
            "verb": "feels",
            "items": ["refreshed", "cool", "completely silent"]
        },
        "parts_synthesis": {
            "part_a": "stay slightly aware for a moment",
            "part_b": "already knows it is safe to drop deep into peace",
            "synthesis": "completely fine and in total harmony"
        }
    }

    gen = RuleOfThreeGenerator()
    script = gen.assemble(sample_payload)
    print("=== ASSEMBLED SCRIPT ===")
    print(script)
