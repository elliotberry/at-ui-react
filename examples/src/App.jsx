import React, { useState } from 'react'
import {
  Button,
  ButtonGroup,
  Tag,
  Radio,
  RadioGroup,
  RadioButton,
  Checkbox,
  CheckboxGroup,
  Input,
  InputNumber,
  Textarea,
  Badge,
  Switch,
  Alert,
  Card,
  Slider,
  Tooltip,
  Popover,
  Progress,
  Rate,
  Breadcrumb,
  BreadcrumbItem,
  Pagination,
  Collapse,
  CollapseItem,
  Steps,
  Step,
  Tabs,
  TabPane,
  Timeline,
  TimelineItem,
  Modal,
  Message,
  Notification,
  LoadingBar
} from 'at-ui'
import './App.css'

function App() {
  const [inputValue, setInputValue] = useState('')
  const [textareaValue, setTextareaValue] = useState('')
  const [radioValue, setRadioValue] = useState('option1')
  const [checkboxValues, setCheckboxValues] = useState([])
  const [switchValue, setSwitchValue] = useState(false)
  const [sliderValue, setSliderValue] = useState(50)
  const [rateValue, setRateValue] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState('tab1')
  const [activeCollapse, setActiveCollapse] = useState(['1'])
  const [modalVisible, setModalVisible] = useState(false)
  const [progressPercent, setProgressPercent] = useState(30)

  return (
    <div className="app">
      <header className="app-header">
        <h1>AT-UI React Component Library</h1>
        <p>Complete component showcase</p>
      </header>

      <div className="app-content">
        {/* Buttons */}
        <section className="component-section">
          <h2>Buttons</h2>
          <div className="component-demo">
            <Button type="default">Default</Button>
            <Button type="primary">Primary</Button>
            <Button type="success">Success</Button>
            <Button type="error">Error</Button>
            <Button type="warning">Warning</Button>
            <Button type="info">Info</Button>
            <Button disabled>Disabled</Button>
            <Button loading>Loading</Button>
            <Button icon="icon-star">With Icon</Button>
            <ButtonGroup size="small">
              <Button>Left</Button>
              <Button>Middle</Button>
              <Button>Right</Button>
            </ButtonGroup>
          </div>
        </section>

        {/* Form Components */}
        <section className="component-section">
          <h2>Form Components</h2>
          <div className="component-demo">
            <div className="demo-row">
              <Input
                placeholder="Enter text..."
                value={inputValue}
                onChange={(val) => setInputValue(val)}
              />
              <InputNumber
                placeholder="Number input"
                min={0}
                max={100}
                step={1}
              />
              <Textarea
                placeholder="Enter textarea..."
                value={textareaValue}
                onChange={(val) => setTextareaValue(val)}
                rows={4}
              />
            </div>
            <div className="demo-row">
              <Switch
                value={switchValue}
                onChange={setSwitchValue}
                checkedText="ON"
                unCheckedText="OFF"
              />
              <span>Switch: {switchValue ? 'ON' : 'OFF'}</span>
            </div>
            <div className="demo-row">
              <CheckboxGroup value={checkboxValues} onChange={setCheckboxValues}>
                <Checkbox label="option1">Option 1</Checkbox>
                <Checkbox label="option2">Option 2</Checkbox>
                <Checkbox label="option3">Option 3</Checkbox>
              </CheckboxGroup>
              <span>Selected: {checkboxValues.join(', ')}</span>
            </div>
            <div className="demo-row">
              <RadioGroup value={radioValue} onChange={setRadioValue}>
                <Radio label="option1">Option 1</Radio>
                <Radio label="option2">Option 2</Radio>
                <Radio label="option3">Option 3</Radio>
              </RadioGroup>
              <span>Selected: {radioValue}</span>
            </div>
            <div className="demo-row">
              <RadioGroup value={radioValue} onChange={setRadioValue}>
                <RadioButton label="option1">Button 1</RadioButton>
                <RadioButton label="option2">Button 2</RadioButton>
                <RadioButton label="option3">Button 3</RadioButton>
              </RadioGroup>
            </div>
            <div className="demo-row">
              <Slider
                value={sliderValue}
                onChange={setSliderValue}
                min={0}
                max={100}
              />
              <span>Value: {sliderValue}</span>
            </div>
          </div>
        </section>

        {/* Display Components */}
        <section className="component-section">
          <h2>Display Components</h2>
          <div className="component-demo">
            <div className="demo-row">
              <Tag>Default Tag</Tag>
              <Tag color="primary">Primary</Tag>
              <Tag color="success">Success</Tag>
              <Tag color="error">Error</Tag>
              <Tag color="warning">Warning</Tag>
              <Tag closable>Closable</Tag>
            </div>
            <div className="demo-row">
              <Badge value={5}>
                <Button>Messages</Button>
              </Badge>
              <Badge value={99} maxNum={99}>
                <Button>Notifications</Button>
              </Badge>
              <Badge dot>
                <Button>Dot Badge</Button>
              </Badge>
            </div>
            <div className="demo-row">
              <Alert type="success" message="Success message" showIcon />
              <Alert type="error" message="Error message" showIcon />
              <Alert type="warning" message="Warning message" showIcon />
              <Alert type="info" message="Info message" showIcon closable />
            </div>
            <div className="demo-row">
              <Progress percent={progressPercent} />
              <Progress percent={100} status="success" />
              <Progress percent={50} status="error" />
            </div>
            <div className="demo-row">
              <Rate
                value={rateValue}
                onChange={setRateValue}
                showText
              >
                {rateValue > 0 ? `You rated ${rateValue} stars` : 'No rating'}
              </Rate>
            </div>
          </div>
        </section>

        {/* Layout Components */}
        <section className="component-section">
          <h2>Layout Components</h2>
          <div className="component-demo">
            <Card title="Card Title" extra={<Button size="small">Action</Button>}>
              <p>This is a card component with title and extra content.</p>
              <p>Card body content goes here.</p>
            </Card>
            <Card title="Loading Card" loading>
              Content will show after loading
            </Card>
          </div>
        </section>

        {/* Collapse */}
        <section className="component-section">
          <h2>Collapse</h2>
          <div className="component-demo">
            <Collapse value={activeCollapse} onChange={setActiveCollapse}>
              <CollapseItem title="Panel 1" name="1">
                Content of panel 1
              </CollapseItem>
              <CollapseItem title="Panel 2" name="2">
                Content of panel 2
              </CollapseItem>
              <CollapseItem title="Panel 3" name="3">
                Content of panel 3
              </CollapseItem>
            </Collapse>
          </div>
        </section>

        {/* Tabs */}
        <section className="component-section">
          <h2>Tabs</h2>
          <div className="component-demo">
            <Tabs value={activeTab} onChange={(e) => setActiveTab(e.name)}>
              <TabPane label="Tab 1" name="tab1">
                Content of Tab 1
              </TabPane>
              <TabPane label="Tab 2" name="tab2">
                Content of Tab 2
              </TabPane>
              <TabPane label="Tab 3" name="tab3">
                Content of Tab 3
              </TabPane>
            </Tabs>
          </div>
        </section>

        {/* Steps */}
        <section className="component-section">
          <h2>Steps</h2>
          <div className="component-demo">
            <Steps current={1}>
              <Step title="Finished" description="This is a description" />
              <Step title="In Progress" description="This is a description" />
              <Step title="Waiting" description="This is a description" />
            </Steps>
          </div>
        </section>

        {/* Timeline */}
        <section className="component-section">
          <h2>Timeline</h2>
          <div className="component-demo">
            <Timeline>
              <TimelineItem color="blue">
                <p>Create a services site 2015-09-01</p>
              </TimelineItem>
              <TimelineItem color="green">
                <p>Solve initial network problems 2015-09-01</p>
              </TimelineItem>
              <TimelineItem color="red">
                <p>Technical testing 2015-09-01</p>
              </TimelineItem>
              <TimelineItem>
                <p>Network problems being solved 2015-09-01</p>
              </TimelineItem>
            </Timeline>
          </div>
        </section>

        {/* Breadcrumb */}
        <section className="component-section">
          <h2>Breadcrumb</h2>
          <div className="component-demo">
            <Breadcrumb>
              <BreadcrumbItem href="#home">Home</BreadcrumbItem>
              <BreadcrumbItem href="#components">Components</BreadcrumbItem>
              <BreadcrumbItem>Breadcrumb</BreadcrumbItem>
            </Breadcrumb>
          </div>
        </section>

        {/* Pagination */}
        <section className="component-section">
          <h2>Pagination</h2>
          <div className="component-demo">
            <Pagination
              current={currentPage}
              total={100}
              pageSize={10}
              onChange={setCurrentPage}
              showTotal
            />
            <Pagination
              current={currentPage}
              total={100}
              pageSize={10}
              simple
              onChange={setCurrentPage}
            />
          </div>
        </section>

        {/* Tooltip & Popover */}
        <section className="component-section">
          <h2>Tooltip & Popover</h2>
          <div className="component-demo">
            <Tooltip content="This is a tooltip" placement="top">
              <Button>Hover for tooltip</Button>
            </Tooltip>
            <Popover
              title="Popover Title"
              content="This is popover content"
              trigger="click"
            >
              <Button>Click for popover</Button>
            </Popover>
          </div>
        </section>

        {/* Modal */}
        <section className="component-section">
          <h2>Modal</h2>
          <div className="component-demo">
            <Button onClick={() => setModalVisible(true)}>Open Modal</Button>
            <Modal
              value={modalVisible}
              onChange={setModalVisible}
              title="Modal Title"
              content="This is modal content"
              onConfirm={() => {
                console.log('Confirmed')
                setModalVisible(false)
              }}
              onCancel={() => {
                console.log('Cancelled')
                setModalVisible(false)
              }}
            />
          </div>
        </section>

        {/* Loading Bar */}
        <section className="component-section">
          <h2>Loading Bar</h2>
          <div className="component-demo">
            <LoadingBar show percent={progressPercent} />
            <Button onClick={() => setProgressPercent(Math.min(100, progressPercent + 10))}>
              Increase Progress
            </Button>
          </div>
        </section>

        {/* Interactive Demo */}
        <section className="component-section">
          <h2>Interactive Demo</h2>
          <div className="component-demo">
            <Card title="Form Example">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Input
                  placeholder="Your name"
                  value={inputValue}
                  onChange={setInputValue}
                />
                <Textarea
                  placeholder="Your message"
                  value={textareaValue}
                  onChange={setTextareaValue}
                  rows={4}
                />
                <div>
                  <label>Rate this example: </label>
                  <Rate value={rateValue} onChange={setRateValue} />
                </div>
                <div>
                  <Button type="primary" onClick={() => {
                    alert(`Name: ${inputValue}\nMessage: ${textareaValue}\nRating: ${rateValue}`)
                  }}>
                    Submit
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </section>
      </div>

      <footer className="app-footer">
        <p>AT-UI React Component Library - Complete Component Showcase</p>
      </footer>
    </div>
  )
}

export default App

