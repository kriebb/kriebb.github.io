---
layout: resume
title: "CV"
permalink: "/cv/"
description: "Kristof Riebbels' professionele CV - Expertise in .NET ontwikkeling, software architectuur en veilige codeerpraktijken."
sidebar: true
toc: true
lang: nl
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
{% for edu_item in site.data.resume[site.active_lang].education %}
- {{ edu_item }}
{% endfor %}

## Certifications
{% for cert in site.data.resume[site.active_lang].certifications %}
  {% if cert contains "Azure" %}
    {% include certification-logos.html cert="azure-developer" %}
  {% endif %}
  {% if cert contains "Scrum" %}
    {% include certification-logos.html cert="scrum-master" %}
  {% endif %}
  {% if cert contains "Bachelor" %}
    {% include certification-logos.html cert="bachelor-it" %}
  {% endif %}
  {{ cert }}
{% endfor %}


## Interests and Hobbies
{% for interest in site.data.resume[site.active_lang].interests_and_hobbies %}
- {{ interest }}
{% endfor %}

## Talk to Me About
{% for topic in site.data.resume.talk_to_me_about[site.active_lang] %}
- {{ topic }}
{% endfor %}

