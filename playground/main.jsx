import React, { useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import {
  Alert, Badge, Breadcrumb, BreadcrumbItem, Button, ButtonGroup, Card, Checkbox, CheckboxGroup,
  Collapse, CollapseItem, Dialog, Modal, Dropdown, DropdownItem, DropdownMenu, Form, FormItem, Input, InputNumber,
  LoadingBar, Menu, MenuItem, Message, Notification, Option, Pagination, Popover, Progress, Radio, RadioGroup,
  Rate, Select, Slider, Step, Steps, Switch, Table, TabPane, Tabs, Tag, Textarea, Timeline, TimelineItem, Tooltip
} from '../src'

const Section = ({ title, children }) => (
  <section style={{ marginBottom: 32 }}>
    <h3 style={{ margin: '0 0 12px' }}>{title}</h3>
    {children}
  </section>
)

const columns = [
  { title: 'Name', key: 'name', sortType: 'normal' },
  { title: 'Age', key: 'age', sortType: 'normal' }
]
const data = [{ name: 'Cara', age: 30 }, { name: 'Abe', age: 20 }, { name: 'Bea', age: 25 }]

const App = () => {
  const formRef = useRef(null)
  const [model, setModel] = useState({ name: '', city: '' })
  const [modal, setModal] = useState(false)

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <h2>AT-UI React</h2>

      <Section title="Buttons, tags, badges">
        <ButtonGroup>
          <Button>Default</Button>
          <Button type="primary">Primary</Button>
          <Button type="success">Success</Button>
          <Button type="error">Error</Button>
        </ButtonGroup>{' '}
        <Tag color="success">Tag</Tag> <Tag closable>Closable</Tag>{' '}
        <Badge value={120}><Button>Inbox</Button></Badge>
      </Section>

      <Section title="Alerts">
        <Alert message="Info" showIcon />
        <Alert message="Success" type="success" showIcon description="With a description" />
      </Section>

      <Section title="Form controls">
        <Input placeholder="Input" style={{ width: 200 }} />{' '}
        <InputNumber defaultValue={3} min={0} max={10} />{' '}
        <Select defaultValue="a" style={{ width: 160 }} clearable>
          <Option value="a" label="Alpha" />
          <Option value="b" label="Beta" />
        </Select>
        <div style={{ margin: '12px 0' }}>
          <Checkbox label="x">Check</Checkbox>
          <RadioGroup defaultValue="a"><Radio label="a">A</Radio><Radio label="b">B</Radio></RadioGroup>
          <Switch defaultValue /> <Rate defaultValue={3} />
        </div>
        <Slider defaultValue={30} style={{ width: 300 }} />
        <Textarea placeholder="Textarea" />
      </Section>

      <Section title="Form validation">
        <Form ref={formRef} model={model} labelWidth={80} rules={{ name: [{ required: true, message: 'Name is required' }] }}>
          <FormItem label="Name" prop="name">
            <Input value={model.name} onChange={e => setModel({ ...model, name: e.target.value })} />
          </FormItem>
          <FormItem>
            <Button type="primary" onClick={() => formRef.current.validate()}>Validate</Button>
          </FormItem>
        </Form>
      </Section>

      <Section title="Navigation">
        <Breadcrumb><BreadcrumbItem>Home</BreadcrumbItem><BreadcrumbItem>Page</BreadcrumbItem></Breadcrumb>
        <Tabs>
          <TabPane label="One" name="1">First</TabPane>
          <TabPane label="Two" name="2">Second</TabPane>
        </Tabs>
        <Steps current={1}><Step title="One" /><Step title="Two" /><Step title="Three" /></Steps>
        <Pagination total={95} showTotal showQuickjump showSizer />
        <Menu mode="horizontal" defaultActiveName="a">
          <MenuItem name="a">A</MenuItem><MenuItem name="b">B</MenuItem>
        </Menu>
      </Section>

      <Section title="Data">
        <Table columns={columns} data={data} stripe border />
        <Collapse>
          <CollapseItem name="1" title="Panel 1">Content 1</CollapseItem>
          <CollapseItem name="2" title="Panel 2">Content 2</CollapseItem>
        </Collapse>
        <Timeline><TimelineItem color="green">Done</TimelineItem><TimelineItem>Next</TimelineItem></Timeline>
        <Progress percent={60} />
        <Progress type="circle" percent={40} />
      </Section>

      <Section title="Overlays">
        <Tooltip content="Tooltip"><Button>Hover</Button></Tooltip>{' '}
        <Popover trigger="click" title="Title" content="Popover body"><Button>Click</Button></Popover>{' '}
        <Dropdown trigger="click">
          <Button>Dropdown</Button>
          <DropdownMenu><DropdownItem name="1">One</DropdownItem><DropdownItem name="2">Two</DropdownItem></DropdownMenu>
        </Dropdown>{' '}
        <Button onClick={() => Message.success('Saved')}>Message</Button>{' '}
        <Button onClick={() => Notification.info({ title: 'Hi', message: 'Notification' })}>Notify</Button>{' '}
        <Button onClick={() => { LoadingBar.start(); setTimeout(LoadingBar.finish, 1500) }}>LoadingBar</Button>{' '}
        <Button onClick={() => Dialog.confirm('Sure?', 'Confirm').catch(() => {})}>Dialog</Button>{' '}
        <Button onClick={() => setModal(true)}>Modal</Button>
        <Modal value={modal} title="Modal" onChange={setModal}>Modal body</Modal>
      </Section>
      <Card title="Card">Card body</Card>
    </div>
  )
}

createRoot(document.getElementById('root')).render(<App />)
