const fs = require('fs');
const Handlebars = require('handlebars');
const _ = require('lodash');
const config = require('./config.json');
const  ProgressBar = require('progress');

const bar = new ProgressBar(':current/:total [:bar]', { total: config.employees.length });
const source = fs.readFileSync('./template.hbs');


_.each(config.employees, (row, index) => {
  const template = Handlebars.compile(source.toString());
  let data = _.merge({}, _.pick(config, ['companyLogo', 'mailIcon', 'phoneIcon', 'mobileIcon', 'infoText']));
  data = _.merge(data, row);

  const phoneLink = _.replace(row.phone, /\s|\(0\)/g, '');
  const mobileLink = _.replace(row.phone, /\s|\(0\)/g, '');
  data = _.merge(data, { phoneLink, mobileLink });

  if (!fs.existsSync('./dist')) {
    fs.mkdirSync('./dist');
  }
  const fileName = row.name + '.html';
  fs.writeFileSync(`./dist/${fileName}`, template(data));

  bar.tick();
});
