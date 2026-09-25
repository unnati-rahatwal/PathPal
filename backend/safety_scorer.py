"""
safety_scorer.py
----------------
Scores each OSM street edge (0–100) for nighttime pedestrian safety.

Scoring factors:
  - Lighting (lit=yes/no tag)         → up to ±35 pts
  - Highway type                       → up to +20 pts
  - Sidewalk presence                  → up to ±8 pts
  - Surface quality                    → up to ±5 pts
  - Access restrictions                → up to -15 pts
"""

from __future__ import annotations


def _get_tag(data: dict, key: str, default: str = "") -> str:
    """Safely extract a string OSM tag (handles list values from multi-value tags)."""
    val = data.get(key, default)
    if isinstance(val, list):
        val = val[0] if val else default
    return str(val).lower().strip()


def score_edge(edge_data: dict) -> int:
    """
    Return a nighttime safety score (0–100) for an OSM edge.

    Higher = safer at night for pedestrians / late-night commuters.
    """
    score = 40  # neutral baseline

    # ── LIGHTING ────────────────────────────────────────── (up to 35 pts)
    lit = _get_tag(edge_data, "lit")
    if lit in ("yes", "24/7", "automatic", "lit"):
        score += 35
    elif lit in ("sunset-sunrise", "dusk-dawn", "evening"):
        score += 25
    elif lit in ("disused", "no"):
        score -= 20
    # untagged = 0 modifier (we don't know, so no bonus/penalty)

    # ── HIGHWAY TYPE ─────────────────────────────────────── (up to 20 pts)
    highway = _get_tag(edge_data, "highway")
    hw_score = {
        "pedestrian":    20,   # pedestrian-only zone — safest
        "living_street": 16,   # very low-speed shared space
        "primary":       18,   # main arterial — wide, usually lit, active
        "secondary":     16,
        "tertiary":      14,
        "residential":   10,
        "unclassified":   8,
        "service":        5,   # parking lots / access roads — often unlit
        "footway":       12,
        "cycleway":      10,
        "path":           4,   # often rural / dark
        "track":          2,   # unpaved, isolated
        "trunk":          8,   # high-speed, not pedestrian-friendly
        "motorway":       2,   # dangerous for pedestrians
        "motorway_link":  2,
        "trunk_link":     5,
    }.get(highway, 8)
    score += hw_score

    # ── SIDEWALK ─────────────────────────────────────────── (up to 8 pts)
    sidewalk = _get_tag(edge_data, "sidewalk")
    if sidewalk in ("yes", "both"):
        score += 8
    elif sidewalk in ("left", "right"):
        score += 5
    elif sidewalk in ("no", "none"):
        score -= 5

    # ── SURFACE QUALITY ──────────────────────────────────── (up to 5 pts)
    surface = _get_tag(edge_data, "surface")
    if surface in ("asphalt", "paved", "concrete", "paving_stones"):
        score += 5
    elif surface in ("gravel", "dirt", "grass", "sand", "mud"):
        score -= 5

    # ── ACCESS RESTRICTIONS ──────────────────────────────── (up to -15 pts)
    access = _get_tag(edge_data, "access")
    if access in ("private", "no", "customers"):
        score -= 15

    # ── FOOT ACCESS ──────────────────────────────────────── (up to -10 pts)
    foot = _get_tag(edge_data, "foot")
    if foot in ("no", "private"):
        score -= 10
    elif foot in ("yes", "designated", "permissive"):
        score += 5

    return max(0, min(100, score))


def get_lighting_label(score: int) -> str:
    """Human-readable lighting label for a safety score."""
    if score >= 80:
        return "Well-lit (LED/Sodium)"
    elif score >= 60:
        return "Adequately lit"
    elif score >= 40:
        return "Partially lit"
    else:
        return "Poor / No lighting"


def get_isolation_label(pct: int) -> str:
    """Human-readable isolation label."""
    if pct <= 10:
        return f"Low ({pct}%)"
    elif pct <= 30:
        return f"Moderate ({pct}%)"
    else:
        return f"High ({pct}%)"
