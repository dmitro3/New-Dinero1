# Node.js Coding Guide
This document serves as a guide for writing consistent, maintainable, and aesthetically pleasing Node.js code. It incorporates community best practices and personal opinions for a robust and standardized codebase.

---

## Naming Conventions

- **PascalCase**: Use for types, classes, enums, and constants.
- **camelCase**: Use for variables, properties, functions, socket channel names, and socket rooms.
- **CAPITAL_SNAKE_CASE**: Use for constants.
- **small-kebab-case**: Use for routes and socket namespaces.
- **Default Exports**: Ensure the file name matches the default export:
  ```
  demo.controller.js -> DemoController
  demo.service.js -> DemoService
  demo.middleware.js -> DemoMiddleware
  ```
- **Socket Channel/Room Names**:
  - Use `/forward-slash` as a prefix for namespaces and channels.
  - Use `/camelCase` for socket channel and room names, appending unique IDs after `:` for one-to-one communication:
    ```javascript
    const DEMO_NAMESPACE = '/demo';
    const DEMO_CHANNEL_HELLO = `${DEMO_NAMESPACE}/hello`;
    const DEMO_CHANNEL_USER_ROOM = `${DEMO_NAMESPACE}/hello:1`;
    ```
- **JSON Schema IDs**: Prefix schema IDs with `/forward-slash`.

---

## File Naming Conventions

- Use specific suffixes based on the file type and folder:
  - `.config.js` for configuration files.
  - `.controller.js` for controllers.
  - `.model.js` for models.
  - `.migration.js` for database migrations.
  - `.seeder.js` for seeders.
  - `.middleware.js` for middleware.
  - `.routes.js` for routes.
  - `.schema.js` for validation schemas.
  - `.helper.js` for helper functions.
  - `.emitter.js` for event emitters.
  - `.namespace.js` for socket namespaces.
  - `.handler.js` for handlers.
  - `.util.js` for utilities.
  - `.error.js` for error definitions.
  - `.template.js` for templates.
- Include the parent folder name in the file name where applicable:
  ```
  demo.controller.js || demo.middleware.js || demo.routes.js
  ```

---

## Database Naming Conventions

- Use `snake_case` for column names.
- Separate words with `_` in column names.
- Use singular names for models.

---

## Code Ordering

- **Imports**: Always place imports at the top of the file.
- **Class Structure**:
  1. Properties (static before instance).
  2. Methods (public before private).

---

## Coding Rules

- **Strings**: Use single quotes `'` unless required by JSON.
- **Equality**: Use strict equality `===` and `!==`. Only use `==` for comparisons with `null` or `undefined`.
- **Arrays and Objects**: Use `[]` for arrays and `{}` for objects instead of constructors.
- **Exports**: Export variables and functions only when shared across components.
- **Arrow Functions**: Prefer arrow functions over anonymous function expressions.
- **Function Parameters**: Avoid unnecessary parentheses for single parameters:
  ```javascript
  // Correct
  x => x + x;
  (x, y) => x + y;

  // Incorrect
  (x) => x + x;
  ```

---

## Formatting

- **Indentation**: Use 2 spaces. Avoid mixing tabs and spaces.
- **Line Endings**: Use UNIX-style newlines (`\n`). Ensure the last line of every file ends with a newline.
- **Line Length**: Limit lines to 80 characters for readability.
- **Trailing Whitespace**: Remove all trailing whitespace before committing.
- **Quotes**: Use single quotes `'` unless writing JSON.

---

## Comments

- Use `//` for single-line and `/* */` for multi-line comments.
- Write comments to explain:
  - Higher-level mechanisms.
  - Complex or non-trivial code segments.
- Avoid restating obvious code.

---

## Enforcement Tools

- **Code Style**: Enforced via [ESLint](https://eslint.org) with a community-recommended configuration such as [Airbnb](https://github.com/airbnb/javascript) or [StandardJS](https://standardjs.com).
- **Pre-Commit Hooks**: Use [Husky](https://github.com/typicode/husky) to enforce linting and formatting checks before commits.
- **Formatting**: Utilize [Prettier](https://prettier.io/) for consistent code formatting.
- **Testing**: Include unit tests with [Jest](https://jestjs.io/) or [Mocha](https://mochajs.org) for reliability.

