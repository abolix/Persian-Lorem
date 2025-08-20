# Persian Lorem

A simple Persian Lorem Ipsum generator for Visual Studio Code that works seamlessly across HTML, Vue.js, React, and other file types.

## Features

- Generate Persian Lorem Ipsum text with ease.
- Insert a paragraph or a specific number of words directly into your editor.
- **Full support for Vue.js files** (.vue) with smart context detection
- **Complete React/JSX/TSX support** including TypeScript React files
- Works in HTML, JavaScript, TypeScript, CSS, and more
- Smart context validation to avoid inappropriate completions

## Supported File Types

- HTML (`.html`)
- Vue.js (`.vue`) - with template and script section detection
- React JavaScript (`.js`, `.jsx`)
- React TypeScript (`.ts`, `.tsx`)
- CSS/SCSS/Less (`.css`, `.scss`, `.less`)
- JSON (`.json`)
- Markdown (`.md`)
- Plain text and more

## Installation

1. Open Visual Studio Code.
2. Press `F1` to open the command palette.
3. Type `install` and select `Extensions: Install Extension`.
4. Search for `Persian Lorem` and install the extension.

## Usage

### Command Palette

1. Press `F1` or `Ctrl + Shift + P` to open the command palette.
2. Type `Persian Lorem` and select the command.
3. Enter the number of words you want to generate (leave empty for one paragraph).

### In the Editor

- Type `plorem` to generate one paragraph of Persian Lorem Ipsum.
- Type `plorem<number>` (e.g., `plorem20`) to generate a specific number of words.

## Examples

### Basic Usage
- `plorem` generates a paragraph of Persian Lorem Ipsum.
- `plorem20` generates 20 words of Persian Lorem Ipsum.

### Vue.js Example
```vue
<template>
  <div>
    <p>plorem50</p> <!-- Generates 50 words -->
  </div>
</template>
```

### React/JSX Example
```jsx
function MyComponent() {
  return (
    <div>
      <p>plorem30</p> {/* Generates 30 words */}
    </div>
  );
}
```

## Contributing

Contributions are welcome! Please visit the [repository](https://github.com/abolix/Persian-Lorem) to submit issues or pull requests.
