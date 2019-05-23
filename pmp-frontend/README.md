# PmpFrontend

## Project Structure

```
.
├── app
│   ├── account
│   │   ├── account.component.html
│   │   ├── account.component.scss
│   │   ├── account.component.spec.ts
│   │   └── account.component.ts
│   ├── admin
│   │   ├── admin.component.html
│   │   ├── admin.component.scss
│   │   ├── admin.component.spec.ts
│   │   └── admin.component.ts
│   ├── app-routing.module.ts
│   ├── app.component.html
│   ├── app.component.scss
│   ├── app.component.spec.ts
│   ├── app.component.ts
│   ├── app.module.ts
│   ├── auth
│   │   ├── auth.component.html
│   │   ├── auth.component.scss
│   │   ├── auth.component.spec.ts
│   │   └── auth.component.ts
│   ├── chats
│   │   ├── chats.component.html
│   │   ├── chats.component.scss
│   │   ├── chats.component.spec.ts
│   │   └── chats.component.ts
│   ├── company
│   │   ├── company.component.html
│   │   ├── company.component.scss
│   │   ├── company.component.spec.ts
│   │   └── company.component.ts
│   ├── employee
│   │   ├── employee.component.html
│   │   ├── employee.component.scss
│   │   ├── employee.component.spec.ts
│   │   └── employee.component.ts
│   ├── guard
│   │   ├── auth.guard.spec.ts
│   │   └── auth.guard.ts
│   ├── home
│   │   ├── home.component.html
│   │   ├── home.component.scss
│   │   ├── home.component.spec.ts
│   │   └── home.component.ts
│   ├── issues
│   │   ├── default-user.png
│   │   ├── font-awesome.min.css
│   │   ├── issues.component.html
│   │   ├── issues.component.scss
│   │   ├── issues.component.spec.ts
│   │   └── issues.component.ts
│   ├── models
│   │   ├── action.ts
│   │   ├── event.ts
│   │   ├── issue.ts
│   │   └── message.ts
│   ├── nav
│   │   ├── nav.component.html
│   │   ├── nav.component.scss
│   │   ├── nav.component.spec.ts
│   │   └── nav.component.ts
│   ├── pipes
│   │   ├── issue-pipe.pipe.spec.ts
│   │   ├── issue-pipe.pipe.ts
│   │   ├── listfilter.pipe.spec.ts
│   │   ├── listfilter.pipe.ts
│   │   ├── messageslist.pipe.spec.ts
│   │   ├── messageslist.pipe.ts
│   │   ├── sequential.pipe.spec.ts
│   │   ├── sequential.pipe.ts
│   │   ├── sprint.pipe.spec.ts
│   │   └── sprint.pipe.ts
│   ├── project
│   │   ├── project.component.html
│   │   ├── project.component.scss
│   │   ├── project.component.spec.ts
│   │   └── project.component.ts
│   ├── roles
│   │   ├── roles.component.html
│   │   ├── roles.component.scss
│   │   ├── roles.component.spec.ts
│   │   └── roles.component.ts
│   ├── services
│   │   ├── auth.service.spec.ts
│   │   ├── auth.service.ts
│   │   ├── chat.service.spec.ts
│   │   ├── chat.service.ts
│   │   ├── company.service.spec.ts
│   │   ├── company.service.ts
│   │   ├── employee.service.spec.ts
│   │   ├── employee.service.ts
│   │   ├── issuetracker.service.spec.ts
│   │   ├── issuetracker.service.ts
│   │   ├── project.service.spec.ts
│   │   ├── project.service.ts
│   │   ├── role.service.spec.ts
│   │   ├── role.service.ts
│   │   ├── task.service.spec.ts
│   │   ├── task.service.ts
│   │   ├── team.service.spec.ts
│   │   └── team.service.ts
│   ├── sprints
│   │   ├── sprints.component.html
│   │   ├── sprints.component.scss
│   │   ├── sprints.component.spec.ts
│   │   └── sprints.component.ts
│   └── team
│       ├── team.component.html
│       ├── team.component.scss
│       ├── team.component.spec.ts
│       └── team.component.ts
├── assets
│   └── default-user.png
├── browserslist
├── environments
│   ├── environment.prod.ts
│   └── environment.ts
├── favicon.ico
├── index.html
├── karma.conf.js
├── main.ts
├── polyfills.ts
├── styles.scss
├── test.ts
├── tsconfig.app.json
├── tsconfig.spec.json
└── tslint.json
```

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.2.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
