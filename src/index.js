// React Components
import Button from './components/button'
import ButtonGroup from './components/button-group'
import Tag from './components/tag'
import Radio from './components/radio'
import RadioGroup from './components/radio-group'
import RadioButton from './components/radio-button'
import Checkbox from './components/checkbox'
import CheckboxGroup from './components/checkbox-group'
import Input from './components/input'
import InputNumber from './components/input-number'
import Textarea from './components/textarea'
import Badge from './components/badge'
import Switch from './components/switch'
import Alert from './components/alert'
import Card from './components/card'
import Slider from './components/slider'
import Tooltip from './components/tooltip'
import Popover from './components/popover'
import Progress from './components/progress'
import Rate from './components/rate'
import Breadcrumb from './components/breadcrumb'
import BreadcrumbItem from './components/breadcrumb-item'
import Pagination from './components/pagination'
import Collapse from './components/collapse'
import CollapseItem from './components/collapse-item'
import Steps from './components/steps'
import Step from './components/step'
import Tabs from './components/tabs'
import TabPane from './components/tab-pane'
import Timeline from './components/timeline'
import TimelineItem from './components/timeline-item'

// Placeholder exports for components not yet converted
const PlaceholderComponent = () => {
  console.warn('This component is not yet converted to React')
  return null
}

const components = {
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
  TimelineItem
}

// Import remaining components
import LoadingBar from './components/loading-bar'
import Modal from './components/modal'
import Dialog from './components/dialog'
import Select from './components/select'
import Option from './components/option'
import OptionGroup from './components/option-group'
import Dropdown from './components/dropdown'
import DropdownMenu from './components/dropdown-menu'
import DropdownItem from './components/dropdown-item'
import Message from './components/message'
import Notification from './components/notification'
import Menu from './components/menu'
import MenuItem from './components/menu-item'
import MenuItemGroup from './components/menu-item-group'
import Submenu from './components/submenu'
import Table from './components/table'

Object.assign(components, {
  LoadingBar,
  Modal,
  Dialog,
  Select,
  Option,
  OptionGroup,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Message,
  Notification,
  Menu,
  MenuItem,
  MenuItemGroup,
  Submenu,
  Table
})

export {
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
  LoadingBar,
  Modal,
  Dialog,
  Select,
  Option,
  OptionGroup,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Message,
  Notification,
  Menu,
  MenuItem,
  MenuItemGroup,
  Submenu,
  Table
}

export default components
