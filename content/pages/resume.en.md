---
layout: resume
title: "Resume"
permalink: "/resume/"
description: "Kristof Riebbels' professional resume - Expertise in .NET development, software architecture, and secure coding practices."
sidebar: true
toc: true
lang: en
ref: resume
pageid: resume

---

Below are a few examples of my personal and open-source projects:


## Professional Summary

Senior .NET Developer with 17+ years of experience with secure and maintainable solutions. Passionate about clean code, SOLID principles, and test-driven development. Experienced in architecting and implementing cloud-based (Azure) systems.

Key strengths include:
- .NET Core/C# application development
- Software architecture and design patterns
- Test-driven development and quality assurance
- Authentication/security implementation (OIDC)
- Mentoring and Agile methodologies

## Core Competences
{% include resume.html section="core_competences" %}

## Projects and Examples

{% include projects.html  %}

For more projects, visit my [GitHub profile](https://github.com/kriebb).

## Skills and Expertise
{% include resume.html section="development_and_programming" %}

## Education and Graduation Project
<div class="resume-list">
{% for edu_item in site.data.resume[site.active_lang].education %}
  <div class="resume-list-item">{{ edu_item }}</div>
{% endfor %}
</div>

## Certifications
<div class="certification-container">
    {% include certification-logos.html %}
</div>

## {{ site.data.i18n[site.active_lang].resume.languages }}
<div class="resume-list">
{% for lang_item in site.data.resume[site.active_lang].languages %}
  <div class="resume-list-item">{{ lang_item | markdownify | remove: '<p>' | remove: '</p>' }}</div>
{% endfor %}
</div>

## Interests and Hobbies
<div class="resume-list">
{% for interest in site.data.resume[site.active_lang].interests_and_hobbies %}
  <div class="resume-list-item">{{ interest }}</div>
{% endfor %}
</div>

## Talk to Me About
<div class="resume-list">
{% for topic in site.data.resume[site.active_lang].talk_to_me_about %}
  <div class="resume-list-item">{{ topic }}</div>
{% endfor %}
</div>
