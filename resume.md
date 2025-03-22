---
layout: page
title: "Resume"
permalink: "/resume"
description: "My complete professional resume including skills, projects, education, and certifications."
sidebar: true
toc: true
---

Below you'll find an overview of my professional journey.

## Core Competences
{% include resume.html section="core_competences" %}

## Projects and Examples
Below are a few examples of my personal and open-source projects:

{% include projects.html  %}

For more projects, visit my [GitHub profile](https://github.com/kriebb).

## Skills and Expertise
{% include resume.html section="development_and_programming" %}

## Education and Graduation Project
{% for edu_item in site.data.resume.education %}
- {{ edu_item }}
{% endfor %}

## Certifications
{% for cert in site.data.resume.certifications %}
- {{ cert }}
{% endfor %}

## Interests and Hobbies
{% for interest in site.data.resume.interests_and_hobbies %}
- {{ interest }}
{% endfor %}

## Talk to Me About
{% for topic in site.data.resume.talk_to_me_about %}
- {{ topic }}
{% endfor %}