# AT-UI React

A modern React UI component library converted from Vue.js.

## Installation

```bash
npm install at-ui
```

## Usage

### Basic Example

```jsx
import React from 'react'
import { Button, Input, Alert, Card } from 'at-ui'
import 'at-ui/dist/at.css' // Import styles

function App() {
  return (
    <div>
      <Button type="primary">Click Me</Button>
      <Input placeholder="Enter text..." />
      <Alert type="success" message="Success!" />
      <Card title="Card Title">
        Card content
      </Card>
    </div>
  )
}
```

### Available Components

The following components have been converted to React:

- ✅ Button / ButtonGroup
- ✅ Input
- ✅ Textarea
- ✅ Checkbox / CheckboxGroup
- ✅ Radio / RadioGroup / RadioButton
- ✅ Switch
- ✅ Tag
- ✅ Badge
- ✅ Alert
- ✅ Card

### Component Props

Components follow React conventions:
- Use `onChange` instead of `@input` or `@change`
- Use `onClick` instead of `@click`
- Props are camelCase (e.g., `nativeType` instead of `native-type`)
- Controlled components use `value` and `onChange`

### Example: Controlled Input

```jsx
import { useState } from 'react'
import { Input } from 'at-ui'

function MyForm() {
  const [value, setValue] = useState('')
  
  return (
    <Input
      value={value}
      onChange={(newValue) => setValue(newValue)}
      placeholder="Enter text..."
    />
  )
}
```

### Example: Checkbox Group

```jsx
import { useState } from 'react'
import { Checkbox, CheckboxGroup } from 'at-ui'

function MyCheckboxes() {
  const [selected, setSelected] = useState([])
  
  return (
    <CheckboxGroup value={selected} onChange={setSelected}>
      <Checkbox label="Option 1">Option 1</Checkbox>
      <Checkbox label="Option 2">Option 2</Checkbox>
      <Checkbox label="Option 3">Option 3</Checkbox>
    </CheckboxGroup>
  )
}
```

### Example: Radio Group

```jsx
import { useState } from 'react'
import { Radio, RadioGroup } from 'at-ui'

function MyRadios() {
  const [value, setValue] = useState('option1')
  
  return (
    <RadioGroup value={value} onChange={setValue}>
      <Radio label="option1">Option 1</Radio>
      <Radio label="option2">Option 2</Radio>
      <Radio label="option3">Option 3</Radio>
    </RadioGroup>
  )
}
```

## Building

```bash
npm run build
```

## Development

```bash
npm run dev
```

## Migration Notes

This library has been converted from Vue.js to React. Key changes:

1. **Event Handlers**: Vue's `@click` becomes React's `onClick`, `@input` becomes `onChange`
2. **Props**: Vue's kebab-case props become camelCase in React
3. **Slots**: Vue slots become React `children` or named props
4. **v-model**: Use controlled components with `value` and `onChange`
5. **Context**: Component communication uses React Context API instead of Vue's event system

## License

MIT

