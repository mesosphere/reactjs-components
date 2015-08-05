import React from 'react/addons';
import classNames from 'classnames';
import * as Util from '../Util/Util';

var CSSTransitionGroup = React.addons.CSSTransitionGroup;

export default class Dropdown extends React.Component {
  constructor() {
    super();
    this.state = {
      isOpen: false,
      selectedId: 'b'
    };
    [
      'handleButtonBlur',
      'handleMenuToggle',
      'handleMouseLeave',
      'handleMouseEnter'
    ]
      .forEach((method) => {
        this[method] = this[method].bind(this);
      }, this);
  }

  handleMouseEnter() {
    this.preventBlur = true;
  }

  handleMouseLeave() {
    this.preventBlur = false;
  }

  handleButtonBlur() {
    if (!this.preventBlur) {
      this.setState({isOpen: false});
    }
  }

  handleMenuToggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  handleItemClick(item) {
    this.props.onItemSelection(item);

    this.setState({
      isOpen: false,
      selectedId: item.id
    });
  }

  getSelectedHtml(id, items) {
    var obj = Util.find(items, function (item) {
      return item.id === id;
    });

    if (obj.selectedHtml != null) {
      return obj.selectedHtml;
    }

    return obj.html;
  }

  renderItems(items) {
    return items.map((item) => {
      var classSet = classNames(
        item.className,
        this.props.dropdownMenuListItemClassName
      );
      var onClick = null;

      if (item.selectable !== false) {
        onClick = this.handleItemClick.bind(this, item);
      }

      return (
        <li className={classSet} key={item.id} onClick={onClick}>
          {item.html}
        </li>
      );
    }, this);
  }

  render() {
    var dropdownStateClassSet = {
      'open': this.state.isOpen
    };
    var dropdownMenu;
    var items = this.props.items;
    var wrapperClassSet = classNames(dropdownStateClassSet, this.props.wrapperClassName);

    if (this.state.isOpen) {
      dropdownMenu = (
        <span className={this.props.dropdownMenuClassName}
          onMouseEnter={this.handleMouseEnter}
          onMouseLeave={this.handleMouseLeave}
          role="menu">
          <ul className={this.props.dropdownMenuListClassName}>
            {this.renderItems(items)}
          </ul>
        </span>
      );
    } else {
      dropdownMenu = null;
    }

    return (
      <span className={wrapperClassSet}>
        <button className={this.props.buttonClassName}
          onBlur={this.handleButtonBlur}
          onClick={this.handleMenuToggle}
          ref="button"
          type="button">
          {this.getSelectedHtml(this.state.selectedId, items)}
        </button>
        <CSSTransitionGroup transitionName={this.props.transitionName}>
          {dropdownMenu}
        </CSSTransitionGroup>
      </span>
    );
  }
}

Dropdown.defaultProps = {
  transitionName: 'dropdown-menu',
  onItemSelection: () => {}
};

Dropdown.propTypes = {
  items: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      id: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number
      ]).isRequired,
      html: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.object
      ]),
      selectedHtml: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.object
      ])
    })
  ).isRequired,
  onItemSelection: React.PropTypes.func.isRequired,
  selectedId: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number
  ]).isRequired,
  attributes: React.PropTypes.object,
  className: React.PropTypes.string,
  tag: React.PropTypes.string
};
