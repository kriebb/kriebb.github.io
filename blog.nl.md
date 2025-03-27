---
layout: page
title: "Blog"
permalink: "/niewus"
sidebar: false
ref: blog
lang: nl
---

<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a> - <small>{{ post.date | date: "%B %d, %Y" }}</small>
    </li>
  {% endfor %}
</ul>

