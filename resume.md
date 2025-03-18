---
layout: page
title: "Resume"
permalink: "/resume"
description: "My complete professional resume including skills, projects, education, and certifications."
---

For more insights into my motivation and professional vision, please visit [Mission & Vision](/mission-vision).

Interested in collaborating or learning more? Feel free to [reach out](/contact.md).

Please visit my [Work Experience page](/work-experience.md).

Below you'll find an overview of my professional journey. 

---


## Core Competencies

<!-- We include an HTML snippet that uses a card-based layout. -->
{% include resume.html section="core_competencies" %}

---

## Projects and Examples

Below are a few examples of my personal and open-source projects:

{% for project in site.data.resume.projects %}
- [**{{ project.title }}**]({{ project.link }})
  - {{ project.description }}
{% endfor %}

For more projects, visit my [GitHub profile](https://github.com/kriebb).

  <br/>

---

## Skills and Expertise

<!-- Same advanced layout approach, referencing the "development_and_programming" data. -->
{% include resume.html section="development_and_programming" %}

---

## Education and Graduation Project

{% for edu_item in site.data.resume.education %}
- {{ edu_item }}
{% endfor %}

<br/>

---

## Certifications

{% for cert in site.data.resume.certifications %}
- {{ cert }}
{% endfor %}

<br/>

---

## Interests and Hobbies

{% for interest in site.data.resume.interests_and_hobbies %}
- {{ interest }}
{% endfor %}

<br/>

---

## Talk to Me About

{% for topic in site.data.resume.talk_to_me_about %}
- {{ topic }}
{% endfor %}

<br/>

---

