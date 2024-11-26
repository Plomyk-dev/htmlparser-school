const fs = require('fs');
const cheerio = require('cheerio');

function parseHtmlToJson(html) {
  const $ = cheerio.load(html);
  const jsonOutput = {
    title: $('title').text(),
    header: $('h1').text(),
    dateRange: $('h2').text().replace('Okres czasu: ', '').trim(),
    days: []
  };

  $('table').each((i, table) => {
    const dayHeader = $(table).find('tr').first().find('th').text().replace('Dzień: ', '').trim();
    const rows = $(table).find('tr').slice(1);
    const lessons = [];

    rows.each((j, row) => {
      const cells = $(row).find('td');
      if (cells.length > 0) {
        lessons.push({
          lesson: $(cells[0]).text().trim(),
          teacher: $(cells[1]).text().trim(),
          group: $(cells[2]).text().trim(),
          subject: $(cells[3]).text().trim(),
          room: $(cells[4]).text().trim(),
          substitute: $(cells[5]).text().trim(),
          notes: $(cells[6]).text().trim(),
        });
      }
    });

    jsonOutput.days.push({
      day: dayHeader,
      lessons,
    });
  });

  return jsonOutput;
}

fs.readFile('zastepstwa.html', 'utf8', (err, data) => {
  if (err) {
    console.error('Ełoł:', err);
    return;
  }

  const result = parseHtmlToJson(data);
  fs.writeFile('output.json', JSON.stringify(result, null, 2), (err) => {
    if (err) {
      console.error('Ełoł:', err);
      return;
    }
    console.log('DONE');
  });
});
