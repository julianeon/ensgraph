app.get('/', (req, res) => {
  fs.readFile(path.join(__dirname, 'public', 'displayData.html'), 'utf8', (err, html) => {
    if (err) {
      res.status(500).send('Error loading page');
    } else {
      res.send(html);
    }
  });
});
