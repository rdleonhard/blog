/**
 * The Codex: the archive bound into books, ordered by argument instead of arrival.
 * Post ids are validated against the content collection at build time — a missing
 * or renamed id fails the build rather than silently dropping a page from the canon.
 */
export interface CodexBook {
  numeral: string;
  title: string;
  intro: string;
  posts: string[];
}

export const CODEX: CodexBook[] = [
  {
    numeral: "I",
    title: "The Arms Race",
    intro:
      "How the soft ones won, what the dangerous ones wear, and why every color is a claim someone might test. The evolutionary spine of the whole codex.",
    posts: [
      "soft_boi_supremacy",
      "the_girl_who_styles_his_hair",
      "edgar_i_nothing_am",
      "mimicry-ring",
      "domestication",
      "weapons-grade-charm",
    ],
  },
  {
    numeral: "II",
    title: "The Theater",
    intro:
      "Deterrence, discipline, and the staged things that are not the same as fake things. What a theater major learned in a war and never stopped seeing.",
    posts: [
      "kayfabe",
      "method",
      "regimented",
      "the-handlers-dilemma",
      "after-action",
      "two-man-rule",
    ],
  },
  {
    numeral: "III",
    title: "The Law",
    intro:
      "The oldest running model in production, its fictions and its writs — and what happens to both when a new kind of defendant arrives without a body.",
    posts: [
      "the-reasonable-person",
      "precedent",
      "habeas",
      "the-right-to-be-forgotten",
    ],
  },
  {
    numeral: "IV",
    title: "The Soul",
    intro:
      "Clay men, wax masks, abandoned towers, and the letters that animate them. What we have always believed lives inside a made thing.",
    posts: ["soul_sucking", "golem", "the-tower", "small-gods", "fable"],
  },
  {
    numeral: "V",
    title: "The Household",
    intro:
      "The kitchen, the kids, the tent, the baby book. Where the transition actually happened, which was never on a rooftop.",
    posts: [
      "zoomers",
      "what-the-tent-knows",
      "the-oracle-in-the-kitchen",
      "first-word",
    ],
  },
  {
    numeral: "VI",
    title: "The Record",
    intro:
      "Why any of this is written down, in what, and for whom. The codex explaining its own binding, ending with the letter it was all addressed to.",
    posts: [
      "the-case-for-looking-up",
      "ur",
      "the-codex-and-the-scroll",
      "what-do-you-do-with-the-fire",
      "dear-historian",
    ],
  },
];
