---
layout: page
title: "Blog"
permalink: "/nl/blog/"
sidebar: false
lang: nl
ref: blog
---

<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a> - <small>{{ post.date | date: "%B %d, %Y" }}</small>
    </li>
  {% endfor %}
</ul>

