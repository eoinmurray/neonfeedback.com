"""exp000 — "How does anarchism typically die".

Self-contained experiment: the dataset, a single bar chart, and the derived
metrics all live here. Running it writes the figure + numbers.json into the
committed run bundle artifacts/data/exp000/, so the prose in writings/exp000.typ
reads its numbers from the run rather than from the author's memory.

    task run -- exp000        # or: uv run python experiments/exp000.py

  deaths.png      -- how each experiment ended, tallied by cause
  numbers.json    -- tallies the Typst writeup inlines
"""
import json
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "artifacts" / "data" / "exp000"

# label, start year, end year (None = ongoing), peak scale (people), duration (years), death type
# death: crushed (enemy state/army) | betrayed (the authoritarian left) | collapsed (from within) | alive
DATA = [
    ("Paris",         1871, 1871, 2.0e6, 0.197, "crushed"),
    ("Alcoy",         1873, 1873, 1.0e4, 0.014, "crushed"),
    ("Strandzha",     1903, 1903, 3.0e4, 0.055, "crushed"),
    ("Magonista",     1911, 1911, 3.0e3, 0.5,   "crushed"),
    ("Makhno",        1918, 1921, 7.0e6, 3,     "betrayed"),
    ("Bavaria",       1919, 1919, 5.0e5, 0.074, "crushed"),
    ("Biennio R.",    1919, 1920, 6.0e5, 2,     "collapsed"),
    ("Kronstadt",     1921, 1921, 1.8e4, 0.044, "betrayed"),
    ("Korea (KPAM)",  1929, 1931, 2.0e6, 2,     "crushed"),
    ("Alt Llobregat", 1932, 1932, 3.0e3, 0.016, "crushed"),
    ("Catalonia",     1936, 1939, 6.5e6, 3,     "betrayed"),
    ("Hungary '56",   1956, 1956, 2.0e6, 0.25,  "crushed"),
    ("Christiania",   1971, None, 1.0e3, 55,    "alive"),
    ("Exarcheia",     1973, None, 5.0e3, 50,    "alive"),
    ("Marinaleda",    1979, None, 2.7e3, 47,    "alive"),
    ("Zapatistas",    1994, None, 3.0e5, 32,    "alive"),
    ("Argentina",     2001, None, 1.6e4, 25,    "alive"),
    ("Oaxaca",        2006, 2006, 2.0e5, 0.5,   "crushed"),
    ("Cherán",        2011, None, 1.6e4, 15,    "alive"),
    ("Rojava",        2012, None, 3.0e6, 14,    "alive"),
    ("Bakur",         2015, 2016, 4.0e5, 0.7,   "crushed"),
    ("CHAZ",          2020, 2020, 3.0e3, 0.066, "collapsed"),
    ("Iceland",        930, 1262, 5.0e4, 332,   "collapsed"),  # medieval outlier
]

INK = "#1a1a1a"

# Bars top→bottom: the three ways it ended, then the survivors. "Killed" causes
# (crushed + betrayed) are solid ink; collapse-from-within is mid grey; the
# still-alive bar is drawn open, echoing nothing-filled-in — it isn't a death.
BARS = [
    ("crushed",   "Crushed by a state",     dict(color=INK)),
    ("betrayed",  "Betrayed by the left",   dict(color=INK)),
    ("collapsed", "Collapsed from within",  dict(color="#8a8a8a")),
    ("alive",     "Still alive (ongoing)",  dict(color="white", edgecolor=INK, linewidth=1.6)),
]

FIGSIZE = (11, 5.2)
DPI = 200

plt.rcParams.update({
    "font.family": "serif",
    "font.serif": ["Georgia", "Times New Roman", "DejaVu Serif"],
    "font.size": 14,
    "axes.labelsize": 16,
    "xtick.labelsize": 13,
    "ytick.labelsize": 15,
    "text.color": INK,
    "axes.edgecolor": "#9a9a9a",
    "axes.labelcolor": INK,
    "xtick.color": INK,
    "ytick.color": INK,
    "figure.facecolor": "white",
    "savefig.facecolor": "white",
})


def plot_deaths():
    counts = {d: sum(1 for row in DATA if row[5] == d) for d, _, _ in BARS}
    fig, ax = plt.subplots(figsize=FIGSIZE, layout="constrained")
    ys = range(len(BARS))
    for y, (key, label, style) in zip(ys, BARS):
        n = counts[key]
        ax.barh(y, n, height=0.62, zorder=3, **style)
        ax.text(n + 0.15, y, str(n), va="center", ha="left", fontsize=14, color=INK)
    ax.set_yticks(list(ys))
    ax.set_yticklabels([b[1] for b in BARS])
    ax.invert_yaxis()  # first bar (crushed) on top
    ax.set_xlim(0, max(counts.values()) + 1.2)
    ax.set_xlabel("number of experiments", style="italic")
    killed = counts["crushed"] + counts["betrayed"]
    ax.annotate(
        f"killed, not collapsed: {killed} of {sum(counts.values())}",
        xy=(0, -0.75), xytext=(0, -0.75), fontsize=11, style="italic",
        color=INK, alpha=0.6, annotation_clip=False,
    )
    for s in ("top", "right", "left"):
        ax.spines[s].set_visible(False)
    ax.tick_params(left=False)
    ax.grid(axis="x", color="#9a9a9a", alpha=0.22)
    ax.set_axisbelow(True)
    fig.savefig(OUT / "deaths.png", dpi=DPI)
    plt.close(fig)
    print(f"wrote {OUT / 'deaths.png'}")


def compute_metrics():
    """Tally the dataset so the post's numbers come from the run, not the prose."""
    ended = [d for d in DATA if d[5] != "alive"]
    alive = [d for d in DATA if d[5] == "alive"]
    deaths = [d[5] for d in ended]
    largest = max(DATA, key=lambda d: d[3])
    longest = max(DATA, key=lambda d: d[4])
    n_crushed = deaths.count("crushed")
    n_betrayed = deaths.count("betrayed")
    n_collapsed = deaths.count("collapsed")
    return {
        "n_experiments": len(DATA),
        "n_ongoing": len(alive),
        "n_ended": len(ended),
        "n_crushed": n_crushed,
        "n_betrayed": n_betrayed,
        "n_collapsed": n_collapsed,
        "n_killed": n_crushed + n_betrayed,
        "largest_scale_people": int(largest[3]),
        "largest_name": largest[0],
        "longest_years": int(longest[4]),
        "longest_name": longest[0],
    }


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    plot_deaths()
    numbers = compute_metrics()
    (OUT / "numbers.json").write_text(json.dumps(numbers, indent=2) + "\n")
    print(f"wrote {OUT / 'numbers.json'}")
    print(f"  {numbers['n_ended']} ended: {numbers['n_crushed']} crushed, "
          f"{numbers['n_betrayed']} betrayed, {numbers['n_collapsed']} collapsed")


if __name__ == "__main__":
    main()
