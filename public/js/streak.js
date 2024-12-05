const streakList = document.getElementById('streak_list');

const monthNames = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

const currentYear = new Date().getFullYear();
const allMonths = monthNames.map((name, i) => ({
  name,
  id: `${currentYear}-${(i + 1).toString().padStart(2, "0")}`
}));


const getEmoji = (booksRead) => {
  if (booksRead === "0") return ""; 
  if (booksRead <= 3) return "📖"; 
  if (booksRead <= 7) return "🤓"; 
  if (booksRead <= 10) return "🔥";
  if (booksRead <= 15) return "✨";
  return "🏆"; 
};

allMonths.forEach(({ name, id }) => {
  const dataForMonth = streakData.find((item) => item.month === id);
  const booksRead = dataForMonth ? dataForMonth.books_read : "0";

  const emoji = getEmoji(booksRead); 

  const circle = document.createElement('li');
  circle.className = `streak-circle`;
  circle.id = `circle-${id.replace("-", "")}`;
  circle.innerHTML = `
    <div>
      <div class="book-number">${booksRead}</div>
      <div class="month">${name}</div>
      <div class="emoji">${emoji}</div>
    </div>
  `;

  streakList.appendChild(circle);
});