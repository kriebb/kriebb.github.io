---
layout: page
title: About
permalink: /about/
description: "Introduces who you are as a professional, highlighting expertise, passion, and personal mission to build trust and connection."
sidebar: false
lang: en
ref: about
pageid: about

---
{% assign title = site.data.i18n['en'].about.title %}
{% assign intro = site.data.i18n['en'].about.intro %}

{{ intro }}

Experimenting with:
- Azure
- AI (OpenAI, Mistral )
- Node.js,Typescript,...
- Python,
- and other technologies.

> {% assign github_text = site.data.i18n['en'].about.github %} {{ github_text }} [GitHub Portfolio](https://github.com/) and let me know what you think. Always open for a review

> *{% assign mission_link = site.data.i18n['en'].about.mission_link %}{{ mission_link }}*

Thanks to my ADHD-driven energy and curiosity, I continuously learn and always look for ways to improve existing processes. 

## {{ site.data.i18n['en'].about.senior_title }}

- {{ site.data.i18n['en'].about.senior_desc }}

## {{ site.data.i18n['en'].about.security_title }}

- {{ site.data.i18n['en'].about.security_desc }}

## {{ site.data.i18n['en'].about.coaching_title }}

- {{ site.data.i18n['en'].about.coaching_desc }}
 
## {{ site.data.i18n['en'].about.growth_title }}

- {{ site.data.i18n['en'].about.growth_desc }}