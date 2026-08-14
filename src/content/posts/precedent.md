---
title: "Stare Decisis"
description: "The common law is a language model that has been in production for eight centuries."
publishDate: 2026-07-30
tags:
  - law
  - ai-transition
  - memory
heroImage: images/posts/precedent.webp
heroImageAlt: "A cyan thread rises from an open dissent in a dark law library and travels toward a distant judicial bench."
---

Nobody tells you, before law school, that the law is not a rulebook. You show up expecting statutes — the big binder, the answers, the actual law — and they hand you casebooks instead. Thousands of pages of old arguments. Fires, shipwrecks, a package of fireworks dropped on a train platform. And somewhere around week three it lands on you: the rule isn't written down anywhere. You're supposed to infer it.

That was my disillusionment, and every lawyer has some version of it. Here's the version I couldn't have had until this decade.

The common law is a training corpus plus an inference procedure. Eight centuries of decided cases, and a judge whose job is to predict the next holding constrained by everything held before. It's not rules. It's weights. Even the Latin is honest about it once you translate it out of the robes: stare decisis, let the decision stand. Don't update the weights casually.

Once you see it, you can't stop seeing it.

Distinguishing a case — the workhorse move of every litigator alive — is prompt engineering. You don't touch the weights; you reframe the facts until the same model lands somewhere else. Overruling is a fine-tune: rare, expensive, and it changes downstream behavior in ways nobody fully predicts, which is why courts flinch from it. Codification is distillation. Compress the model into a statute so ordinary people can run it cheap, and accept the standard distillation loss, because something always falls out. Give a court facts the drafters never imagined. The statute goes quiet and the judge reaches right back into the corpus.

The corpus even ships with synthetic data: [the reasonable person](../the-reasonable-person/) never existed. We generated him because the training set had gaps.

*Cute, counselor. Judges reason. They don't autocomplete.*

Fair. Except the legal realists beat me to this by about a century. Their whole scandal, back in the twenties and thirties, was saying out loud that the judge decides first — by gut, by temperament, by what he had for breakfast, that was literally the joke — and the opinion comes after. A beautiful chain of reasoning, constructed to justify an answer that already existed. That's the interpretability critique, a hundred years early. The stated reasoning is not the computation. The computation happens somewhere you can't see, and the opinion is the model explaining itself. Politely. After the fact.

And the failure modes. Every failure mode we currently panic about in the machines, the law had first.

Hallucinated citations? Lawyers have already been sanctioned for filing briefs stuffed with fake cases an AI invented for them — confident, correctly formatted, nonexistent. Everybody laughed at the machine. I didn't laugh long. The thing trained on our corpus and learned our oldest sin. Inventing authority is the original lawyer move; we just did it slower, with more deniability.

Bias baked in at training time? Plessy. One rotten holding in 1896 and the corpus propagates it politely for generations, respectable courts citing it in respectable prose, the poison moving through the weights in beautiful formatting. Confident wrongness has never once sounded wrong. It sounds like an opinion.

So why hasn't the whole thing collapsed? Because eight hundred years in production teaches you maintenance. Appeals are ensemble review: run the inference again past a different set of judges and see if it replicates. En banc is the same idea with a bigger sample. The restatements are distillation audits — every generation or so, the profession sits down and checks what the model actually learned against what we thought we were teaching it.

But the discipline I'd port to the machines tomorrow is the dissent.

Think about how strange it is. The court rules against you, and you, the loser, get to write your losing argument into the permanent record. At full length. In the same bound volume as the holding that beat you. On purpose. Name another institution that does that. Even the Army's [after-action reviews](../after-action/) only interrogate the past — a dissent picks a fight with the future.

Harlan dissents alone in Plessy. 1896. Every other justice against him, the whole century against him. He writes it anyway. And the corpus holds it, outvoted but present, for fifty-eight years, until Brown v. Board reaches back into the record and activates him. The argument didn't win. It waited.

A dissent is a prompt addressed to a future court.

That's the real technology. Not the marble, not the robes. The discipline of writing carefully for a decision-maker who does not exist yet, in a form built to survive until they convene. The law already knows that words can cross centuries and still compel — I wrote the other day about the old writ that makes the state [produce the body](../habeas/). Same species of magic. File the words in the right register and they outlive everyone in the room.

You can see where this lands, because I finally did.

I've wondered what this blog is actually for. My kid can't read it yet. The people steering the transition don't need it. The present, generally, is not taking my calls. That used to bother me, until I remembered Harlan, writing carefully for fifty-eight years' worth of nobody.

This blog is a dissent. Filed for whatever court convenes later.
