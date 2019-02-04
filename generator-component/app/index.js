'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const path = require('path');
module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(yosay(`Component generator`));

    const prompts = [
      {
        type: 'input',
        name: 'componentName',
        message: 'Component name'
      },
      {
        type: 'input',
        name: 'destination',
        message: 'Destination',
        default: 'src'
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    const name = this.props.componentName;
    const prefix = path.join(this.props.destination, name);
    this.fs.copyTpl(
      this.templatePath('Component.js'),
      this.destinationPath(`${prefix}/${name}.js`),
      { componentName: name }
    );

    this.fs.copyTpl(
      this.templatePath('Component.spec.js'),
      this.destinationPath(`${prefix}/${name}.spec.js`),
      { componentName: name }
    );

    this.fs.copyTpl(
      this.templatePath('Component.story.js'),
      this.destinationPath(`${prefix}/${name}.story.js`),
      { componentName: name }
    );

    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath(`${prefix}/package.json`),
      { componentName: name }
    );
  }
};
