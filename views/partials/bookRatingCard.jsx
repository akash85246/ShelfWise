<% 
  const starRating = Math.round(rating.rating / 2); 
%>
<li class="rating-item">
  <span><%= rating.title %></span>
  <span class="stars">
    <% for (let i = 1; i <= 5; i++) { %>
      <% if (i <= starRating) { %>
        <span class="star filled">&#9733;</span> 
      <% } else { %>
        <span class="star">&#9734;</span>
      <% } %>
    <% } %>
  </span>
</li>