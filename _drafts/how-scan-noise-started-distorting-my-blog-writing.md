---
title: "How Scan Noise Started Distorting My Blog Writing"
author: "Kristof Riebbels"
tags: writing llm blog tooling process
---

I have been writing again after a long gap, and that already changed the way I look at my own blog.

The last few posts were not only about .NET, GitOps, homelabs, and secret management. They also forced me to look at how I write when I am no longer writing alone. There is me, there are my notes, there is the transcript after I read the post aloud, and then there is a whole layer of tools that helps me tighten, check, compare, and sometimes over-correct the text.

That is where this post comes from.

## Previously On

The Infisical series pushed me into something I had not really paid enough attention to before: the writing loop itself.

I was not only writing a technical post anymore. I was writing, scanning, reading aloud, correcting, comparing versions, fixing the site around it, and then doing that all over again. At some point the text itself stopped being the only thing under review. The whole frame around it started affecting the result too.

## Where It Started Going Wrong

At first the problem looked simple enough. I had a technical post, I ran it through GPTZero, and the score came back high. Fine. That happens. So I started iterating.

That is where it slowly went off the rails.

I was fixing real sentences, but I was also adding structure around the post: footnotes, sources, authoring notes, diagrams, product references, disclosure around tooling, and all the rest. For a real reader that can be useful. For a detector it also means more non-prose, more visible scaffolding, and more signs that the text was shaped in several passes.

So the article itself would get better, but the scan would sometimes get worse.

That was the weird part.

## What I Mean By Scan Noise

By scan noise I mean everything around the actual writing that starts polluting the result.

Not because it is wrong. Not because it should not exist. Just because it is no longer the main prose.

A detector does not read a post the way a person does. It does not think, "this is a footnote", "this is a source block", "this is a Mermaid label", or "this is a small disclosure that belongs at the bottom". It just sees more structured text.

So when I looked at the worse scans, the top offenders were often not the lines that mattered most to the article. They were things like:

- neat section headings
- tool disclosures
- source descriptions
- diagram labels
- lines that explained how the post was written

In other words, a lot of the noise was not the story. It was the packaging around the story.

## The First Trap

The first trap was thinking that every bad scan meant the body text itself was still wrong.

That is not always true.

Sometimes the prose really is too neat. I have seen that in my own drafts more than once. A sentence lands too cleanly, a section ends too tidily, or the whole thing starts sounding like a composed essay instead of lived work. That part is real.

But another part is simpler: once you mix the main text with footnotes, source notes, images, Mermaid blocks, authoring disclosures, and tool descriptions, you are no longer scanning only the article. You are scanning the article and the whole editorial frame around it.

That changes what you fix.

If I confuse those two, I start rewriting good paragraphs for the wrong reason.

## The Second Trap

The second trap was smoother writing.

The cleaner the rewrite became, the easier it was to lose my own rhythm. I would get shorter transitions, neater framing, and more balanced sections. On paper that looked like improvement. In reality it often meant the post was drifting away from how I actually explain things.

That showed up in little ways.

I would get sentences like:

- "That is where it started making sense."
- "This was not just a cleanup."
- "The important part was..."

None of those are catastrophic on their own. The problem is what happens when they pile up. Then the post starts sounding trained instead of written.

That is where reading aloud became much more useful than another rewrite pass.

## Reading It Out Loud Helped More Than Another Rewrite

When I read the post aloud, the fake-good sentences stood out almost immediately.

Not because they were grammatically wrong. They were usually perfectly fine English. The problem was that they did not sound like something I would naturally say while explaining the thing to someone else.

That mattered more to me than the detector score.

If a sentence sounded like an essay hinge, I cut it or rewrote it. If it sounded like a neat little landing paragraph with no real payload, I cut it. If it sounded like a line that only existed to make the article feel well-shaped, I cut that too.

That is also where speech-to-text helped more than I expected. Once I read the article out loud and fed the transcript back into the draft, I could see where I was interrupting myself, where I was correcting the sentence while speaking, and where the written version was pretending to be clearer than it really was.

That feedback was much more honest than another smooth rewrite.

## What I Started Keeping

The strongest parts were usually the least glamorous ones.

The stale secret that was still sitting on one machine after a rotation. The webhook experiment that the LLMs kept tripping over. The move away from Portainer because the agent kept assuming plain Docker Compose. The moment where dumping everything into a vault turned out to be only the first migration step, not the actual design.

Those details helped the post more than polished explanations ever did.

They also did something else: they anchored the piece in work that actually happened. A detector can still hate that, but a reader usually does not.

So when I rewrite now, I trust those parts more.

## What I Started Cutting

I started cutting three kinds of things first.

The first was the neat sentence that did not really say anything.

The second was the paragraph that only existed to explain the section that was about to come next.

The third was the line that sounded true but still had no real weight behind it.

That last one is sneaky.

You can write a sentence that sounds thoughtful, technical, and correct, and it still adds almost nothing. Those are exactly the lines that make a post feel polished and empty at the same time.

Once I noticed that pattern, I started asking a simpler question: if I remove this sentence, do I actually lose anything?

If the answer was no, out it went.

## What I Do Now

My writing loop is much more practical than it used to be.

I start from the work itself. Then I write the post. Then I read it aloud. Then I look at what sounds stitched together. Then I fix that. After that I use the external tools as pressure, not as authority.

That last part matters.

GPTZero is useful as a pressure test. QuillBot is useful as a comparison tool when a line feels too stiff. ChatGPT is useful for alternative phrasings and image prompts. Codex is useful inside the repo, where the post, the layout, the screenshots, and the actual site all meet. Gemini is useful as a second read when I get stuck in my own pass and need another brain on structure or visuals.

But none of those tools gets to decide what the post really means.

That still has to come from me.

## The Real Problem

The real problem is not that tools exist. The problem is that they make it easy to confuse refinement with authorship.

The post can get more correct, more structured, more coherent, and less mine at the same time.

That is what I am trying to avoid now.

I do not want the blog to become a place where I paste cleaned-up output that happens to be technically acceptable. I want it to stay a place where I explain what I actually ran into, what I changed, what resisted me, and what I learned while doing it.

That is slower, but it is also the only part that is worth keeping.

## What Comes Next

I will probably write more about this.

Not because scan scores are suddenly the point, but because the writing loop itself has become part of the work now. The tooling, the transcripts, the rewrites, the website fixes, the screenshots, the arguments with detector-style prose, they are all part of the same process.

And that process is still changing.

## Sources

- [GPTZero](https://gptzero.me/)
- [QuillBot](https://quillbot.com/)
- [Gemini](https://gemini.google.com/)
- [OpenAI Codex](https://openai.com/codex/)
- [Transkriptor](https://transkriptor.com/)

## Outro

I still care about whether a post reads like me. The difference is that I trust that feeling more now than I trust a clean-looking rewrite.

If the article sounds too neat, too tidy, or too well-behaved, I know where to look first.
