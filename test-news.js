import dotenv from 'dotenv';
import axios from 'axios';
dotenv.config();

axios.get(`https://newsapi.org/v2/top-headlines?category=technology&language=en&pageSize=5&apiKey=${process.env.NEWS_API_KEY}`)
  .then(response => {
    const articles = response.data.articles;
    console.log('Top news headlines:');
articles.forEach((article, index) => {
  console.log(`\n${index + 1}. ${article.title}`);
  console.log(`   ${article.description?.substring(0, 100)}...` || 'No description');
  console.log(`   🔗 ${article.url}`);
  console.log(`   📅 ${new Date(article.publishedAt).toLocaleDateString('hu-HU')}`);
  console.log('---');
});
  })
  .catch(error => {
    console.error('Error fetching news:', error);
  });