---
layout: page
title: "Work Experience"
permalink: "/work-experience"
---

Below you’ll find a chronological overview with highlights of my roles, used tech and responsibilities.

<div class="timeline">
  {% for item in site.data.work_experience %}
  <div class="timeline-item" data-aos="fade-up">
    <div class="content">
      <div class="date">{{ item.date }}</div>
      <h3>{{ item.company }}</h3>
      <ul>
        {% for bullet in item.bullets %}
          <li>{{ bullet }}</li>
        {% endfor %}
        {% if item.extra_details %}
          <li>
            <details>
              <summary>More details</summary>
              <ul>
                      {% for detail in item.extra_details %}

                        <li>
                          {{ detail }}
                        </li>
                      {% endfor %}
              </ul>
            </details>
          </li>
        {% endif %}
      </ul>
    </div>
  </div>
  {% endfor %}
</div>

*For more details on my responsibilities or specific projects, feel free to [contact me](/contact).*
