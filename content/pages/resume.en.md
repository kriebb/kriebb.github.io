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
{% for category_obj in site.data.resume[site.active_lang].skills.development_and_programming %}
<div class="competency-card">
  <h3 class="competency-title">{{ category_obj.category }}</h3>
  <div class="competency-items">
    {% for item in category_obj.items %}
      <div class="competency-item">
        {% if item == "C#" %}{% include tech-icon.html tech="csharp" %}{% endif %}
        {% if item == ".NET Core" %}{% include tech-icon.html tech="dotnet" %}{% endif %}
        {% if item == "ASP.NET Core" %}{% include tech-icon.html tech="dotnet" %}{% endif %}
        {% if item == "Azure" %}{% include tech-icon.html tech="azure" %}{% endif %}
        {% if item == "JavaScript" %}{% include tech-icon.html tech="javascript" %}{% endif %}
        {% if item == "TypeScript" %}{% include tech-icon.html tech="typescript" %}{% endif %}
        {% if item contains "Docker" %}{% include tech-icon.html tech="docker" %}{% endif %}
        <span class="competency-badge">{{ item }}</span>
      </div>
    {% endfor %}
  </div>
</div>
{% endfor %}

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
{% for topic in site.data.resume[site.active_lang].talk_to_me_about %}
- {{ topic }}
{% endfor %}
