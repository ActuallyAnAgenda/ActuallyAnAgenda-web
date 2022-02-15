import React from "react";

class TrayItem extends React.Component {

    constructor(props) {
        super(props);
        this.state = {expanded: false};
        this.onClick = this.onClick.bind(this);
    }

    onClick(event) {
        event.preventDefault();
        this.setState({expanded: !this.state.expanded});
    }

    render() {
        // Can set default value like `value = "something"` for future task updates
        const description = this.props.description !== "" ?
            <span className={"description"}>{this.props.description}</span> : <></>;
        const timeline = <span className={"description"}>{this.props.timeline}</span>;
        const editButton = <button className={'button'} onClick={this.props.onClick}>Edit</button>;
        const expand = this.state.expanded ? (
            <div className={'button dropdown-item'}>
                {description}
                {timeline}
                {editButton}
            </div>
        ) : <></>;
        return (
            <>
                <button className={'button'} onClick={this.onClick}>
                    <span className={"event-name"}>{this.props.name}</span>
                </button>
                {expand}
            </>
        );
    }

}

export default TrayItem;